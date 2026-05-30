package com.example.anird.data.local

import androidx.lifecycle.LiveData
import androidx.room.*

@Dao
interface FavoriteDao {
    @Query("SELECT * FROM favorites ORDER BY addedAt DESC")
    fun getAllFavorites(): LiveData<List<FavoriteEntity>>

    @Query("SELECT * FROM favorites ORDER BY addedAt DESC")
    suspend fun getAllFavoritesList(): List<FavoriteEntity>

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE animeId = :animeId)")
    fun isFavorite(animeId: Int): LiveData<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE animeId = :animeId)")
    fun isFavoriteFlow(animeId: Int): kotlinx.coroutines.flow.Flow<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE animeId = :animeId)")
    suspend fun isFavoriteSync(animeId: Int): Boolean

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(favorite: FavoriteEntity)

    @Query("DELETE FROM favorites WHERE animeId = :animeId")
    suspend fun delete(animeId: Int)

    @Query("SELECT COUNT(*) FROM favorites")
    suspend fun count(): Int

    @Query("DELETE FROM favorites")
    suspend fun deleteAll()
}

@Dao
interface HistoryDao {
    @Query("""
        SELECT h.* FROM history h 
        INNER JOIN (
            SELECT animeId, MAX(updatedAt) as maxUpdated 
            FROM history 
            GROUP BY animeId
        ) latest ON h.animeId = latest.animeId AND h.updatedAt = latest.maxUpdated
        WHERE h.duration > 0 AND (CAST(h.progress AS REAL) / h.duration) < 0.9
        ORDER BY h.updatedAt DESC
        LIMIT :limit
    """)
    fun getContinueWatching(limit: Int = 20): LiveData<List<HistoryEntity>>

    @Query("""
        SELECT h.* FROM history h 
        INNER JOIN (
            SELECT animeId, MAX(updatedAt) as maxUpdated 
            FROM history 
            GROUP BY animeId
        ) latest ON h.animeId = latest.animeId AND h.updatedAt = latest.maxUpdated
        WHERE h.duration > 0 AND (CAST(h.progress AS REAL) / h.duration) < 0.9
        ORDER BY h.updatedAt DESC
        LIMIT :limit
    """)
    suspend fun getContinueWatchingList(limit: Int = 20): List<HistoryEntity>

    @Query("SELECT * FROM history WHERE animeId = :animeId ORDER BY episodeNumber ASC")
    suspend fun getHistoryForAnime(animeId: Int): List<HistoryEntity>

    @Query("SELECT * FROM history WHERE animeId = :animeId AND episodeNumber = :episodeNumber LIMIT 1")
    suspend fun getHistoryForEpisode(animeId: Int, episodeNumber: Int): HistoryEntity?

    @Query("SELECT * FROM history ORDER BY updatedAt DESC")
    suspend fun getAllHistory(): List<HistoryEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(history: HistoryEntity): Long

    @Query("""
        UPDATE history SET progress = :progress, duration = :duration, 
        updatedAt = :updatedAt WHERE animeId = :animeId AND episodeNumber = :episodeNumber
    """)
    suspend fun updateProgress(animeId: Int, episodeNumber: Int, progress: Long, duration: Long, updatedAt: Long = System.currentTimeMillis()): Int

    /** Upsert: actualizar si existe, insertar si no */
    @Transaction
    suspend fun upsert(entity: HistoryEntity) {
        val updated = updateProgress(entity.animeId, entity.episodeNumber, entity.progress, entity.duration, entity.updatedAt)
        if (updated == 0) {
            insert(entity)
        }
    }

    @Query("DELETE FROM history WHERE animeId = :animeId")
    suspend fun deleteForAnime(animeId: Int)

    @Query("DELETE FROM history")
    suspend fun deleteAll()
}

@Dao
interface FollowingDao {
    @Query("SELECT * FROM following ORDER BY addedAt DESC")
    fun getAllFollowing(): LiveData<List<FollowingEntity>>

    @Query("SELECT * FROM following ORDER BY addedAt DESC")
    suspend fun getAllFollowingList(): List<FollowingEntity>

    @Query("SELECT EXISTS(SELECT 1 FROM following WHERE animeId = :animeId)")
    fun isFollowing(animeId: Int): LiveData<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM following WHERE animeId = :animeId)")
    fun isFollowingFlow(animeId: Int): kotlinx.coroutines.flow.Flow<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM following WHERE animeId = :animeId)")
    suspend fun isFollowingSync(animeId: Int): Boolean

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(following: FollowingEntity)

    @Query("DELETE FROM following WHERE animeId = :animeId")
    suspend fun delete(animeId: Int)

    @Query("DELETE FROM following")
    suspend fun deleteAll()
}

