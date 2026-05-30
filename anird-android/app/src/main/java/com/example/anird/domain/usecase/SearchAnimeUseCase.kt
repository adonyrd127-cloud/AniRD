package com.example.anird.domain.usecase

import com.example.anird.data.local.SearchHistoryEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.local.AppDatabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

/**
 * Caso de uso para gestionar la búsqueda de anime (Jikan y local) e historial de consultas.
 */
class SearchAnimeUseCase @Inject constructor(
    private val repository: AnimeRepository,
    private val database: AppDatabase
) {
    private val searchHistoryDao get() = database.searchHistoryDao()

    /**
     * Realiza una búsqueda. Si la consulta está vacía, devuelve el trending de Jikan.
     */
    suspend fun executeSearch(query: String): List<Anime> = withContext(Dispatchers.IO) {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) {
            repository.getTrending(page = 1)
        } else {
            // Guardar en el historial de búsqueda local
            try {
                searchHistoryDao.insertSearch(SearchHistoryEntity(trimmed, System.currentTimeMillis()))
            } catch (e: Exception) {
                // Silencioso
            }
            repository.searchJikan(trimmed)
        }
    }

    /**
     * Obtiene el historial reciente de búsquedas.
     */
    fun getRecentSearches(): Flow<List<SearchHistoryEntity>> {
        return searchHistoryDao.getRecentSearches(limit = 10)
    }

    /**
     * Elimina una consulta de búsqueda del historial.
     */
    suspend fun deleteRecentSearch(query: String) = withContext(Dispatchers.IO) {
        searchHistoryDao.deleteSearch(query)
    }

    /**
     * Borra todo el historial de búsquedas.
     */
    suspend fun clearHistory() = withContext(Dispatchers.IO) {
        searchHistoryDao.clearAll()
    }
}
