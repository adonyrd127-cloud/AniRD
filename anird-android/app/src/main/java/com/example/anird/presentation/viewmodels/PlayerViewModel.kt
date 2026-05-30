package com.example.anird.presentation.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.anird.data.local.AnimeLibraryDao
import com.example.anird.data.local.EpisodeDao
import com.example.anird.data.local.EpisodeEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.model.StreamServer
import com.example.anird.data.repository.AnimeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface PlayerUiState {
    object Loading : PlayerUiState
    data class Success(
        val episode: EpisodeEntity,
        val anime: Anime?,
        val servers: List<StreamServer>,
        val currentServer: StreamServer,
        val subOrDub: String // "sub" or "dub"
    ) : PlayerUiState
    data class Error(val message: String) : PlayerUiState
}

@HiltViewModel
class PlayerViewModel @Inject constructor(
    private val repository: AnimeRepository,
    private val episodeDao: EpisodeDao,
    private val animeLibraryDao: AnimeLibraryDao
) : ViewModel() {

    companion object {
        private const val TAG = "PlayerVM"
    }

    private val _uiState = MutableStateFlow<PlayerUiState>(PlayerUiState.Loading)
    val uiState: StateFlow<PlayerUiState> = _uiState.asStateFlow()

    private var currentMalId: Int = 0
    private var currentEpisodeNumber: Int = 1

    fun loadEpisodeVideo(malId: Int, episodeNumber: Int) {
        currentMalId = malId
        currentEpisodeNumber = episodeNumber

        viewModelScope.launch {
            _uiState.value = PlayerUiState.Loading
            try {
                // 1. Obtener la metadata del anime y del episodio de la BD local
                val anime = repository.getAnimeBasicInfo(malId)
                val episodeId = "${malId}_$episodeNumber"
                val episode = episodeDao.getEpisodeById(episodeId)

                if (episode == null || episode.videoUrl.isNullOrBlank()) {
                    _uiState.value = PlayerUiState.Error("No se encontró información del episodio para reproducir")
                    return@launch
                }

                // 2. Resolver los servidores de streaming usando scraping local
                val streams = repository.getStreamServers(episode.videoUrl)
                val subServers = streams.sub
                val dubServers = streams.dub

                // Preferimos subtitulado por defecto, fallback a doblaje
                val servers = if (subServers.isNotEmpty()) subServers else dubServers
                val subOrDub = if (subServers.isNotEmpty()) "sub" else "dub"

                if (servers.isEmpty()) {
                    _uiState.value = PlayerUiState.Error("No se encontraron enlaces de reproducción disponibles para este episodio")
                    return@launch
                }

                // 3. Seleccionar el primer servidor por defecto
                val defaultServer = servers.first()

                _uiState.value = PlayerUiState.Success(
                    episode = episode,
                    anime = anime,
                    servers = servers,
                    currentServer = defaultServer,
                    subOrDub = subOrDub
                )

            } catch (e: Exception) {
                Log.e(TAG, "Error cargando reproductores para el episodio $episodeNumber", e)
                _uiState.value = PlayerUiState.Error(e.localizedMessage ?: "Error al resolver enlaces de video")
            }
        }
    }

    fun selectServer(server: StreamServer) {
        val currentState = _uiState.value
        if (currentState is PlayerUiState.Success) {
            _uiState.value = currentState.copy(currentServer = server)
        }
    }

    fun selectLanguage(lang: String) {
        viewModelScope.launch {
            val currentState = _uiState.value
            if (currentState is PlayerUiState.Success) {
                _uiState.value = PlayerUiState.Loading
                try {
                    val streams = repository.getStreamServers(currentState.episode.videoUrl ?: "")
                    val servers = if (lang == "dub") streams.dub else streams.sub
                    if (servers.isNotEmpty()) {
                        _uiState.value = currentState.copy(
                            servers = servers,
                            currentServer = servers.first(),
                            subOrDub = lang
                        )
                    } else {
                        // Volvemos al estado anterior si no hay servidores en ese idioma
                        _uiState.value = currentState
                    }
                } catch (e: Exception) {
                    _uiState.value = currentState
                }
            }
        }
    }

    /**
     * Guarda de forma reactiva el progreso de reproducción en Room.
     */
    fun saveWatchProgress(progressMs: Long, durationMs: Long) {
        val currentState = _uiState.value
        if (currentState is PlayerUiState.Success) {
            viewModelScope.launch {
                try {
                    // 1. Guardar el progreso del episodio específico
                    episodeDao.updateEpisodeProgress(currentState.episode.id, progressMs)
                    
                    // 2. Actualizar el historial rápido de visualización
                    repository.saveProgress(
                        animeId = currentMalId,
                        episodeNumber = currentEpisodeNumber,
                        progress = progressMs,
                        duration = durationMs,
                        title = currentState.anime?.displayTitle ?: "Anime",
                        cover = currentState.anime?.imageUrl
                    )

                    // 3. Sincronizar con el modelo principal de biblioteca local
                    animeLibraryDao.updateWatchProgress(
                        malId = currentMalId,
                        episode = currentEpisodeNumber,
                        progressMs = progressMs
                    )
                } catch (e: Exception) {
                    // Silencioso
                }
            }
        }
    }
}
