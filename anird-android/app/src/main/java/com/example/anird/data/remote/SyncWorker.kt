package com.example.anird.data.remote

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.anird.data.local.AppDatabase
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent

/**
 * Worker periódico en segundo plano para sincronización bidireccional automática
 * y alerta de nuevos episodios de anime en emisión (Favoritos y Siguiendo).
 */
class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    companion object {
        private const val TAG = "AniRD-SyncWorker"
    }

    @EntryPoint
    @InstallIn(SingletonComponent::class)
    interface SyncEntryPoint {
        fun authRepository(): AuthRepository
        fun animeRepository(): AnimeRepository
    }

    override suspend fun doWork(): Result {
        Log.d(TAG, "Iniciando tarea periódica de sincronización y alertas...")
        return try {
            val entryPoint = EntryPointAccessors.fromApplication(
                applicationContext,
                SyncEntryPoint::class.java
            )
            val authRepository = entryPoint.authRepository()
            val animeRepository = entryPoint.animeRepository()

            // 1. Chequear nuevos episodios de los anime que sigue o tiene en favoritos el usuario
            val prefs = applicationContext.getSharedPreferences("anird_prefs", Context.MODE_PRIVATE)
            val notifsEnabled = prefs.getBoolean("new_episodes_notif_enabled", true)
            if (notifsEnabled) {
                try {
                    checkForNewEpisodes(animeRepository)
                } catch (e: Exception) {
                    Log.e(TAG, "Error chequeando nuevos episodios en segundo plano", e)
                }
            }

            // 2. Sincronización en la nube (si el usuario está logueado)
            if (authRepository.isLoggedIn) {
                authRepository.syncToServer()
                authRepository.syncFromServerFull()
                Log.d(TAG, "Sincronización periódica completada con éxito.")
            } else {
                Log.d(TAG, "Usuario no autenticado, omitiendo sincronización.")
            }
            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Error durante la sincronización periódica en segundo plano", e)
            Result.retry()
        }
    }

    private suspend fun checkForNewEpisodes(animeRepository: AnimeRepository) {
        val followingList = animeRepository.getAllFollowingList()
        val favoritesList = animeRepository.getAllFavoritesList()

        if (followingList.isEmpty() && favoritesList.isEmpty()) return

        val db = AppDatabase.getInstance(applicationContext)
        val followingDao = db.followingDao()
        val prefs = applicationContext.getSharedPreferences("anird_prefs", Context.MODE_PRIVATE)

        // Combinar en un mapa único indexado por malId para evitar repeticiones y rastrear ambos tipos
        val trackedMap = mutableMapOf<Int, TrackedInfo>()
        
        favoritesList.forEach { fav ->
            trackedMap[fav.animeId] = TrackedInfo(
                animeId = fav.animeId,
                title = fav.title,
                cover = fav.cover,
                lastKnownEpisode = prefs.getInt("last_episode_${fav.animeId}", 0),
                isFollowing = false
            )
        }
        
        followingList.forEach { fol ->
            val existing = trackedMap[fol.animeId]
            val lastEp = if (existing != null) {
                maxOf(existing.lastKnownEpisode, fol.lastKnownEpisode)
            } else {
                fol.lastKnownEpisode
            }
            trackedMap[fol.animeId] = TrackedInfo(
                animeId = fol.animeId,
                title = fol.title,
                cover = fol.cover,
                lastKnownEpisode = lastEp,
                isFollowing = true,
                followingEntity = fol
            )
        }

        val malIds = trackedMap.keys.toList()
        val batchAiring = animeRepository.getNextAiringBatch(malIds)
        val airingMap = batchAiring.associateBy { it.idMal }

        trackedMap.values.forEach { tracked ->
            val aniListMedia = airingMap[tracked.animeId]
            val nextAiring = aniListMedia?.nextAiringEpisode
            if (nextAiring != null && nextAiring.episode > tracked.lastKnownEpisode) {
                // Si el episodio se transmite hoy, o ya se transmitió (timeUntilAiring <= 3600 segundos = 1 hora)
                if (nextAiring.timeUntilAiring <= 3600) {
                    showNotification(
                        animeId = tracked.animeId,
                        animeTitle = tracked.title,
                        episodeNumber = nextAiring.episode
                    )
                    
                    // Actualizar el lastKnownEpisode en Preferences
                    prefs.edit().putInt("last_episode_${tracked.animeId}", nextAiring.episode).apply()

                    // Si es un anime que sigue activamente (Following), también actualizar Room para consistencia
                    if (tracked.isFollowing && tracked.followingEntity != null) {
                        followingDao.insert(tracked.followingEntity.copy(lastKnownEpisode = nextAiring.episode))
                    }
                    Log.d(TAG, "Notificación enviada para ${tracked.title} (Episodio ${nextAiring.episode})")
                }
            }
        }
    }

    private fun showNotification(animeId: Int, animeTitle: String, episodeNumber: Int) {
        // Guardar en el historial de notificaciones locales de la app
        val prefs = applicationContext.getSharedPreferences("anird_prefs", Context.MODE_PRIVATE)
        val historySet = prefs.getStringSet("notification_history_set", emptySet())?.toMutableSet() ?: mutableSetOf()
        val newItem = "$animeId|$animeTitle|$episodeNumber|${System.currentTimeMillis()}"
        historySet.add(newItem)
        prefs.edit().putStringSet("notification_history_set", historySet).apply()

        val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Intent para abrir el detalle del anime a través del Deep Link
        val intent = Intent(applicationContext, com.example.anird.MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse("anird://detail/$animeId")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val pendingIntent = PendingIntent.getActivity(
            applicationContext,
            animeId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Acción rápida: "VER AHORA" (abre el reproductor del nuevo episodio si se pulsa)
        val watchIntent = Intent(applicationContext, com.example.anird.MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse("anird://detail/$animeId?play=true")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        
        val watchPendingIntent = PendingIntent.getActivity(
            applicationContext,
            animeId + 100000,
            watchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notificationBuilder = NotificationCompat.Builder(applicationContext, "new_episodes_channel")
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle("¡Nuevo episodio disponible! 🌟")
            .setContentText("El episodio $episodeNumber de '$animeTitle' ya se encuentra en emisión.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .addAction(android.R.drawable.ic_media_play, "VER AHORA", watchPendingIntent)

        notificationManager.notify(animeId, notificationBuilder.build())
    }

    private data class TrackedInfo(
        val animeId: Int,
        val title: String,
        val cover: String?,
        val lastKnownEpisode: Int,
        val isFollowing: Boolean,
        val followingEntity: com.example.anird.data.local.FollowingEntity? = null
    )
}
