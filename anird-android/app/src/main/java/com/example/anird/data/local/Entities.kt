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