@Dao
interface CacheDao {
    @Query("SELECT * FROM cache WHERE `key` = :key AND expiresAt > :now LIMIT 1")
    suspend fun get(key: String, now: Long = System.currentTimeMillis()): CacheEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun put(cache: CacheEntity)

    @Query("DELETE FROM cache WHERE expiresAt <= :now")
    suspend fun deleteExpired(now: Long = System.currentTimeMillis())

    @Query("DELETE FROM cache")
    suspend fun deleteAll()
}

@Dao
interface AnimeLibraryDao {
    @Query("SELECT * FROM anime_library ORDER BY updatedAt DESC")
    fun getAllLibrary(): kotlinx.coroutines.flow.Flow<List<AnimeEntity>>

    @Query("SELECT * FROM anime_library WHERE userStatus = :status ORDER BY updatedAt DESC")
    fun getLibraryByStatus(status: String): kotlinx.coroutines.flow.Flow<List<AnimeEntity>>

    @Query("SELECT * FROM anime_library WHERE malId = :malId LIMIT 1")
    suspend fun getAnimeById(malId: Int): AnimeEntity?

    @Query("SELECT * FROM anime_library WHERE malId = :malId LIMIT 1")
    fun getAnimeByIdFlow(malId: Int): kotlinx.coroutines.flow.Flow<AnimeEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnime(anime: AnimeEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(animes: List<AnimeEntity>)

    @Query("UPDATE anime_library SET userStatus = :userStatus, updatedAt = :updatedAt WHERE malId = :malId")
    suspend fun updateUserStatus(malId: Int, userStatus: String?, updatedAt: Long = System.currentTimeMillis())

    @Query("UPDATE anime_library SET lastEpisodeWatched = :episode, watchProgressMs = :progressMs, updatedAt = :updatedAt WHERE malId = :malId")
    suspend fun updateWatchProgress(malId: Int, episode: Int, progressMs: Long, updatedAt: Long = System.currentTimeMillis())

    @Query("DELETE FROM anime_library WHERE malId = :malId")
    suspend fun deleteAnime(malId: Int)

    @Query("SELECT * FROM anime_library WHERE updatedAt > :since")
    suspend fun getUpdatedSince(since: Long): List<AnimeEntity>

    @Query("DELETE FROM anime_library")
    suspend fun clearAll()
}

@Dao
interface EpisodeDao {
    @Query("SELECT * FROM episodes WHERE animeMalId = :animeId ORDER BY episodeNumber ASC")
    fun getEpisodesForAnimeFlow(animeId: Int): kotlinx.coroutines.flow.Flow<List<EpisodeEntity>>

    @Query("SELECT * FROM episodes WHERE animeMalId = :animeId ORDER BY episodeNumber ASC")
    suspend fun getEpisodesForAnime(animeId: Int): List<EpisodeEntity>

    @Query("SELECT * FROM episodes WHERE id = :id LIMIT 1")
    suspend fun getEpisodeById(id: String): EpisodeEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEpisode(episode: EpisodeEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(episodes: List<EpisodeEntity>)

    @Query("UPDATE episodes SET watchedProgressMs = :progressMs WHERE id = :id")
    suspend fun updateEpisodeProgress(id: String, progressMs: Long)

    @Query("UPDATE episodes SET isDownloaded = :isDownloaded, localPath = :localPath WHERE id = :id")
    suspend fun updateDownloadStatus(id: String, isDownloaded: Boolean, localPath: String?)

    @Query("DELETE FROM episodes WHERE animeMalId = :animeId")
    suspend fun deleteForAnime(animeId: Int)

    @Query("DELETE FROM episodes")
    suspend fun clearAll()
}

@Dao
interface SearchHistoryDao {
    @Query("SELECT * FROM search_history ORDER BY searchedAt DESC LIMIT :limit")
    fun getRecentSearches(limit: Int = 10): kotlinx.coroutines.flow.Flow<List<SearchHistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSearch(search: SearchHistoryEntity)

    @Query("DELETE FROM search_history WHERE `query` = :query")
    suspend fun deleteSearch(query: String)

    @Query("DELETE FROM search_history")
    suspend fun clearAll()
}

