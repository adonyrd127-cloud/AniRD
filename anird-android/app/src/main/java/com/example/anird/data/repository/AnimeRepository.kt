package com.example.anird.data.repository

import android.util.Log
import com.example.anird.data.local.*
import com.example.anird.data.model.*
import com.example.anird.data.remote.*
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext

/**
 * Repositorio central que orquesta Jikan, AniList, API local y Room.
 */
class AnimeRepository(
    private val jikanApi: JikanApiService,
    private val anilistApi: AniListService,
    private val localApi: LocalApiService,
    private val db: AppDatabase
) {
    companion object {
        private const val TAG = "AniRD-Repo"
        private const val CACHE_TTL = 10 * 60 * 1000L // 10 minutos
    }

    private val gson = Gson()
    private val cacheDao get() = db.cacheDao()
    private val favoriteDao get() = db.favoriteDao()
    private val historyDao get() = db.historyDao()
    private val followingDao get() = db.followingDao()

    // --- Anime Data (Jikan + cache) ---

    suspend fun getTrending(page: Int = 1): List<Anime> = withContext(Dispatchers.IO) {
        val cacheKey = "trending_$page"
        getCachedOrFetch(cacheKey) {
            val response = jikanApi.getTrending(page = page)
            response.data ?: emptyList()
        }
    }

    suspend fun getLatest(page: Int = 1): List<Anime> = withContext(Dispatchers.IO) {
        val cacheKey = "latest_$page"
        getCachedOrFetch(cacheKey) {
            val response = jikanApi.getSeasonNow(page = page)
            response.data ?: emptyList()
        }
    }

    suspend fun getMovies(page: Int = 1): List<Anime> = withContext(Dispatchers.IO) {
        val cacheKey = "movies_$page"
        getCachedOrFetch(cacheKey) {
            val response = jikanApi.getMovies(page = page)
            response.data ?: emptyList()
        }
    }

    suspend fun getDubbed(page: Int = 1): List<Anime> = withContext(Dispatchers.IO) {
        val cacheKey = "dubbed_$page"
        getCachedOrFetch(cacheKey) {
            val response = jikanApi.getDubbed(page = page)
            response.data ?: emptyList()
        }
    }

    suspend fun getByGenre(genreIds: String, page: Int = 1): List<Anime> = withContext(Dispatchers.IO) {
        val cacheKey = "genre_${genreIds}_$page"
        getCachedOrFetch(cacheKey) {
            val response = jikanApi.getByGenre(genreIds, page = page)
            response.data ?: emptyList()
        }
    }

    suspend fun searchJikan(query: String): List<Anime> = withContext(Dispatchers.IO) {
        try {
            val response = jikanApi.searchAnime(query)
            response.data ?: emptyList()
        } catch (e: Exception) {
            Log.e(TAG, "Error buscando en Jikan: $query", e)
            emptyList()
        }
    }

    // --- Anime Details ---

    suspend fun getAnimeDetails(malId: Int): Anime? = withContext(Dispatchers.IO) {
        try {
            coroutineScope {
                val jikanDeferred = async {
                    try { jikanApi.getAnimeDetails(malId).data } catch (e: Exception) { null }
                }
                val bannerDeferred = async {
                    try {
                        val resp = anilistApi.query(AniListService.bannerRequest(malId))
                        resp.data?.media?.bannerImage
                    } catch (e: Exception) { null }
                }

                val anime = jikanDeferred.await()
                val banner = bannerDeferred.await()

                anime?.copy()?.apply {
                    bannerUrl = banner
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error obteniendo detalles de anime $malId", e)
            null
        }
    }

    suspend fun getAnimeCharacters(malId: Int): List<AnimeCharacter> = withContext(Dispatchers.IO) {
        try {
            jikanApi.getAnimeCharacters(malId).data ?: emptyList()
        } catch (e: Exception) {
            Log.e(TAG, "Error obteniendo personajes $malId", e)
            emptyList()
        }
    }

    suspend fun getAnimeRecommendations(malId: Int): List<Anime> = withContext(Dispatchers.IO) {
        try {
            val recs = jikanApi.getAnimeRecommendations(malId).data ?: emptyList()
            recs.mapNotNull { it.entry }
        } catch (e: Exception) {
            Log.e(TAG, "Error obteniendo recomendaciones $malId", e)
            emptyList()
        }
    }

    // --- AniList ---

    suspend fun getAniListEpisodes(malId: Int): List<AniListEpisode> = withContext(Dispatchers.IO) {
        try {
            val response = anilistApi.query(AniListService.episodesRequest(malId))
            response.data?.media?.streamingEpisodes ?: emptyList()
        } catch (e: Exception) {
            Log.e(TAG, "Error obteniendo episodios de AniList $malId", e)
            emptyList()
        }
    }

    // --- Local API (Scraping) ---

    /**
     * Buscar anime en el API local con cascada de títulos.
     * Intenta con el título completo, luego inglés, luego japonés.
     */
    suspend fun searchLocal(vararg titles: String?): LocalAnimeResult? = withContext(Dispatchers.IO) {
        for (title in titles) {
            if (title.isNullOrBlank()) continue
            try {
                val cleanTitle = title.replace(Regex("[^\\w\\s]"), "").trim()
                if (cleanTitle.length < 2) continue

                val response = localApi.searchAnime(cleanTitle)
                if (response.success && (response.data?.results?.isNotEmpty() == true)) {
                    Log.d(TAG, "Encontrado en local con: '$cleanTitle' → ${response.data.results.size} resultados")
                    return@withContext response.data.results.first()
                }
            } catch (e: Exception) {
                Log.w(TAG, "Error buscando local '$title': ${e.message}")
            }
        }
        null
    }

    suspend fun getLocalAnimeInfo(url: String): LocalAnimeInfo? = withContext(Dispatchers.IO) {
        try {
            val response = localApi.getAnimeInfo(url)
            if (response.success) response.data else null
        } catch (e: Exception) {
            Log.e(TAG, "Error obteniendo info local: $url", e)
            null
        }
    }

    suspend fun getStreamServers(episodeUrl: String): StreamResponse = withContext(Dispatchers.IO) {
        try {
            val response = localApi.getEpisodeLinks(episodeUrl)
            if (response.success && response.data != null) {
                response.data.servers
            } else {
                StreamResponse()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error obteniendo servidores: $episodeUrl", e)
            StreamResponse()
        }
    }

    // --- Favoritos ---

    fun getFavoritesLive() = favoriteDao.getAllFavorites()
    fun isFavoriteLive(animeId: Int) = favoriteDao.isFavorite(animeId)

    suspend fun toggleFavorite(anime: Anime): Boolean = withContext(Dispatchers.IO) {
        val isFav = favoriteDao.isFavoriteSync(anime.malId)
        if (isFav) {
            favoriteDao.delete(anime.malId)
        } else {
            favoriteDao.insert(
                FavoriteEntity(
                    animeId = anime.malId,
                    title = anime.displayTitle,
                    cover = anime.imageUrl
                )
            )
        }
        !isFav // retorna el nuevo estado
    }

    // --- Following ---

    fun getFollowingLive() = followingDao.getAllFollowing()
    fun isFollowingLive(animeId: Int) = followingDao.isFollowing(animeId)

    suspend fun toggleFollowing(anime: Anime): Boolean = withContext(Dispatchers.IO) {
        val isFollow = followingDao.isFollowingSync(anime.malId)
        if (isFollow) {
            followingDao.delete(anime.malId)
        } else {
            followingDao.insert(
                FollowingEntity(
                    animeId = anime.malId,
                    title = anime.displayTitle,
                    cover = anime.imageUrl
                )
            )
        }
        !isFollow
    }

    // --- Historial ---

    fun getContinueWatchingLive(limit: Int = 20) = historyDao.getContinueWatching(limit)

    suspend fun saveProgress(
        animeId: Int, episodeNumber: Int,
        progress: Long, duration: Long,
        title: String? = null, cover: String? = null
    ) = withContext(Dispatchers.IO) {
        historyDao.upsert(
            HistoryEntity(
                animeId = animeId,
                episodeNumber = episodeNumber,
                progress = progress,
                duration = duration,
                title = title,
                cover = cover,
                updatedAt = System.currentTimeMillis()
            )
        )
    }

    suspend fun getHistoryForAnime(animeId: Int) = withContext(Dispatchers.IO) {
        historyDao.getHistoryForAnime(animeId)
    }

    // --- Cache genérica ---

    private suspend inline fun <reified T> getCachedOrFetch(
        key: String,
        crossinline fetch: suspend () -> T
    ): T {
        try {
            val cached = cacheDao.get(key)
            if (cached != null) {
                val type = object : TypeToken<T>() {}.type
                val data = gson.fromJson<T>(cached.data, type)
                if (data != null) return data
            }
        } catch (e: Exception) {
            Log.w(TAG, "Error leyendo caché '$key'", e)
        }

        val result = fetch()

        try {
            val json = gson.toJson(result)
            cacheDao.put(CacheEntity(key, json, System.currentTimeMillis() + CACHE_TTL))
        } catch (e: Exception) {
            Log.w(TAG, "Error guardando caché '$key'", e)
        }

        return result
    }

    suspend fun clearCache() = withContext(Dispatchers.IO) {
        cacheDao.deleteAll()
    }
}
