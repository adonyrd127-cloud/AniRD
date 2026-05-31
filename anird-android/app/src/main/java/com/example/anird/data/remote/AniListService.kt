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
                    nextAiringEpisode {
                        airingAt
                        timeUntilAiring
                        episode
                    }
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

        /** Query para obtener el horario de emisión en batch por MAL IDs */
        const val BATCH_AIRING_QUERY = """
            query (${'$'}idMals: [Int]) {
                Page(page: 1, perPage: 50) {
                    media(idMal_in: ${'$'}idMals, type: ANIME) {
                        idMal
                        nextAiringEpisode {
                            airingAt
                            timeUntilAiring
                            episode
                        }
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

        fun batchAiringRequest(malIds: List<Int>) = AniListGraphQLRequest(
            query = BATCH_AIRING_QUERY,
            variables = mapOf("idMals" to malIds)
        )
    }
}
