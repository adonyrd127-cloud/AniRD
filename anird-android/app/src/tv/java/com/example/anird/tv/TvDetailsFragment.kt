package com.example.anird.tv

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.leanback.app.DetailsSupportFragment
import androidx.leanback.app.DetailsSupportFragmentBackgroundController
import androidx.leanback.widget.*
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.bumptech.glide.request.target.CustomTarget
import com.bumptech.glide.request.transition.Transition
import com.example.anird.R
import com.example.anird.data.local.HistoryEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.model.Episode
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import com.example.anird.tv.presenter.AnimeCardPresenter
import com.example.anird.tv.presenter.DetailsDescriptionPresenter
import com.example.anird.tv.presenter.EpisodePresenter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Fragmento de detalles de anime para Android TV.
 * Implementa Leanback DetailsSupportFragment, con fondo parallax del banner del anime,
 * botones de acción interactivos (Play/Resume, Favoritos, Mi Lista), carrusel de episodios
 * con miniaturas y barra de progreso real, y carrusel de recomendaciones relacionadas.
 */
class TvDetailsFragment : DetailsSupportFragment() {

    companion object {
        private const val TAG = "AniRD-TvDetails"
        private const val ACTION_PLAY = 1L
        private const val ACTION_FAV = 2L
        private const val ACTION_FOLLOW = 3L
        
        private const val ROW_DETAILS = 0
        private const val ROW_EPISODES = 1
        private const val ROW_RELATED = 2
    }

    private var malId: Int = 0
    private lateinit var animeRepo: AnimeRepository
    private lateinit var authRepo: AuthRepository
    private lateinit var detailsBackground: DetailsSupportFragmentBackgroundController

    private var currentAnime: Anime? = null
    private var localEpisodes: List<Episode> = emptyList()
    private var lastWatchedEpisodeNum: Int = 0

    private lateinit var rowsAdapter: ArrayObjectAdapter
    private lateinit var actionAdapter: ArrayObjectAdapter
    private lateinit var episodesAdapter: ArrayObjectAdapter
    private lateinit var relatedAdapter: ArrayObjectAdapter

    private lateinit var detailsRowPresenter: FullWidthDetailsOverviewRowPresenter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        malId = requireActivity().intent.getIntExtra("mal_id", 0)
        animeRepo = TvRepositoryProvider.getAnimeRepository(requireContext())
        authRepo = TvRepositoryProvider.getAuthRepository(requireContext())
        
        detailsBackground = DetailsSupportFragmentBackgroundController(this)
        
        setupPresenter()
        setupRows()
        
