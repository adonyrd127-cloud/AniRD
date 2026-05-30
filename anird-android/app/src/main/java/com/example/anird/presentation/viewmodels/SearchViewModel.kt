package com.example.anird.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.anird.data.local.SearchHistoryEntity
import com.example.anird.data.model.Anime
import com.example.anird.domain.usecase.SearchAnimeUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface SearchUiState {
    object Idle : SearchUiState
    object Loading : SearchUiState
    data class Success(val results: List<Anime>) : SearchUiState
    data class Error(val message: String) : SearchUiState
}

@OptIn(FlowPreview::class)
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val searchAnimeUseCase: SearchAnimeUseCase
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _searchState = MutableStateFlow<SearchUiState>(SearchUiState.Idle)
    val searchState: StateFlow<SearchUiState> = _searchState.asStateFlow()

    val recentSearches: StateFlow<List<SearchHistoryEntity>> = searchAnimeUseCase.getRecentSearches()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        // Búsqueda en tiempo real reactiva al escribir con debouncing de 600ms
        viewModelScope.launch {
            _query
                .debounce(600)
                .filter { it.isNotBlank() }
                .distinctUntilChanged()
                .collect { trimmedQuery ->
                    performSearch(trimmedQuery)
                }
        }
    }

    fun onQueryChanged(newQuery: String) {
        _query.value = newQuery
        if (newQuery.isBlank()) {
            _searchState.value = SearchUiState.Idle
        }
    }

    fun performSearch(searchQuery: String) {
        if (searchQuery.isBlank()) return
        
        viewModelScope.launch {
            _searchState.value = SearchUiState.Loading
            try {
                val results = searchAnimeUseCase.executeSearch(searchQuery)
                _searchState.value = SearchUiState.Success(results)
            } catch (e: Exception) {
                _searchState.value = SearchUiState.Error(e.localizedMessage ?: "Error al buscar")
            }
        }
    }

    fun deleteRecentSearch(searchQuery: String) {
        viewModelScope.launch {
            searchAnimeUseCase.deleteRecentSearch(searchQuery)
        }
    }

    fun clearSearchHistory() {
        viewModelScope.launch {
            searchAnimeUseCase.clearHistory()
        }
    }
}
