package com.example.anird.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

sealed interface SimulcastUiState {
    object Loading : SimulcastUiState
    data class Success(
        val schedulesByDay: Map<String, List<Anime>>,
        val selectedDay: String,
        val followingIds: Set<Int>
    ) : SimulcastUiState
    data class Error(val message: String) : SimulcastUiState
}

@HiltViewModel
class SimulcastsViewModel @Inject constructor(
    private val repository: AnimeRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<SimulcastUiState>(SimulcastUiState.Loading)
    val uiState: StateFlow<SimulcastUiState> = _uiState.asStateFlow()

    private val daysOfWeek = listOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")

    private var updateJob: Job? = null
    private var allAnimeSchedules: List<Anime> = emptyList()
    private var airingMap: Map<Int, Long> = emptyMap() // Map malId -> airingAt (timestamp Unix en segundos)
    private var airingEpisodes: Map<Int, Int> = emptyMap() // Map malId -> nro de episodio
    private var followingIds: Set<Int> = emptySet()

    init {
        loadSchedules()
    }

    fun loadSchedules() {
        updateJob?.cancel()
        viewModelScope.launch {
            val stale = runCatching { repository.getCachedSchedules() }.getOrNull()
            if (!stale.isNullOrEmpty()) {
                allAnimeSchedules = stale
                followingIds = runCatching { repository.getAllFollowingList().map { it.animeId }.toSet() }.getOrDefault(emptySet())
                updateCountdowns()
            } else {
                _uiState.value = SimulcastUiState.Loading
            }

            try {
                val fetched = repository.getSchedules(page = 1)
                if (fetched.isNotEmpty()) {
                    allAnimeSchedules = fetched
                }
                followingIds = repository.getAllFollowingList().map { it.animeId }.toSet()

                // Consultar AniList en chunks de ≤50 para no exceder límites de nodos GraphQL
                allAnimeSchedules.map { it.malId }.filter { it > 0 }.distinct().chunked(50).forEach { chunk ->
                    runCatching {
                        val batchAiring = repository.getNextAiringBatch(chunk)
                        val newAiringMap = batchAiring.associate { media ->
                            media.idMal to (media.nextAiringEpisode?.airingAt ?: 0L)
                        }.filterValues { it > 0 }
                        val newAiringEpisodes = batchAiring.associate { media ->
                            media.idMal to (media.nextAiringEpisode?.episode ?: 0)
                        }.filterValues { it > 0 }

                        airingMap = airingMap + newAiringMap
                        airingEpisodes = airingEpisodes + newAiringEpisodes
                    }
                }

                startCountdownTicker()

            } catch (e: java.io.IOException) {
                if (allAnimeSchedules.isEmpty()) {
                    _uiState.value = SimulcastUiState.Error("Sin conexión. Revisa tu red e inténtalo de nuevo.")
                }
            } catch (e: retrofit2.HttpException) {
                if (allAnimeSchedules.isEmpty()) {
                    _uiState.value = when (e.code()) {
                        429 -> SimulcastUiState.Error("Demasiadas peticiones a la API. Espera unos segundos.")
                        else -> SimulcastUiState.Error("Error del servidor (${e.code()}).")
                    }
                }
            } catch (e: Exception) {
                if (allAnimeSchedules.isEmpty()) {
                    _uiState.value = SimulcastUiState.Error("No se pudo cargar la programación.")
                }
            }
        }
    }

    private fun startCountdownTicker() {
        updateJob = viewModelScope.launch {
            while (true) {
                updateCountdowns()
                delay(60000) // Actualizar cada minuto
            }
        }
    }

    private fun updateCountdowns() {
        val nowSeconds = System.currentTimeMillis() / 1000

        allAnimeSchedules = allAnimeSchedules.map { anime ->
            val airingAt = airingMap[anime.malId] ?: 0L
            val episodeNum = airingEpisodes[anime.malId] ?: 0
            val formattedDate = if (airingAt > 0) {
                val timeRemaining = airingAt - nowSeconds
                if (timeRemaining > 0) {
                    val days = timeRemaining / 86400
                    val hours = (timeRemaining % 86400) / 3600
                    val mins = (timeRemaining % 3600) / 60
                    if (days > 0) {
                        "Ep $episodeNum en ${days}d ${hours}h"
                    } else if (hours > 0) {
                        "Ep $episodeNum en ${hours}h ${mins}m"
                    } else {
                        "Ep $episodeNum en ${mins}m"
                    }
                } else {
                    "Emitido (Ep $episodeNum)"
                }
            } else {
                null
            }
            anime.copy(nextEpisodeDate = formattedDate)
        }

        // Agrupamos por día de forma segura
        val grouped = mutableMapOf<String, MutableList<Anime>>()
        daysOfWeek.forEach { grouped[it] = mutableListOf() }

        allAnimeSchedules.forEach { anime ->
            val rawDay = (anime.broadcast?.day ?: anime.broadcast?.string ?: "").lowercase(Locale.ROOT)
            val matchedDay = daysOfWeek.find { day -> rawDay.contains(day) }
            if (matchedDay != null) {
                grouped[matchedDay]?.add(anime)
            } else {
                val airingAt = airingMap[anime.malId] ?: 0L
                if (airingAt > 0) {
                    val cal = Calendar.getInstance().apply { timeInMillis = airingAt * 1000L }
                    val inferredDay = when (cal.get(Calendar.DAY_OF_WEEK)) {
                        Calendar.MONDAY -> "monday"
                        Calendar.TUESDAY -> "tuesday"
                        Calendar.WEDNESDAY -> "wednesday"
                        Calendar.THURSDAY -> "thursday"
                        Calendar.FRIDAY -> "friday"
                        Calendar.SATURDAY -> "saturday"
                        Calendar.SUNDAY -> "sunday"
                        else -> "sunday"
                    }
                    grouped[inferredDay]?.add(anime)
                } else {
                    grouped["sunday"]?.add(anime)
                }
            }
        }

        val currentDay = (uiState.value as? SimulcastUiState.Success)?.selectedDay ?: getTodayDayKey()

        _uiState.value = SimulcastUiState.Success(
            schedulesByDay = grouped,
            selectedDay = currentDay,
            followingIds = followingIds
        )
    }

    private fun getTodayDayKey(): String {
        val calendar = Calendar.getInstance()
        return when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.MONDAY -> "monday"
            Calendar.TUESDAY -> "tuesday"
            Calendar.WEDNESDAY -> "wednesday"
            Calendar.THURSDAY -> "thursday"
            Calendar.FRIDAY -> "friday"
            Calendar.SATURDAY -> "saturday"
            Calendar.SUNDAY -> "sunday"
            else -> "sunday"
        }
    }

    fun selectDay(day: String) {
        val currentState = _uiState.value
        if (currentState is SimulcastUiState.Success) {
            _uiState.value = currentState.copy(selectedDay = day)
        }
    }

    override fun onCleared() {
        updateJob?.cancel()
        super.onCleared()
    }
}
