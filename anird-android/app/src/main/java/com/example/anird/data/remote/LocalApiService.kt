package com.example.anird.data.remote

import com.example.anird.data.model.*
import retrofit2.http.*

/**
 * Interface Retrofit para anime1v-api local (scraper + auth + sync).
 * Base URL: http://{host}:3005/api/v1/
 */
interface LocalApiService {

    // --- Anime (scraping) ---

    /** Buscar anime en proveedores locales */
    @GET("anime/search")
    suspend fun searchAnime(
        @Query("q") query: String,
        @Query("page") page: Int = 1
    ): LocalApiResponse<LocalSearchData>

    /** Info detallada de un anime (episodios incluidos) */
    @GET("anime/info")
    suspend fun getAnimeInfo(
        @Query("url") url: String
    ): LocalApiResponse<LocalAnimeInfo>

    /** Links de streaming de un episodio */
    @GET("anime/episode")
    suspend fun getEpisodeLinks(
        @Query("url") url: String,
        @Query("excludeServers") excludeServers: String? = null
    ): LocalApiResponse<LocalEpisodeLinks>

    // --- Auth ---

    /** Login */
    @POST("auth/login")
    suspend fun login(
        @Body request: AuthRequest
    ): AuthResponse

    /** Registro */
    @POST("auth/register")
    suspend fun register(
        @Body request: AuthRequest
    ): AuthResponse

    // --- Sync ---

    /** Obtener datos sincronizados del servidor */
    @GET("user/sync")
    suspend fun getSyncData(): SyncResponse

    /** Subir datos al servidor */
    @POST("user/sync")
    suspend fun uploadSyncData(
        @Body data: SyncUploadRequest
    ): SyncResponse
}
