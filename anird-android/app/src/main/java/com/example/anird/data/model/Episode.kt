package com.example.anird.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelos para episodios, servidores de streaming y respuestas del API local.
 */

// --- Episodio ---

data class Episode(
    val number: Int = 0,
    val title: String? = null,
    val url: String? = null,      // URL del scraper para obtener servidores
    var thumbnailUrl: String? = null,
    var watched: Boolean = false,
    var progressMs: Long = 0,
    var durationMs: Long = 0
) {
    val displayTitle: String
        get() = title?.takeIf { it.isNotBlank() } ?: "Episodio $number"

    val progressPercent: Float
        get() = if (durationMs > 0) (progressMs.toFloat() / durationMs * 100f) else 0f

    val isComplete: Boolean
        get() = progressPercent >= 90f
}

// --- Servidores de Streaming ---

data class StreamServer(
    val server: String = "",
    val url: String = ""
) {
    val displayName: String
        get() = server.ifBlank { "Servidor" }
}

data class StreamResponse(
    val sub: List<StreamServer> = emptyList(),
    val dub: List<StreamServer> = emptyList()
)

// --- Respuestas del API Local (anime1v-api) ---

data class LocalApiResponse<T>(
    val success: Boolean = false,
    val source: String? = null,
    val data: T? = null,
    val message: String? = null
)

data class LocalSearchData(
    val count: Int = 0,
    val results: List<LocalAnimeResult> = emptyList()
)

data class LocalAnimeResult(
    val id: String? = null,
    val title: String = "",
    val slug: String? = null,
    val url: String = "",
    val image: String? = null,
    val backdrop: String? = null,
    val type: String? = null,
    val score: Double? = null,
    val status: String? = null,
    val year: String? = null
)

data class LocalAnimeInfo(
    val id: Int? = null,
    val title: String = "",
    @SerializedName("titleJapanese") val titleJapanese: String? = null,
    val description: String? = null,
    val image: String? = null,
    val backdrop: String? = null,
    val status: String? = null,
    val type: String? = null,
    val year: String? = null,
    val score: Double? = null,
    val totalEpisodes: Int? = null,
    val malId: Int? = null,
    val genres: List<LocalGenre>? = null,
    val episodes: List<LocalEpisode> = emptyList()
)

data class LocalGenre(
    val id: Int? = null,
    val name: String = "",
    val slug: String? = null,
    val malId: Int? = null
)

data class LocalEpisode(
    val id: Int? = null,
    val number: Int = 0,
    val title: String? = null,
    val url: String = ""
)

data class LocalEpisodeLinks(
    val servers: StreamResponse = StreamResponse()
)

// --- Auth ---

data class AuthRequest(
    val username: String,
    val password: String
)

data class AuthResponse(
    val success: Boolean = false,
    val token: String? = null,
    val user: UserInfo? = null,
    val syncData: SyncData? = null,
    val message: String? = null
)

data class UserInfo(
    val username: String = ""
)

data class SyncData(
    val favorites: List<SyncAnimeItem> = emptyList(),
    val following: List<SyncAnimeItem> = emptyList(),
    val history: List<SyncHistoryItem> = emptyList()
)

data class SyncAnimeItem(
    val animeId: Int = 0,
    val title: String = "",
    val cover: String? = null,
    val addedAt: Long = 0
)

data class SyncHistoryItem(
    val animeId: Int = 0,
    val episodeId: String? = null,
    val episodeNumber: Int = 0,
    val progress: Long = 0,
    val duration: Long = 0,
    val timestamp: Long = 0,
    val updatedAt: Long = 0,
    val title: String? = null,
    val cover: String? = null
)

data class SyncResponse(
    val success: Boolean = false,
    val syncData: SyncData? = null,
    val message: String? = null
)

data class SyncUploadRequest(
    val favorites: List<SyncAnimeItem> = emptyList(),
    val following: List<SyncAnimeItem> = emptyList(),
    val history: List<SyncHistoryItem> = emptyList()
)

// --- AniList ---

data class AniListGraphQLRequest(
    val query: String,
    val variables: Map<String, Any?>
)

data class AniListResponse(
    val data: AniListData? = null
)

data class AniListData(
    @SerializedName("Media") val media: AniListMedia? = null
)

data class AniListMedia(
    val bannerImage: String? = null,
    val streamingEpisodes: List<AniListEpisode>? = null
)

data class AniListEpisode(
    val title: String? = null,
    val thumbnail: String? = null
)
