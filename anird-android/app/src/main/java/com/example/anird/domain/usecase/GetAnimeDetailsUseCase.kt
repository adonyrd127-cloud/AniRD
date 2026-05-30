package com.example.anird.domain.usecase

import android.util.Log
import com.example.anird.data.model.Anime
import com.example.anird.data.model.AnimeCharacter
import com.example.anird.data.model.AnimeRelation
import com.example.anird.data.repository.AnimeRepository
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import javax.inject.Inject

/**
 * Caso de uso para obtener detalles completos de un anime, resolviendo
 * la info de precuelas/secuelas (con imágenes) y personajes en paralelo.
 */
class GetAnimeDetailsUseCase @Inject constructor(
    private val repository: AnimeRepository
) {
    companion object {
        private const val TAG = "GetAnimeDetailsUC"
    }

    suspend operator fun invoke(malId: Int): DetailedAnimeResult = coroutineScope {
        // 1. Iniciar peticiones en paralelo de detalles principales, personajes y relaciones de Jikan
        val detailsDeferred = async { repository.getAnimeDetails(malId) }
        val charactersDeferred = async { repository.getAnimeCharacters(malId) }
        val relationsDeferred = async { 
            try {
                // Obtenemos las relaciones directamente de Jikan
                repository.getAnimeRelations(malId)
            } catch (e: Exception) {
                emptyList<AnimeRelation>()
            }
        }
        val recommendationsDeferred = async { repository.getAnimeRecommendations(malId) }

        val mainDetails = detailsDeferred.await()
        val characters = try { charactersDeferred.await() } catch (e: Exception) { emptyList() }
        val rawRelations = try { relationsDeferred.await() } catch (e: Exception) { emptyList() }
        val recommendations = try { recommendationsDeferred.await() } catch (e: Exception) { emptyList() }

        // 2. Resolver imágenes para precuelas y secuelas en paralelo
        // Filtrar y agrupar solo relaciones relevantes (por ejemplo, Prequel, Sequel, Spin-off, etc.)
        val resolvedRelations = rawRelations.map { relationGroup ->
            val relationType = relationGroup.relation ?: "Relacionado"
            
            // Resolvemos los datos de cada entrada de anime en el grupo
            val entriesDeferred = relationGroup.entry?.map { entry ->
                async {
                    if (entry.type == "anime") {
                        try {
                            val basicInfo = repository.getAnimeBasicInfo(entry.malId)
                            ResolvedRelationEntry(
                                malId = entry.malId,
                                name = entry.name ?: "",
                                type = entry.type ?: "anime",
                                imageUrl = basicInfo?.imageUrl
                            )
                        } catch (e: Exception) {
                            Log.e(TAG, "Error resolviendo imagen de relación ${entry.malId}", e)
                            ResolvedRelationEntry(malId = entry.malId, name = entry.name ?: "", type = entry.type ?: "anime", imageUrl = null)
                        }
                    } else {
                        ResolvedRelationEntry(
                            malId = entry.malId,
                            name = entry.name ?: "",
                            type = entry.type ?: entry.type ?: "manga",
                            imageUrl = null
                        )
                    }
                }
            } ?: emptyList()

            val resolvedEntries = entriesDeferred.awaitAll()
            ResolvedRelationGroup(
                relation = relationType,
                entries = resolvedEntries
            )
        }

        DetailedAnimeResult(
            anime = mainDetails,
            characters = characters,
            relations = resolvedRelations,
            recommendations = recommendations
        )
    }
}

data class DetailedAnimeResult(
    val anime: Anime?,
    val characters: List<AnimeCharacter>,
    val relations: List<ResolvedRelationGroup>,
    val recommendations: List<Anime>
)

data class ResolvedRelationGroup(
    val relation: String,
    val entries: List<ResolvedRelationEntry>
)

data class ResolvedRelationEntry(
    val malId: Int,
    val name: String,
    val type: String,
    val imageUrl: String?
)
