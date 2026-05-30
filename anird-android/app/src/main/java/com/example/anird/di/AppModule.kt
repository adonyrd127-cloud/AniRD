package com.example.anird.di

import android.content.Context
import com.example.anird.data.local.AppDatabase
import com.example.anird.data.local.FavoriteDao
import com.example.anird.data.local.HistoryDao
import com.example.anird.data.local.FollowingDao
import com.example.anird.data.local.CacheDao
import com.example.anird.data.local.AnimeLibraryDao
import com.example.anird.data.local.EpisodeDao
import com.example.anird.data.local.SearchHistoryDao
import com.example.anird.data.remote.JikanApiService
import com.example.anird.data.remote.LocalApiService
import com.example.anird.data.remote.AniListService
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import com.example.anird.utils.JwtManager
import com.example.anird.utils.ServerConfigManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return AppDatabase.getInstance(context)
    }

    @Provides
    fun provideFavoriteDao(database: AppDatabase): FavoriteDao = database.favoriteDao()

    @Provides
    fun provideHistoryDao(database: AppDatabase): HistoryDao = database.historyDao()

    @Provides
    fun provideFollowingDao(database: AppDatabase): FollowingDao = database.followingDao()

    @Provides
    fun provideCacheDao(database: AppDatabase): CacheDao = database.cacheDao()

    @Provides
    fun provideAnimeLibraryDao(database: AppDatabase): AnimeLibraryDao = database.animeLibraryDao()

    @Provides
    fun provideEpisodeDao(database: AppDatabase): EpisodeDao = database.episodeDao()

    @Provides
    fun provideSearchHistoryDao(database: AppDatabase): SearchHistoryDao = database.searchHistoryDao()

    @Provides
    @Singleton
    fun provideServerConfigManager(@ApplicationContext context: Context): ServerConfigManager {
        return ServerConfigManager(context)
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()
    }

    @Provides
    @Singleton
    fun provideJikanApiService(): JikanApiService {
        var lastJikanRequest = 0L
        val jikanClient = OkHttpClient.Builder()
            .connectTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .addInterceptor { chain ->
                synchronized(this) {
                    val now = System.currentTimeMillis()
                    val elapsed = now - lastJikanRequest
                    if (elapsed < 500) {
                        Thread.sleep(500 - elapsed)
                    }
                    lastJikanRequest = System.currentTimeMillis()
                }
                chain.proceed(chain.request())
            }
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()

        return Retrofit.Builder()
            .baseUrl("https://api.jikan.moe/v4/")
            .client(jikanClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(JikanApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideLocalApiService(
        jwtManager: JwtManager,
        serverConfigManager: ServerConfigManager
    ): LocalApiService {
        val initialUrl = com.example.anird.BuildConfig.LOCAL_API_URL
        val localClient = OkHttpClient.Builder()
            .connectTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .addInterceptor { chain ->
                var request = chain.request()
                val targetIp = serverConfigManager.ip
                val targetPort = serverConfigManager.port.toIntOrNull() ?: 3005
                try {
                    val newUrl = request.url.newBuilder()
                        .host(targetIp)
                        .port(targetPort)
                        .build()
                    request = request.newBuilder().url(newUrl).build()
                } catch (e: Exception) {
                    android.util.Log.e("AniRD-AppModule", "Error rewriting dynamic URL to $targetIp:$targetPort", e)
                }
                chain.proceed(request)
            }
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("X-API-Key", com.example.anird.BuildConfig.API_KEY)
                    .addHeader("Accept", "application/json")
                    .build()
                chain.proceed(request)
            }
            .addInterceptor { chain ->
                val requestBuilder = chain.request().newBuilder()
                val token = jwtManager.getToken()
                if (token != null) {
                    requestBuilder.addHeader("Authorization", "Bearer $token")
                }
                chain.proceed(requestBuilder.build())
            }
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()

        return Retrofit.Builder()
            .baseUrl(initialUrl)
            .client(localClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(LocalApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideAniListService(okHttpClient: OkHttpClient): AniListService {
        return Retrofit.Builder()
            .baseUrl("https://graphql.anilist.co/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AniListService::class.java)
    }

    @Provides
    @Singleton
    fun provideJwtManager(@ApplicationContext context: Context): JwtManager {
        return JwtManager(context)
    }

    @Provides
    @Singleton
    fun provideAnimeRepository(
        jikanApi: JikanApiService,
        anilistApi: AniListService,
        localApi: LocalApiService,
        database: AppDatabase
    ): AnimeRepository {
        return AnimeRepository(jikanApi, anilistApi, localApi, database)
    }

    @Provides
    @Singleton
    fun provideAuthRepository(
        localApi: LocalApiService,
        jwtManager: JwtManager,
        database: AppDatabase
    ): AuthRepository {
        return AuthRepository(localApi, jwtManager, database)
    }
}
