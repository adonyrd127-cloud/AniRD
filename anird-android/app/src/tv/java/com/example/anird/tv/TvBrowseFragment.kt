package com.example.anird.tv

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.leanback.app.BrowseSupportFragment
import androidx.leanback.widget.*
import androidx.lifecycle.lifecycleScope
import com.example.anird.R
import com.example.anird.data.local.FavoriteEntity
import com.example.anird.data.local.FollowingEntity
import com.example.anird.data.local.HistoryEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import com.example.anird.tv.presenter.AnimeCardPresenter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import com.example.anird.tv.presenter.TvIconHeaderItem
import com.example.anird.tv.presenter.TvIconHeaderPresenter

/**
 * Fragmento principal de exploración (Browse) para Android TV.
 * Carga dinámicamente filas de contenido: Historial, Favoritos, Lista de Seguimiento,
 * Tendencias, Lanzamientos de Temporada, Películas, Géneros y Ajustes de Cuenta.
 */
class TvBrowseFragment : BrowseSupportFragment() {

    companion object {
        private const val TAG = "AniRD-TvBrowse"
        private const val ROW_CONTINUE = 10
        private const val ROW_FAVORITES = 11
        private const val ROW_FOLLOWING = 12
        private const val ROW_TRENDING = 13
        private const val ROW_LATEST = 14
        private const val ROW_MOVIES = 15
        private const val ROW_DUBBED = 16
        private const val ROW_GENRE_ACTION = 17
        private const val ROW_GENRE_COMEDY = 18
        private const val ROW_SETTINGS = 19
    }

    private lateinit var animeRepo: AnimeRepository
    private lateinit var authRepo: AuthRepository
    private lateinit var rowsAdapter: ArrayObjectAdapter

    // Adaptadores para las filas que son de base de datos local (observados en LiveData)
    private val continueAdapter = ArrayObjectAdapter(AnimeCardPresenter())
    private val favoritesAdapter = ArrayObjectAdapter(AnimeCardPresenter())
    private val followingAdapter = ArrayObjectAdapter(AnimeCardPresenter())

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        animeRepo = TvRepositoryProvider.getAnimeRepository(requireContext())
        authRepo = TvRepositoryProvider.getAuthRepository(requireContext())
        
        setupUIElements()
        setupAdapters()
        setupListeners()
        
