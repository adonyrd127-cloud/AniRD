package com.example.anird.tv

import android.content.Context
import com.example.anird.data.local.AppDatabase
import com.example.anird.data.remote.RetrofitClient
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import com.example.anird.utils.JwtManager

/**
 * Proveedor de repositorios singleton para la UI de Android TV.
 * Evita inicializaciones repetidas y comparte bases de datos y sesiones.
 */
object TvRepositoryProvider {
    private var animeRepository: AnimeRepository? = null
    private var authRepository: AuthRepository? = null

    fun getAnimeRepository(context: Context): AnimeRepository {
        return animeRepository ?: synchronized(this) {
            val jwtManager = JwtManager(context.applicationContext)
            val localApi = RetrofitClient.getLocalApi(jwtManager)
            animeRepository ?: AnimeRepository(
                jikanApi = RetrofitClient.jikanApi,
                anilistApi = RetrofitClient.anilistApi,
                localApi = localApi,
                db = AppDatabase.getInstance(context.applicationContext)
            ).also { animeRepository = it }
        }
    }

    fun getAuthRepository(context: Context): AuthRepository {
        return authRepository ?: synchronized(this) {
            val jwtManager = JwtManager(context.applicationContext)
            val localApi = RetrofitClient.getLocalApi(jwtManager)
            authRepository ?: AuthRepository(
                localApi = localApi,
                jwtManager = jwtManager,
                db = AppDatabase.getInstance(context.applicationContext)
            ).also { authRepository = it }
        }
    }
}
