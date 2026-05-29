package com.example.anird.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo principal de anime. Combina datos de Jikan (MAL) y fuentes locales.
 */
data class Anime(
    @SerializedName("mal_id") val malId: Int = 0,
    val title: String = "",
    @SerializedName("title_english") val titleEnglish: String? = null,
    @SerializedName("title_japanese") val titleJapanese: String? = null,
    val synopsis: String? = null,
    val score: Double? = null,
    val episodes: Int? = null,
    val status: String? = null,
    val year: Int? = null,
    val type: String? = null,
    val rating: String? = null,
    val images: JikanImages? = null,
    val genres: List<Genre>? = null,
    val studios: List<Studio>? = null,
    val trailer: Trailer? = null,
    // Campos locales (del scraper)
    var localUrl: String? = null,
    var bannerUrl: String? = null,
    var coverUrl: String? = null
) {
    /** URL de la imagen del poster (Jikan) */
    val imageUrl: String?
        get() = images?.jpg?.largeImageUrl
            ?: images?.jpg?.imageUrl
            ?: images?.webp?.largeImageUrl
            ?: coverUrl

    /** Título para mostrar (prefiere inglés, fallback al original) */
    val displayTitle: String
        get() = titleEnglish?.takeIf { it.isNotBlank() } ?: title

    /** Año formateado */
    val yearText: String
        get() = year?.toString() ?: "?"

    /** Géneros como lista de strings */
    val genreNames: List<String>
        get() = genres?.map { it.name } ?: emptyList()
}

data class JikanImages(
    val jpg: ImageFormat? = null,
    val webp: ImageFormat? = null
)

data class ImageFormat(
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("small_image_url") val smallImageUrl: String? = null,
    @SerializedName("large_image_url") val largeImageUrl: String? = null
)

data class Genre(
    @SerializedName("mal_id") val malId: Int = 0,
    val name: String = "",
    val type: String? = null
)

data class Studio(
    @SerializedName("mal_id") val malId: Int = 0,
    val name: String = ""
)

data class Trailer(
    @SerializedName("youtube_id") val youtubeId: String? = null,
    val url: String? = null
)

// --- Respuestas de Jikan ---

data class JikanResponse<T>(
    val data: T? = null,
    val pagination: JikanPagination? = null
)

data class JikanPagination(
    @SerializedName("last_visible_page") val lastVisiblePage: Int = 1,
    @SerializedName("has_next_page") val hasNextPage: Boolean = false
)

// --- Modelos para personajes y relaciones ---

data class AnimeCharacter(
    val character: CharacterInfo? = null,
    val role: String? = null
)

data class CharacterInfo(
    @SerializedName("mal_id") val malId: Int = 0,
    val name: String = "",
    val images: JikanImages? = null
)

data class AnimeRelation(
    val relation: String? = null,
    val entry: List<RelationEntry>? = null
)

data class RelationEntry(
    @SerializedName("mal_id") val malId: Int = 0,
    val type: String? = null,
    val name: String? = null
)

data class AnimeRecommendation(
    val entry: Anime? = null
)