        loadApiRows()
        observeDatabaseRows()
    }

    private fun setupUIElements() {
        // En vez de título de texto, usar el logo de la aplicación
        badgeDrawable = ContextCompat.getDrawable(requireContext(), R.mipmap.ic_launcher)
        
        // Icono de búsqueda habilitado en la esquina superior izquierda
        headersState = HEADERS_ENABLED
        isHeadersTransitionOnBackEnabled = true
        
        // Color del panel lateral de navegación
        brandColor = ContextCompat.getColor(requireContext(), R.color.tv_surface)
        searchAffordanceColor = ContextCompat.getColor(requireContext(), R.color.tv_primary)
    }

    private fun setupAdapters() {
        val presenterSelector = ClassPresenterSelector()
        val customHeaderPresenter = TvIconHeaderPresenter()
        setHeaderPresenterSelector(presenterSelector.apply {
            addClassPresenter(Row::class.java, customHeaderPresenter)
            addClassPresenter(ListRow::class.java, customHeaderPresenter)
        })
        
        rowsAdapter = ArrayObjectAdapter(ListRowPresenter())
        adapter = rowsAdapter
    }

    private fun setupListeners() {
        // Clic en la barra de búsqueda nativa
        setOnSearchClickedListener {
            val intent = Intent(requireActivity(), TvSearchActivity::class.java)
            startActivity(intent)
        }

        // Clic en cualquier elemento de las filas
        onItemViewClickedListener = OnItemViewClickedListener { _, item, _, _ ->
            when (item) {
                is Anime -> {
                    // Abrir detalles del Anime
                    val intent = Intent(requireActivity(), TvDetailsActivity::class.java).apply {
                        putExtra("mal_id", item.malId)
                    }
                    startActivity(intent)
                }
                is TvSettingsItem -> {
                    handleSettingsClick(item)
                }
            }
        }
    }

    /**
     * Cargar filas provenientes de llamadas a las APIs en segundo plano (Jikan/AniList).
     */
    private fun loadApiRows() {
        lifecycleScope.launch {
            try {
                // Ejecutar solicitudes en paralelo para carga rápida sin retrasos
                val trendingDeferred = async { runCatching { animeRepo.getTrending() }.getOrNull() }
                val latestDeferred = async { runCatching { animeRepo.getLatest() }.getOrNull() }
                val moviesDeferred = async { runCatching { animeRepo.getMovies() }.getOrNull() }
                val dubbedDeferred = async { runCatching { animeRepo.getDubbed() }.getOrNull() }
                val actionDeferred = async { runCatching { animeRepo.getByGenre("1") }.getOrNull() } // 1 = Action
                val comedyDeferred = async { runCatching { animeRepo.getByGenre("4") }.getOrNull() } // 4 = Comedy

                val trending = trendingDeferred.await() ?: emptyList()
                val latest = latestDeferred.await() ?: emptyList()
                val movies = moviesDeferred.await() ?: emptyList()
                val dubbed = dubbedDeferred.await() ?: emptyList()
                val action = actionDeferred.await() ?: emptyList()
                val comedy = comedyDeferred.await() ?: emptyList()

                // Insertar filas si hay datos
                if (trending.isNotEmpty()) addAnimeRow(ROW_TRENDING, R.string.tv_header_trending, trending)
                if (latest.isNotEmpty()) addAnimeRow(ROW_LATEST, R.string.tv_header_latest, latest)
                if (movies.isNotEmpty()) addAnimeRow(ROW_MOVIES, R.string.tv_header_movies, movies)
                if (dubbed.isNotEmpty()) addAnimeRow(ROW_DUBBED, R.string.tv_header_dubbed, dubbed)
                if (action.isNotEmpty()) addAnimeRow(ROW_GENRE_ACTION, R.string.tv_header_action, action)
                if (comedy.isNotEmpty()) addAnimeRow(ROW_GENRE_COMEDY, R.string.tv_header_comedy, comedy)

                // Agregar la fila de ajustes de cuenta al final
                addSettingsRow()

            } catch (e: Exception) {
                Log.e(TAG, "Error cargando filas de API", e)
                Toast.makeText(context, R.string.tv_error_loading, Toast.LENGTH_LONG).show()
            }
        }
    }

    /**
     * Observar bases de datos locales (Room) en tiempo real para rellenar
     * Favoritos, Lista de Seguimiento e Historial dinámicamente.
     */
    private fun observeDatabaseRows() {
        // 1. Continuar Viendo (Historial)
        animeRepo.getContinueWatchingLive().observe(viewLifecycleOwner) { historyList ->
            updateDatabaseRow(
                rowId = ROW_CONTINUE,
                headerResId = R.string.tv_header_continue,
                adapter = continueAdapter,
                items = historyList.map { it.toAnime() }
            )
        }

        // 2. Mis Favoritos
        animeRepo.getFavoritesLive().observe(viewLifecycleOwner) { favList ->
            updateDatabaseRow(
                rowId = ROW_FAVORITES,
                headerResId = R.string.tv_header_favorites,
                adapter = favoritesAdapter,
                items = favList.map { it.toAnime() }
            )
        }

        // 3. Mi Lista (Seguimiento)
        animeRepo.getFollowingLive().observe(viewLifecycleOwner) { followList ->
            updateDatabaseRow(
                rowId = ROW_FOLLOWING,
                headerResId = R.string.tv_header_following,
                adapter = followingAdapter,
                items = followList.map { it.toAnime() }
            )
        }
    }

    private fun addAnimeRow(rowId: Int, headerResId: Int, list: List<Anime>) {
        val listRowAdapter = ArrayObjectAdapter(AnimeCardPresenter())
        listRowAdapter.addAll(0, list)
        
        val iconResId = when(rowId) {
            ROW_TRENDING -> R.drawable.ic_sidebar_home
            ROW_LATEST -> R.drawable.ic_sidebar_explore
            ROW_MOVIES -> R.drawable.ic_sidebar_explore
            ROW_DUBBED -> R.drawable.ic_sidebar_explore
            else -> R.drawable.ic_sidebar_explore
        }
        
        val header = TvIconHeaderItem(rowId.toLong(), getString(headerResId), iconResId)
        rowsAdapter.add(ListRow(header, listRowAdapter))
    }

    /**
     * Inserta, actualiza o remueve una fila de la base de datos de manera dinámica y reactiva.
     */
    private fun updateDatabaseRow(rowId: Int, headerResId: Int, adapter: ArrayObjectAdapter, items: List<Anime>) {
        adapter.clear()
        
        if (items.isEmpty()) {
            // Si no hay elementos, removemos la fila de la pantalla
            removeRowById(rowId)
            return
        }
        
        adapter.addAll(0, items)
        
        // Si la fila ya existe en la UI, no la duplicamos, solo actualizamos
        val existingRowIndex = findRowIndexById(rowId)
        if (existingRowIndex != -1) {
            return
        }

        // Agregar al inicio del BrowseFragment para que tenga alta prioridad visual
        val iconResId = when(rowId) {
            ROW_CONTINUE -> R.drawable.ic_sidebar_history
            ROW_FAVORITES -> R.drawable.ic_sidebar_favorites
            ROW_FOLLOWING -> R.drawable.ic_sidebar_favorites
            else -> R.drawable.ic_sidebar_explore
        }
        val header = TvIconHeaderItem(rowId.toLong(), getString(headerResId), iconResId)
        val listRow = ListRow(header, adapter)
        
        // Insertamos al principio (posición 0 o justo después de otra fila de base de datos)
        var insertPos = 0
        if (rowId == ROW_FAVORITES && findRowIndexById(ROW_CONTINUE) != -1) {
            insertPos = 1
        } else if (rowId == ROW_FOLLOWING) {
            if (findRowIndexById(ROW_FAVORITES) != -1) insertPos = findRowIndexById(ROW_FAVORITES) + 1
            else if (findRowIndexById(ROW_CONTINUE) != -1) insertPos = 1
        }
        
        if (insertPos < rowsAdapter.size()) {
            rowsAdapter.add(insertPos, listRow)
        } else {
            rowsAdapter.add(listRow)
        }
    }

    private fun removeRowById(rowId: Int) {
        val index = findRowIndexById(rowId)
        if (index != -1) {
            val row = rowsAdapter.get(index)
            if (row != null) {
                rowsAdapter.remove(row)
            }
        }
    }

    private fun findRowIndexById(rowId: Int): Int {
        for (i in 0 until rowsAdapter.size()) {
            val row = rowsAdapter.get(i) as? ListRow
            if (row?.id == rowId.toLong()) {
                return i
            }
        }
        return -1
    }

    // --- Fila de Ajustes de Cuenta y Utilidades ---

    private fun addSettingsRow() {
        val settingsCardPresenter = object : Presenter() {
            override fun onCreateViewHolder(parent: ViewGroup): Presenter.ViewHolder {
                val cardView = object : ImageCardView(parent.context) {
                    override fun setSelected(selected: Boolean) {
                        super.setSelected(selected)
                        if (selected) {
                            setBackgroundColor(ContextCompat.getColor(context, R.color.tv_primary))
                        } else {
                            setBackgroundColor(ContextCompat.getColor(context, R.color.tv_surface_card))
                        }
                    }
                }
                cardView.isFocusable = true
                cardView.isFocusableInTouchMode = true
                val width = parent.resources.getDimensionPixelSize(R.dimen.tv_card_width)
                val height = parent.resources.getDimensionPixelSize(R.dimen.tv_card_width) // Cuadrado para ajustes
                cardView.setMainImageDimensions(width, height)
                cardView.cardType = BaseCardView.CARD_TYPE_INFO_UNDER_WITH_EXTRA
                cardView.infoAreaBackground = ContextCompat.getDrawable(parent.context, R.color.tv_surface_card)
                return Presenter.ViewHolder(cardView)
            }

            override fun onBindViewHolder(viewHolder: Presenter.ViewHolder, item: Any?) {
                val settingsItem = item as? TvSettingsItem ?: return
                val cardView = viewHolder.view as ImageCardView
                cardView.titleText = settingsItem.title
                cardView.contentText = settingsItem.description
                
                // Mostrar ícono premium específico para cada opción de ajustes
                if (settingsItem.iconResId != 0) {
                    cardView.mainImageView?.setImageResource(settingsItem.iconResId)
                } else {
                    cardView.mainImageView?.setImageResource(R.mipmap.ic_launcher)
                }
                cardView.mainImageView?.setPadding(32, 32, 32, 32)
            }

            override fun onUnbindViewHolder(viewHolder: Presenter.ViewHolder) {
                val cardView = viewHolder.view as ImageCardView
                cardView.mainImageView?.setImageDrawable(null)
            }
        }

        val listRowAdapter = ArrayObjectAdapter(settingsCardPresenter)
        
        // Rellenar opciones según estado de sesión
        val isLogged = authRepo.isLoggedIn
        val userText = if (isLogged) authRepo.username ?: "" else "Invitado"

        listRowAdapter.add(
            TvSettingsItem(
                id = 1,
                title = if (isLogged) "Cerrar Sesión" else "Iniciar Sesión",
                description = "Usuario: $userText",
                iconResId = R.drawable.ic_settings_login
            )
        )
        listRowAdapter.add(
            TvSettingsItem(
                id = 2,
                title = "Sincronizar Datos",
                description = "Forzar sincronización en la nube",
                iconResId = R.drawable.ic_settings_sync
            )
        )
        listRowAdapter.add(
            TvSettingsItem(
                id = 3,
                title = "Limpiar Caché",
                description = "Eliminar portadas y metadatos cacheados",
                iconResId = R.drawable.ic_settings_cache
            )
        )

        val prefs = requireContext().getSharedPreferences("anird_tv_prefs", android.content.Context.MODE_PRIVATE)
        val defaultAudio = prefs.getString("default_audio", "sub") ?: "sub"
        val audioText = if (defaultAudio == "sub") "Japonés (Sub)" else "Español (Latino)"

        listRowAdapter.add(
            TvSettingsItem(
                id = 4,
                title = "Audio por Defecto",
                description = "Actual: $audioText",
                iconResId = R.drawable.ic_settings_audio
            )
        )

        val header = TvIconHeaderItem(ROW_SETTINGS.toLong(), getString(R.string.tv_settings_title), R.drawable.ic_sidebar_profile)
        rowsAdapter.add(ListRow(header, listRowAdapter))
    }

    private fun handleSettingsClick(item: TvSettingsItem) {
        when (item.id) {
            1 -> { // Login / Logout
                if (authRepo.isLoggedIn) {
                    lifecycleScope.launch {
                        authRepo.logout()
                        Toast.makeText(context, "Sesión cerrada correctamente", Toast.LENGTH_SHORT).show()
                        // Recargar el fragmento para refrescar la fila de ajustes
                        requireActivity().recreate()
                    }
                } else {
                    val intent = Intent(requireActivity(), TvLoginActivity::class.java)
                    startActivity(intent)
                }
            }
            2 -> { // Sync
                if (!authRepo.isLoggedIn) {
                    Toast.makeText(context, "Debes iniciar sesión para sincronizar", Toast.LENGTH_SHORT).show()
                    return
                }
                lifecycleScope.launch {
                    Toast.makeText(context, "Sincronizando...", Toast.LENGTH_SHORT).show()
                    authRepo.syncFromServerFull()
                    authRepo.syncToServer()
                    Toast.makeText(context, R.string.tv_settings_sync_done, Toast.LENGTH_SHORT).show()
                }
            }
            3 -> { // Clear cache
                lifecycleScope.launch {
                    animeRepo.clearCache()
                    Toast.makeText(context, R.string.tv_settings_cache_done, Toast.LENGTH_SHORT).show()
                }
            }
            4 -> { // Default Audio
                val prefs = requireContext().getSharedPreferences("anird_tv_prefs", android.content.Context.MODE_PRIVATE)
                val current = prefs.getString("default_audio", "sub") ?: "sub"
                val next = if (current == "sub") "dub" else "sub"
                prefs.edit().putString("default_audio", next).apply()
                Toast.makeText(context, "Idioma por defecto cambiado", Toast.LENGTH_SHORT).show()
                requireActivity().recreate()
            }
        }
    }

    // --- Extensores de conversión a Anime model ---

    private fun FavoriteEntity.toAnime() = Anime(
        malId = animeId,
        title = title,
        coverUrl = cover
    )

    private fun FollowingEntity.toAnime() = Anime(
        malId = animeId,
        title = title,
        coverUrl = cover
    )

    private fun HistoryEntity.toAnime() = Anime(
        malId = animeId,
        title = "Ep. $episodeNumber • ${title ?: "Anime"}",
        coverUrl = cover
    )
}

data class TvSettingsItem(
    val id: Int,
    val title: String,
    val description: String? = null,
    val iconResId: Int = 0
)
