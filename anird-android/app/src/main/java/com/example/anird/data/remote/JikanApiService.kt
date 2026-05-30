package com.example.anird.data.remote

import com.example.anird.data.model.*
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Interface Retrofit para Jikan API v4 (proxy de MyAnimeList).
 * Base URL: https://api.jikan.moe/v4/
 */
interface JikanApiService {

    /** Buscar anime por texto */
    @GET("anime")
    suspend fun searchAnime(
        @Query("q") query: String,
        @Query("limit") limit: Int = 20,
        @Query("page") page: Int = 1
    ): JikanResponse<List<Anime>>

    /** Top anime actualmente en emisión (trending) */
    @GET("top/anime")
    suspend fun getTrending(
        @Query("filter") filter: String = "airing",
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 25
    ): JikanResponse<List<Anime>>

    /** Películas populares */
    @GET("top/anime")
    suspend fun getMovies(
        @Query("type") type: String = "movie",
        @Query("filter") filter: String = "bypopularity",
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 25
    ): JikanResponse<List<Anime>>

    /** Anime de la temporada actual */
    @GET("seasons/now")
    suspend fun getSeasonNow(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 25
    ): JikanResponse<List<Anime>>

    /** Calendario (Animes en emisión por día) */
    @GET("schedules")
    suspend fun getSchedules(
        @Query("page") page: Int = 1
    ): JikanResponse<List<Anime>>

    /** Anime doblado (productoras Crunchyroll/Funimation) */
    @GET("anime")
    suspend fun getDubbed(
        @Query("producers") producers: String = "1191,108",
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 25
    ): JikanResponse<List<Anime>>

    /** Anime por género */
    @GET("anime")
    suspend fun getByGenre(
        @Query("genres") genreIds: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 25,
        @Query("order_by") orderBy: String = "score",
        @Query("sort") sort: String = "desc"
    ): JikanResponse<List<Anime>>

    /** Detalles completos de un anime */
    @GET("anime/{id}/full")
    suspend fun getAnimeDetails(@Path("id") id: Int): JikanResponse<Anime>

    /** Info básica de un anime */
    @GET("anime/{id}")
    suspend fun getAnimeBasic(
        @Path("id") malId: Int
    ): JikanResponse<Anime>

    /** Personajes de un anime */
    @GET("anime/{id}/characters")
    suspend fun getAnimeCharacters(
        @Path("id") malId: Int
    ): JikanResponse<List<AnimeCharacter>>

    /** Relaciones de un anime */
    @GET("anime/{id}/relations")
    suspend fun getAnimeRelations(
        @Path("id") malId: Int
    ): JikanResponse<List<AnimeRelation>>

    /** Recomendaciones de un anime */
    @GET("anime/{id}/recommendations")
    suspend fun getAnimeRecommendations(
        @Path("id") malId: Int
    ): JikanResponse<List<AnimeRecommendation>>

    /** Episodios paginados (para animes en emisión) */
    @GET("anime/{id}/episodes")
    suspend fun getAnimeEpisodes(
        @Path("id") malId: Int,
        @Query("page") page: Int = 1
    ): JikanResponse<List<JikanEpisodeInfo>>
}

data class JikanEpisodeInfo(
    @com.google.gson.annotations.SerializedName("mal_id") val malId: Int = 0,
    val title: String? = null,
    @com.google.gson.annotations.SerializedName("title_romanji") val titleRomanji: String? = null,
    val aired: String? = null,
    val filler: Boolean = false,
    val recap: Boolean = false
)
