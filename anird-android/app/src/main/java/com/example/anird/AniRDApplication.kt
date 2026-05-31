package com.example.anird

import android.app.Application
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.example.anird.data.remote.SyncWorker
import dagger.hilt.android.HiltAndroidApp
import java.util.concurrent.TimeUnit
import coil.ImageLoader
import coil.ImageLoaderFactory
import okhttp3.OkHttpClient

@HiltAndroidApp
class AniRDApplication : Application(), ImageLoaderFactory {

    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .okHttpClient {
                OkHttpClient.Builder()
                    .addInterceptor { chain ->
                        val request = chain.request().newBuilder()
                            .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                            .header("Referer", "https://myanimelist.net/")
                            .build()
                        chain.proceed(request)
                    }
                    .build()
            }
            .respectCacheHeaders(false)
            .build()
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
        setupBackgroundSync()
    }

    private fun createNotificationChannels() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val name = "Nuevos Episodios"
            val descriptionText = "Notificaciones de nuevos episodios de los animes que sigues"
            val importance = android.app.NotificationManager.IMPORTANCE_HIGH
            val channel = android.app.NotificationChannel("new_episodes_channel", name, importance).apply {
                description = descriptionText
            }
            val notificationManager: android.app.NotificationManager =
                getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun setupBackgroundSync() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        // 1. Tarea inmediata en el arranque para sincronización instantánea y chequeo de episodios
        val oneTimeRequest = OneTimeWorkRequestBuilder<SyncWorker>()
            .setConstraints(constraints)
            .build()
        WorkManager.getInstance(this).enqueueUniqueWork(
            "AniRDCloudSyncOnce",
            ExistingWorkPolicy.REPLACE,
            oneTimeRequest
        )

        // 2. Tarea periódica regular
        val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()
        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "AniRDCloudSync",
            ExistingPeriodicWorkPolicy.KEEP,
            syncRequest
        )
    }
}

