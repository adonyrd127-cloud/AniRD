package com.example.anird.data.remote

import com.example.anird.data.model.*
import retrofit2.http.Body
import retrofit2.http.POST

/**
 * Interface Retrofit para AniList GraphQL API.
 * Base URL: https://graphql.anilist.co/
 */
interface AniListService {

    @POST(".")
    suspend fun query(
        @Body request: AniListGraphQLRequest
    ): AniListResponse

    companion object {
        /** Query para obtener banner de un anime por MAL ID */
        const val BANNER_QUERY = """
            query (${'$'}idMal: Int) {
                Media(idMal: ${'$'}idMal, type: ANIME) {
                    bannerImage
                }
            }
        """

        /** Query para obtener episodios con thumbnails */
        const val EPISODES_QUERY = """
            query (${'$'}idMal: Int) {
                Media(idMal: ${'$'}idMal, type: ANIME) {
                    bannerImage
                    streamingEpisodes {
                        title
                        thumbnail
                    }
                }
            }
        """

        fun bannerRequest(malId: Int) = AniListGraphQLRequest(
            query = BANNER_QUERY,
            variables = mapOf("idMal" to malId)
        )

        fun episodesRequest(malId: Int) = AniListGraphQLRequest(
            query = EPISODES_QUERY,
            variables = mapOf("idMal" to malId)
        )
    }
}
