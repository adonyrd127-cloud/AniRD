package com.example.anird.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
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
        val selectedDay: String
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

    init {
        viewModelScope.launch {
            try {
                repository.clearCache()
            } catch (e: Exception) {
                // Silencioso
            }
            loadSchedules()
        }
    }

    fun loadSchedules() {
        viewModelScope.launch {
            _uiState.value = SimulcastUiState.Loading
            try {
                // Obtenemos los horarios de emisión semanales (Jikan API)
                val allSchedules = repository.getSchedules(page = 1)
                
                // Agrupamos por día
                val grouped = mutableMapOf<String, MutableList<Anime>>()
                daysOfWeek.forEach { grouped[it] = mutableListOf() }

                allSchedules.forEach { anime ->
                    val rawDay = anime.broadcast?.day?.lowercase(Locale.ROOT)?.trim() ?: ""
                    val broadcastDay = if (rawDay.endsWith("s")) rawDay.dropLast(1) else rawDay
                    if (broadcastDay.isNotEmpty() && broadcastDay in daysOfWeek) {
                        grouped[broadcastDay]?.add(anime)
                    } else {
                        // Fallback: si no tiene día de transmisión claro, agregamos a domingo
                        grouped["sunday"]?.add(anime)
                    }
                }

                // Obtener el día actual de la semana en inglés (ej. "monday")
                val calendar = Calendar.getInstance()
                val dayNum = calendar.get(Calendar.DAY_OF_WEEK)
                val currentDay = when (dayNum) {
                    Calendar.MONDAY -> "monday"
                    Calendar.TUESDAY -> "tuesday"
                    Calendar.WEDNESDAY -> "wednesday"
                    Calendar.THURSDAY -> "thursday"
                    Calendar.FRIDAY -> "friday"
                    Calendar.SATURDAY -> "saturday"
                    Calendar.SUNDAY -> "sunday"
                    else -> "sunday"
                }

                _uiState.value = SimulcastUiState.Success(
                    schedulesByDay = grouped,
                    selectedDay = currentDay
                )
            } catch (e: Exception) {
                _uiState.value = SimulcastUiState.Error(e.localizedMessage ?: "Error al cargar la programación")
            }
        }
    }

    fun selectDay(day: String) {
        val currentState = _uiState.value
        if (currentState is SimulcastUiState.Success) {
            _uiState.value = currentState.copy(selectedDay = day)
        }
    }
}
