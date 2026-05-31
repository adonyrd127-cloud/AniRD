package com.example.anird.domain.usecase

import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import kotlinx.coroutines.async
import kotlinx.coroutines.supervisorScope
import javax.inject.Inject

/**
 * Caso de uso para obtener y consolidar las secciones principales de la pantalla Home.
 */
class GetHomeFeedUseCase @Inject constructor(
    private val repository: AnimeRepository
) {
    suspend operator fun invoke(): HomeFeedResult = supervisorScope {
        val trendingDeferred = async { repository.getTrending(page = 1) }
        val latestDeferred = async { repository.getLatest(page = 1) }
        val schedulesDeferred = async { repository.getSchedules(page = 1) }
        val moviesDeferred = async { repository.getMovies(page = 1) }

        val trending = try { trendingDeferred.await() } catch (e: Exception) { emptyList() }
        val latest = try { latestDeferred.await() } catch (e: Exception) { emptyList() }
        val schedules = try { schedulesDeferred.await() } catch (e: Exception) { emptyList() }
        val movies = try { moviesDeferred.await() } catch (e: Exception) { emptyList() }

        if (trending.isEmpty() && latest.isEmpty()) {
            throw java.io.IOException("No se pudo cargar el contenido principal de inicio")
        }

        // El carrusel de héroes usa los primeros 5 animes en tendencias
        val heroCarousel = trending.take(5)
        // El resto se distribuye en las secciones correspondientes
        val top10 = trending.take(10)

        HomeFeedResult(
            heroCarousel = heroCarousel,
            simulcasts = schedules,
            topTen = top10,
            latestEpisodes = latest,
            movies = movies
        )
    }
}

data class HomeFeedResult(
    val heroCarousel: List<Anime>,
    val simulcasts: List<Anime>,
    val topTen: List<Anime>,
    val latestEpisodes: List<Anime>,
    val movies: List<Anime>
)
