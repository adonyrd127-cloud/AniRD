package com.example.anird.domain.repository

import androidx.lifecycle.LiveData
import com.example.anird.data.local.FavoriteEntity
import com.example.anird.data.local.FollowingEntity
import com.example.anird.data.local.HistoryEntity
import com.example.anird.data.model.*
import kotlinx.coroutines.flow.Flow

interface IAnimeRepository {
    suspend fun getTrending(page: Int = 1): List<Anime>
    suspend fun getLatest(page: Int = 1): List<Anime>
    suspend fun getCachedSchedules(): List<Anime>?
    suspend fun getSchedules(page: Int = 1): List<Anime>
    suspend fun getMovies(page: Int = 1): List<Anime>
    suspend fun getDubbed(page: Int = 1): List<Anime>
    suspend fun getByGenre(genreIds: String, page: Int = 1): List<Anime>
    suspend fun searchJikan(query: String): List<Anime>

    suspend fun getAnimeDetails(malId: Int): Anime?
    suspend fun getNextAiringBatch(malIds: List<Int>): List<AniListMedia>
    suspend fun getAnimeCharacters(malId: Int): List<AnimeCharacter>
    suspend fun getAnimeRelations(malId: Int): List<AnimeRelation>
    suspend fun getAnimeRecommendations(malId: Int): List<Anime>
    suspend fun getAnimeBasicInfo(malId: Int): Anime?

    suspend fun getAniListEpisodes(malId: Int): List<AniListEpisode>

    suspend fun searchLocal(vararg titles: String?): LocalAnimeResult?
    suspend fun getLocalAnimeInfo(url: String): LocalAnimeInfo?
    suspend fun getStreamServers(episodeUrl: String): StreamResponse

    fun getFavoritesLive(): LiveData<List<FavoriteEntity>>
    suspend fun getAllFavoritesList(): List<FavoriteEntity>
    fun isFavoriteLive(animeId: Int): LiveData<Boolean>
    fun isFavoriteFlow(animeId: Int): Flow<Boolean>
    suspend fun toggleFavorite(anime: Anime): Boolean

    fun getFollowingLive(): LiveData<List<FollowingEntity>>
    suspend fun getAllFollowingList(): List<FollowingEntity>
    fun isFollowingLive(animeId: Int): LiveData<Boolean>
    fun isFollowingFlow(animeId: Int): Flow<Boolean>
    suspend fun toggleFollowing(anime: Anime): Boolean

    fun getContinueWatchingLive(limit: Int = 20): LiveData<List<HistoryEntity>>
    suspend fun saveProgress(
        animeId: Int, episodeNumber: Int,
        progress: Long, duration: Long,
        title: String? = null, cover: String? = null
    )
    suspend fun getHistoryForAnime(animeId: Int): List<HistoryEntity>

    suspend fun clearCache()
}
