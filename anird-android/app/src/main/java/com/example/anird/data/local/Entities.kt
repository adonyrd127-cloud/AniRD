package com.example.anird.data.local

import androidx.room.*

/** Entidad de favoritos */
@Entity(tableName = "favorites")
data class FavoriteEntity(
    @PrimaryKey val animeId: Int,
    val title: String = "",
    val cover: String? = null,
    val addedAt: Long = System.currentTimeMillis()
)

/** Entidad de historial de reproducción */
@Entity(
    tableName = "history",
    indices = [Index(value = ["animeId", "episodeNumber"], unique = true)]
)
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val animeId: Int,
    val episodeNumber: Int,
    val progress: Long = 0,       // ms
    val duration: Long = 0,       // ms
    val timestamp: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val title: String? = null,
    val cover: String? = null
) {
    val progressPercent: Float
        get() = if (duration > 0) (progress.toFloat() / duration * 100f) else 0f
}

/** Entidad de anime que el usuario sigue */
@Entity(tableName = "following")
data class FollowingEntity(
    @PrimaryKey val animeId: Int,
    val title: String = "",
    val cover: String? = null,
    val broadcast: String? = null,
    val addedAt: Long = System.currentTimeMillis()
)

/** Entidad de caché genérica */
@Entity(tableName = "cache")
data class CacheEntity(
    @PrimaryKey val key: String,
    val data: String,             // JSON serializado
    val expiresAt: Long
) {
    val isExpired: Boolean
        get() = System.currentTimeMillis() > expiresAt
}

@Entity(tableName = "anime_library")
data class AnimeEntity(
    @PrimaryKey val malId: Int,
    val title: String,
    val titleJapanese: String?,
    val imageUrl: String,
    val bannerImage: String?,
    val synopsis: String?,
    val score: Double?,
    val status: String, // "airing", "finished", "upcoming"
    val userStatus: String?, // "following", "favorite", "completed", "dropped", null
    val episodes: Int?,
    val airedFrom: String?,
    val genres: String?, // JSON array serialized
    val lastEpisodeWatched: Int?,
    val watchProgressMs: Long?,
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "episodes")
data class EpisodeEntity(
    @PrimaryKey val id: String, // "${malId}_${episodeNumber}"
    val animeMalId: Int,
    val episodeNumber: Int,
    val title: String?,
    val thumbnailUrl: String?,
    val videoUrl: String?,
    val durationSeconds: Int?,
    val watchedProgressMs: Long?,
    val isDownloaded: Boolean = false,
    val localPath: String?
)

@Entity(tableName = "search_history")
data class SearchHistoryEntity(
    @PrimaryKey val query: String,
    val searchedAt: Long = System.currentTimeMillis()
)