        loadAnimeDetails()
    }

    private fun setupPresenter() {
        // Carga la cabecera principal de detalles
        detailsRowPresenter = FullWidthDetailsOverviewRowPresenter(DetailsDescriptionPresenter())
        
        // Colores premium acordes al tema AniRD
        detailsRowPresenter.backgroundColor = ContextCompat.getColor(requireContext(), R.color.tv_surface)
        detailsRowPresenter.actionsBackgroundColor = ContextCompat.getColor(requireContext(), R.color.tv_surface_elevated)
        
        // Animaciones e interactividad en botones de acción
        val rowPresenterSelector = ClassPresenterSelector()
        rowPresenterSelector.addClassPresenter(DetailsOverviewRow::class.java, detailsRowPresenter)
        rowPresenterSelector.addClassPresenter(ListRow::class.java, ListRowPresenter())
        
        rowsAdapter = ArrayObjectAdapter(rowPresenterSelector)
        adapter = rowsAdapter
    }

    private fun setupRows() {
        // Inicializar carruseles vacíos listos para rellenarse
        episodesAdapter = ArrayObjectAdapter(EpisodePresenter())
        relatedAdapter = ArrayObjectAdapter(AnimeCardPresenter())
    }

    private fun setupListeners() {
        // Escucha clics en botones de acción principales (Play, Fav, Mi Lista)
        detailsRowPresenter.onActionClickedListener = OnActionClickedListener { action ->
            val anime = currentAnime ?: return@OnActionClickedListener
            when (action.id) {
                ACTION_PLAY -> {
                    // Si ya vio un episodio anterior, continuar desde el siguiente
                    val targetEp = localEpisodes.firstOrNull { it.number == lastWatchedEpisodeNum + 1 }
                        ?: localEpisodes.firstOrNull { it.number == lastWatchedEpisodeNum }
                        ?: localEpisodes.firstOrNull()
                    
                    if (targetEp != null) {
                        playEpisode(targetEp)
                    } else {
                        Toast.makeText(context, "No hay episodios disponibles para reproducir", Toast.LENGTH_SHORT).show()
                    }
                }
                ACTION_FAV -> {
                    lifecycleScope.launch {
                        val isFav = animeRepo.toggleFavorite(anime)
                        updateActionButtons(isFav, animeRepo.isFollowingLive(anime.malId).value == true)
                        Toast.makeText(
                            context,
                            if (isFav) "Agregado a favoritos" else "Quitado de favoritos",
                            Toast.LENGTH_SHORT
                        ).show()
                        // Enviar sync si está logueado
                        if (authRepo.isLoggedIn) {
                            launch { authRepo.syncToServer() }
                        }
                    }
                }
                ACTION_FOLLOW -> {
                    lifecycleScope.launch {
                        val isFollow = animeRepo.toggleFollowing(anime)
                        updateActionButtons(animeRepo.isFavoriteLive(anime.malId).value == true, isFollow)
                        Toast.makeText(
                            context,
                            if (isFollow) "Agregado a tu lista" else "Quitado de tu lista",
                            Toast.LENGTH_SHORT
                        ).show()
                        if (authRepo.isLoggedIn) {
                            launch { authRepo.syncToServer() }
                        }
                    }
                }
            }
        }

        // Escucha clics en carruseles inferiores (episodios y relacionados)
        setOnItemViewClickedListener { _, item, _, _ ->
            when (item) {
                is Episode -> {
                    playEpisode(item)
                }
                is Anime -> {
                    // Abrir detalles de anime recomendado
                    val intent = Intent(requireActivity(), TvDetailsActivity::class.java).apply {
                        putExtra("mal_id", item.malId)
                    }
                    startActivity(intent)
                    requireActivity().finish() // Para evitar navegación infinita apilada
                }
            }
        }
    }

    private fun loadAnimeDetails() {
        lifecycleScope.launch {
            try {
                // 1. Obtener metadatos oficiales de MyAnimeList/AniList (Jikan + AniList banner)
                val anime = animeRepo.getAnimeDetails(malId) ?: return@launch
                currentAnime = anime
                
                // Cargar banner de fondo dinámico
                loadBackdrop(anime.bannerUrl ?: anime.imageUrl)

                // 2. Obtener en paralelo datos de episodios de AniList (thumbnails) y scraper local (links)
                val aniListEpsDeferred = async { runCatching { animeRepo.getAniListEpisodes(malId) }.getOrElse { emptyList() } }
                val localResultDeferred = async { 
                    runCatching { animeRepo.searchLocal(anime.title, anime.titleEnglish, anime.titleJapanese) }.getOrNull()
                }

                val aniListEps = aniListEpsDeferred.await()
                val localResult = localResultDeferred.await()

                var episodesList = emptyList<Episode>()
                if (localResult != null) {
                    val info = animeRepo.getLocalAnimeInfo(localResult.url)
                    anime.localUrl = localResult.url
                    if (info != null) {
                        anime.bannerUrl = anime.bannerUrl ?: info.backdrop
                        anime.coverUrl = anime.coverUrl ?: info.image
                        
                        // Obtener historial local de Room
                        val historyList = animeRepo.getHistoryForAnime(malId)
                        lastWatchedEpisodeNum = historyList.maxByOrNull { it.updatedAt }?.episodeNumber ?: 0

                        episodesList = info.episodes.map { localEp ->
                            // Encontrar miniatura de AniList haciendo match por número de episodio
                            val thumbnail = aniListEps.getOrNull(localEp.number - 1)?.thumbnail
                            val dbProgress = historyList.find { it.episodeNumber == localEp.number }

                            Episode(
                                number = localEp.number,
                                title = localEp.title ?: "Episodio ${localEp.number}",
                                url = localEp.url,
                                thumbnailUrl = thumbnail,
                                watched = dbProgress?.progress ?: 0 >= ((dbProgress?.duration ?: 1) * 0.9f),
                                progressMs = dbProgress?.progress ?: 0,
                                durationMs = dbProgress?.duration ?: 0
                            )
                        }
                    }
                }
                localEpisodes = episodesList

                // 3. Cargar recomendaciones relacionadas en paralelo
                val related = runCatching { animeRepo.getAnimeRecommendations(malId) }.getOrElse { emptyList() }

                // 4. Mostrar en pantalla
                bindDetails(anime)
                bindEpisodesRow(episodesList)
                bindRelatedRow(related)

                setupListeners()

            } catch (e: Exception) {
                Log.e(TAG, "Error cargando detalles del anime", e)
                Toast.makeText(context, R.string.tv_error_loading, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun bindDetails(anime: Anime) {
        val detailsRow = DetailsOverviewRow(anime)
        
        // Agregar imagen del poster con Glide de manera asíncrona con esquinas redondeadas
        val cardWidth = resources.getDimensionPixelSize(R.dimen.tv_card_width)
        val cardHeight = resources.getDimensionPixelSize(R.dimen.tv_card_height)
        
        Glide.with(requireContext())
            .asBitmap()
            .load(anime.imageUrl)
            .override(cardWidth, cardHeight)
            .centerCrop()
            .transform(com.bumptech.glide.load.resource.bitmap.RoundedCorners(16))
            .into(object : CustomTarget<Bitmap>() {
                override fun onResourceReady(resource: Bitmap, transition: Transition<in Bitmap>?) {
                    detailsRow.setImageBitmap(requireContext(), resource)
                    detailsRow.isImageScaleUpAllowed = true
                }
                override fun onLoadCleared(placeholder: Drawable?) {}
            })

        // Botones de acción dinámicos
        actionAdapter = ArrayObjectAdapter()
        detailsRow.actionsAdapter = actionAdapter
        
        // Observar estado de favoritos y lista de seguimiento de manera reactiva para cambiar los botones
        animeRepo.isFavoriteLive(anime.malId).observe(viewLifecycleOwner) { isFav ->
            updateActionButtons(isFav, animeRepo.isFollowingLive(anime.malId).value == true)
        }
        animeRepo.isFollowingLive(anime.malId).observe(viewLifecycleOwner) { isFollow ->
            updateActionButtons(animeRepo.isFavoriteLive(anime.malId).value == true, isFollow)
        }

        rowsAdapter.add(ROW_DETAILS, detailsRow)
    }

    private fun updateActionButtons(isFavorite: Boolean, isFollowing: Boolean) {
        actionAdapter.clear()
        
        val playTitle = if (lastWatchedEpisodeNum > 0) {
            getString(R.string.tv_action_resume, lastWatchedEpisodeNum)
        } else {
            getString(R.string.tv_action_play)
        }
        
        actionAdapter.add(Action(ACTION_PLAY, playTitle))
        
        val favTitle = if (isFavorite) getString(R.string.tv_action_favorite_remove) else getString(R.string.tv_action_favorite_add)
        actionAdapter.add(Action(ACTION_FAV, favTitle))
        
        val followTitle = if (isFollowing) getString(R.string.tv_action_follow_remove) else getString(R.string.tv_action_follow_add)
        actionAdapter.add(Action(ACTION_FOLLOW, followTitle))
    }

    private fun bindEpisodesRow(episodes: List<Episode>) {
        if (episodes.isEmpty()) return
        episodesAdapter.clear()
        episodesAdapter.addAll(0, episodes)
        
        val header = HeaderItem(ROW_EPISODES.toLong(), getString(R.string.tv_episodes_header))
        rowsAdapter.add(ListRow(header, episodesAdapter))
    }

    private fun bindRelatedRow(animes: List<Anime>) {
        if (animes.isEmpty()) return
        relatedAdapter.clear()
        relatedAdapter.addAll(0, animes)
        
        val header = HeaderItem(ROW_RELATED.toLong(), getString(R.string.tv_related_header))
        rowsAdapter.add(ListRow(header, relatedAdapter))
    }

    private fun loadBackdrop(url: String?) {
        if (url == null) return
        Glide.with(requireContext())
            .asBitmap()
            .load(url)
            .into(object : CustomTarget<Bitmap>() {
                override fun onResourceReady(resource: Bitmap, transition: Transition<in Bitmap>?) {
                    detailsBackground.coverBitmap = resource
                    detailsBackground.enableParallax()
                }
                override fun onLoadCleared(placeholder: Drawable?) {}
            })
    }

    private fun playEpisode(ep: Episode) {
        val anime = currentAnime ?: return
        if (ep.url.isNullOrBlank()) {
            Toast.makeText(context, "Url de reproducción no disponible", Toast.LENGTH_SHORT).show()
            return
        }
        val intent = Intent(requireActivity(), TvPlayerActivity::class.java).apply {
            putExtra("episode_url", ep.url)
            putExtra("episode_number", ep.number)
            putExtra("anime_id", anime.malId)
            putExtra("anime_title", anime.displayTitle)
            putExtra("anime_cover", anime.imageUrl)
            
            // Pasar lista completa de episodios para prev/next en el reproductor
            val urls = localEpisodes.map { it.url ?: "" }.toTypedArray()
            val numbers = localEpisodes.map { it.number }.toIntArray()
            val titles = localEpisodes.map { it.displayTitle }.toTypedArray()
            
            putExtra("episodes_urls", urls)
            putExtra("episodes_numbers", numbers)
            putExtra("episodes_titles", titles)
        }
        startActivity(intent)
    }
}
