package com.example.anird.presentation.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.anird.data.local.EpisodeDao
import com.example.anird.data.local.EpisodeEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.model.AnimeCharacter
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import com.example.anird.domain.usecase.DetailedAnimeResult
import com.example.anird.domain.usecase.GetAnimeDetailsUseCase
import com.example.anird.domain.usecase.ResolvedRelationGroup
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject
 
sealed interface DetailUiState {
    object Loading : DetailUiState
    data class Success(
        val anime: Anime,
        val characters: List<AnimeCharacter>,
        val relations: List<ResolvedRelationGroup>,
        val recommendations: List<Anime>,
        val episodes: List<EpisodeEntity>,
        val isFavorite: Boolean,
        val isFollowing: Boolean
    ) : DetailUiState
    data class Error(val message: String) : DetailUiState
}
 
@HiltViewModel
class DetailViewModel @Inject constructor(
    private val getAnimeDetailsUseCase: GetAnimeDetailsUseCase,
    private val repository: AnimeRepository,
    private val episodeDao: EpisodeDao,
    private val authRepository: AuthRepository
) : ViewModel() {
 
    companion object {
        private const val TAG = "DetailVM"
    }

    private val _uiState = MutableStateFlow<DetailUiState>(DetailUiState.Loading)
    val uiState: StateFlow<DetailUiState> = _uiState.asStateFlow()

    private var currentAnimeId: Int = 0

    fun loadAnimeDetails(malId: Int) {
        currentAnimeId = malId
        viewModelScope.launch {
            _uiState.value = DetailUiState.Loading
            try {
                // 1. Obtener detalles básicos/completos de Jikan y AniList
                val detailsResult = getAnimeDetailsUseCase(malId)
                val anime = detailsResult.anime
                if (anime == null) {
                    _uiState.value = DetailUiState.Error("No se encontraron detalles para este anime")
                    return@launch
                }

                // 2. Observar estado reactivo de favoritos y seguimiento de Room
                val isFavoriteFlow = repository.isFavoriteFlow(malId)
                val isFollowingFlow = repository.isFollowingFlow(malId)

                // 3. Obtener/Sincronizar episodios desde el scraper local en segundo plano
                viewModelScope.launch {
                    fetchAndSyncEpisodes(anime)
                }

                // 4. Observar episodios desde la base de datos (Room es la fuente única de verdad)
                val episodesFlow = episodeDao.getEpisodesForAnimeFlow(malId)

                // Combinamos todo en un flujo reactivo para actualizar la UI instantáneamente
                combine(
                    isFavoriteFlow,
                    isFollowingFlow,
                    episodesFlow
                ) { isFav, isFollow, episodesList ->
                    DetailUiState.Success(
                        anime = anime,
                        characters = detailsResult.characters,
                        relations = detailsResult.relations,
                        recommendations = detailsResult.recommendations,
                        episodes = episodesList,
                        isFavorite = isFav ?: false,
                        isFollowing = isFollow ?: false
                    )
                }.collect { combinedState ->
                    _uiState.value = combinedState
                }

            } catch (e: Exception) {
                Log.e(TAG, "Error cargando ficha técnica del anime $malId", e)
                _uiState.value = DetailUiState.Error(e.localizedMessage ?: "Error al cargar la información")
            }
        }
    }

    /**
     * Sincroniza los episodios con el scraper local y los guarda en Room.
     */
    private suspend fun fetchAndSyncEpisodes(anime: Anime) {
        try {
            // Buscamos el anime en el catálogo del backend local
            val localResult = repository.searchLocal(anime.title, anime.titleEnglish, anime.titleJapanese)
            if (localResult != null) {
                val localInfo = repository.getLocalAnimeInfo(localResult.url)
                if (localInfo != null && localInfo.episodes.isNotEmpty()) {
                    // Obtenemos episodios de AniList para las miniaturas (thumbnails)
                    val aniListEpisodes = try {
                        repository.getAniListEpisodes(anime.malId)
                    } catch (e: Exception) {
                        emptyList()
                    }

                    // Mapeamos los episodios a entidades Room para guardarlos
                    val entities = localInfo.episodes.mapIndexed { index, ep ->
                        val epId = "${anime.malId}_${ep.number}"
                        // Consultamos si ya existe el episodio para no pisar el progreso local
                        val existing = episodeDao.getEpisodeById(epId)
                        
                        // Buscar la miniatura correspondiente en AniList
                        val matchedAniListEp = aniListEpisodes.firstOrNull { anilistEp ->
                            val parsedNum = anilistEp.title?.replace(Regex("[^0-9]"), "")?.toIntOrNull()
                            parsedNum == ep.number
                        } ?: aniListEpisodes.getOrNull(index) // Fallback al index si no hay coincidencia exacta de número
                        
                        val thumbUrl = if (!matchedAniListEp?.thumbnail.isNullOrBlank()) matchedAniListEp?.thumbnail else anime.imageUrl
 
                        EpisodeEntity(
                            id = epId,
                            animeMalId = anime.malId,
                            episodeNumber = ep.number,
                            title = ep.title ?: "Episodio ${ep.number}",
                            thumbnailUrl = thumbUrl, // Poblado con la miniatura de AniList o portada de fallback!
                            videoUrl = ep.url,    // Guardamos la URL de la página del episodio para resolver servidores al reproducir
                            durationSeconds = existing?.durationSeconds,
                            watchedProgressMs = existing?.watchedProgressMs,
                            isDownloaded = existing?.isDownloaded ?: false,
                            localPath = existing?.localPath
                        )
                    }
                    episodeDao.insertAll(entities)
                    Log.d(TAG, "Sincronizados ${entities.size} episodios para ${anime.title} en Room")
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "No se pudo sincronizar episodios locales para ${anime.title}: ${e.message}")
        }
    }

    fun toggleFavorite(anime: Anime) {
        viewModelScope.launch {
            try {
                repository.toggleFavorite(anime)
                authRepository.syncToServer()
            } catch (e: Exception) {
                Log.e(TAG, "Error al cambiar favorito", e)
            }
        }
    }

    fun toggleFollowing(anime: Anime) {
        viewModelScope.launch {
            try {
                repository.toggleFollowing(anime)
                authRepository.syncToServer()
            } catch (e: Exception) {
                Log.e(TAG, "Error al cambiar seguimiento", e)
            }
        }
    }
}
