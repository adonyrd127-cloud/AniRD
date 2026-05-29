package com.example.anird.data.repository

import android.util.Log
import com.example.anird.data.local.*
import com.example.anird.data.model.*
import com.example.anird.data.remote.LocalApiService
import com.example.anird.utils.JwtManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repositorio de autenticación y sincronización con el servidor.
 */
class AuthRepository(
    private val localApi: LocalApiService,
    private val jwtManager: JwtManager,
    private val db: AppDatabase
) {
    companion object {
        private const val TAG = "AniRD-Auth"
    }

    val isLoggedIn: Boolean get() = jwtManager.isLoggedIn()
    val username: String? get() = jwtManager.getUsername()

    suspend fun login(username: String, password: String): Result<AuthResponse> = withContext(Dispatchers.IO) {
        try {
            val response = localApi.login(AuthRequest(username, password))
            if (response.success && response.token != null) {
                jwtManager.saveToken(response.token)
                jwtManager.saveUsername(username)

                // Sincronizar datos del servidor al login
                response.syncData?.let { syncFromServer(it) }

                Log.d(TAG, "Login exitoso para $username")
                Result.success(response)
            } else {
                Result.failure(Exception(response.message ?: "Error de autenticación"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error en login", e)
            Result.failure(e)
        }
    }

    suspend fun register(username: String, password: String): Result<AuthResponse> = withContext(Dispatchers.IO) {
        try {
            val response = localApi.register(AuthRequest(username, password))
            if (response.success && response.token != null) {
                jwtManager.saveToken(response.token)
                jwtManager.saveUsername(username)
                Log.d(TAG, "Registro exitoso para $username")
                Result.success(response)
            } else {
                Result.failure(Exception(response.message ?: "Error al registrar"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error en registro", e)
            Result.failure(e)
        }
    }

    suspend fun logout() = withContext(Dispatchers.IO) {
        jwtManager.clear()
        db.favoriteDao().deleteAll()
        db.followingDao().deleteAll()
        db.historyDao().deleteAll()
        db.cacheDao().deleteAll()
        Log.d(TAG, "Sesión cerrada, datos locales eliminados")
    }

    /** Sincronizar datos locales al servidor */
    suspend fun syncToServer() = withContext(Dispatchers.IO) {
        if (!isLoggedIn) return@withContext
        try {
            val favorites = db.favoriteDao().getAllFavoritesList().map {
                SyncAnimeItem(it.animeId, it.title, it.cover, it.addedAt)
            }
            val following = db.followingDao().getAllFollowingList().map {
                SyncAnimeItem(it.animeId, it.title, it.cover, it.addedAt)
            }
            val history = db.historyDao().getAllHistory().map {
                SyncHistoryItem(
                    animeId = it.animeId,
                    episodeNumber = it.episodeNumber,
                    progress = it.progress,
                    duration = it.duration,
                    timestamp = it.timestamp,
                    updatedAt = it.updatedAt,
                    title = it.title,
                    cover = it.cover
                )
            }
            localApi.uploadSyncData(SyncUploadRequest(favorites, following, history))
            Log.d(TAG, "Datos sincronizados al servidor")
        } catch (e: Exception) {
            Log.e(TAG, "Error sincronizando al servidor", e)
        }
    }

    /** Obtener datos del servidor y merge con local */
    suspend fun syncFromServerFull() = withContext(Dispatchers.IO) {
        if (!isLoggedIn) return@withContext
        try {
            val response = localApi.getSyncData()
            if (response.success && response.syncData != null) {
                syncFromServer(response.syncData)
                Log.d(TAG, "Datos sincronizados desde servidor")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error sincronizando desde servidor", e)
        }
    }

    private suspend fun syncFromServer(data: SyncData) {
        // Merge favoritos
        for (item in data.favorites) {
            if (!db.favoriteDao().isFavoriteSync(item.animeId)) {
                db.favoriteDao().insert(
                    FavoriteEntity(item.animeId, item.title, item.cover, item.addedAt)
                )
            }
        }
        // Merge following
        for (item in data.following) {
            if (!db.followingDao().isFollowingSync(item.animeId)) {
                db.followingDao().insert(
                    FollowingEntity(item.animeId, item.title, item.cover, addedAt = item.addedAt)
                )
            }
        }
        // Merge historial (por timestamp)
        for (item in data.history) {
            val existing = db.historyDao().getHistoryForEpisode(item.animeId, item.episodeNumber)
            if (existing == null || item.updatedAt > existing.updatedAt) {
                db.historyDao().upsert(
                    HistoryEntity(
                        animeId = item.animeId,
                        episodeNumber = item.episodeNumber,
                        progress = item.progress,
                        duration = item.duration,
                        timestamp = item.timestamp,
                        updatedAt = item.updatedAt,
                        title = item.title,
                        cover = item.cover
                    )
                )
            }
        }
    }
}
