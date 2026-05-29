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
