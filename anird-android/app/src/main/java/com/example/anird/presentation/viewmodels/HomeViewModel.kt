package com.example.anird.presentation.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asFlow
import androidx.lifecycle.viewModelScope
import com.example.anird.data.local.HistoryEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import com.example.anird.domain.usecase.GetHomeFeedUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface HomeUiState {
    object Loading : HomeUiState
    data class Success(
        val heroCarousel: List<Anime>,
        val continueWatching: List<HistoryEntity>,
        val simulcasts: List<Anime>,
        val topTen: List<Anime>,
        val latestEpisodes: List<Anime>,
        val movies: List<Anime>
    ) : HomeUiState
    data class Error(val message: String) : HomeUiState
}

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getHomeFeedUseCase: GetHomeFeedUseCase,
    private val repository: AnimeRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _refreshing = MutableStateFlow(false)
    val refreshing: StateFlow<Boolean> = _refreshing.asStateFlow()

    // Flujo de datos estáticos de la API (Trending, simulcasts, etc.)
    private val _apiFeedState = MutableStateFlow<ApiFeedState?>(null)

    // Combinamos el historial local reactivo (Room LiveData convertido a Flow) y la API
    val uiState: StateFlow<HomeUiState> = combine(
        repository.getContinueWatchingLive(limit = 20).asFlow(),
        _apiFeedState
    ) { continueWatchingList, apiState ->
        if (apiState == null) {
            HomeUiState.Loading
        } else if (apiState.isError) {
            HomeUiState.Error(apiState.errorMessage ?: "Error desconocido")
        } else {
            HomeUiState.Success(
                heroCarousel = apiState.heroCarousel,
                continueWatching = continueWatchingList,
                simulcasts = apiState.simulcasts,
                topTen = apiState.topTen,
                latestEpisodes = apiState.latestEpisodes,
                movies = apiState.movies
            )
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HomeUiState.Loading
    )

    init {
        loadHomeFeed()
    }

    fun loadHomeFeed() {
        viewModelScope.launch {
            _refreshing.value = true
            
            // Sincronizar desde la nube en segundo plano asíncronamente
            launch {
                try {
                    if (authRepository.isLoggedIn) {
                        Log.d("HomeViewModel", "Iniciando sincronización desde servidor al cargar feed...")
                        authRepository.syncFromServerFull()
                    }
                } catch (e: Exception) {
                    Log.e("HomeViewModel", "Error en sync asíncrono", e)
                }
            }

            try {
                val feed = getHomeFeedUseCase()
                _apiFeedState.value = ApiFeedState(
                    heroCarousel = feed.heroCarousel,
                    simulcasts = feed.simulcasts,
                    topTen = feed.topTen,
                    latestEpisodes = feed.latestEpisodes,
                    movies = feed.movies,
                    isError = false
                )
            } catch (e: Exception) {
                _apiFeedState.value = ApiFeedState(
                    isError = true,
                    errorMessage = e.localizedMessage ?: "Error al cargar contenido de la API"
                )
            } finally {
                _refreshing.value = false
            }
        }
    }
}

data class ApiFeedState(
    val heroCarousel: List<Anime> = emptyList(),
    val simulcasts: List<Anime> = emptyList(),
    val topTen: List<Anime> = emptyList(),
    val latestEpisodes: List<Anime> = emptyList(),
    val movies: List<Anime> = emptyList(),
    val isError: Boolean = false,
    val errorMessage: String? = null
)

