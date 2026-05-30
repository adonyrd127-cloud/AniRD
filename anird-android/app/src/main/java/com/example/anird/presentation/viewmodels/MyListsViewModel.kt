package com.example.anird.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.asFlow
import androidx.lifecycle.viewModelScope
import com.example.anird.data.local.FavoriteEntity
import com.example.anird.data.local.FollowingEntity
import com.example.anird.data.repository.AnimeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import javax.inject.Inject

data class MyListsUiState(
    val favorites: List<FavoriteEntity> = emptyList(),
    val following: List<FollowingEntity> = emptyList()
)

@HiltViewModel
class MyListsViewModel @Inject constructor(
    private val repository: AnimeRepository
) : ViewModel() {

    val uiState: StateFlow<MyListsUiState> = combine(
        repository.getFavoritesLive().asFlow(),
        repository.getFollowingLive().asFlow()
    ) { favorites, following ->
        MyListsUiState(
            favorites = favorites ?: emptyList(),
            following = following ?: emptyList()
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = MyListsUiState()
    )
}
