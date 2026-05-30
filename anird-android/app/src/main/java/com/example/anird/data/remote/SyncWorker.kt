package com.example.anird.data.remote

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.anird.data.repository.AuthRepository
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent

/**
 * Worker periódico en segundo plano para sincronización bidireccional automática.
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
    }

    override suspend fun doWork(): Result {
        Log.d(TAG, "Iniciando tarea periódica de sincronización en la nube...")
        return try {
            val entryPoint = EntryPointAccessors.fromApplication(
                applicationContext,
                SyncEntryPoint::class.java
            )
            val authRepository = entryPoint.authRepository()

            if (authRepository.isLoggedIn) {
                // Sincronizar hacia el servidor (subida)
                authRepository.syncToServer()
                // Sincronizar desde el servidor (bajada)
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
}
