package com.example.anird.presentation.viewmodels

import com.example.anird.data.local.EpisodeEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.model.StreamServer
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PlayerViewModelTest {

    @Test
    fun testPlayerUiState_initialLoadingState() {
        val state: PlayerUiState = PlayerUiState.Loading
        assertTrue(state is PlayerUiState.Loading)
    }

    @Test
    fun testPlayerUiState_successPlaybackSpeedAndNavigation() {
        val episode = EpisodeEntity(
            id = "1_2",
            animeMalId = 1,
            episodeNumber = 2,
            title = "Episode 2",
            thumbnailUrl = null,
            videoUrl = "https://example.com/video"
        )
        val anime = Anime(malId = 1, title = "Test Anime", episodes = 12)
        val server = StreamServer(server = "Zilla", url = "https://zilla-networks.com/e/123")

        val state = PlayerUiState.Success(
            episode = episode,
            anime = anime,
            servers = listOf(server),
            currentServer = server,
            subOrDub = "sub",
            playbackSpeed = 1.5f,
            totalEpisodes = 12,
            hasPreviousEpisode = episode.episodeNumber > 1,
            hasNextEpisode = episode.episodeNumber < 12
        )

        assertEquals(1.5f, state.playbackSpeed)
        assertTrue(state.hasPreviousEpisode)
        assertTrue(state.hasNextEpisode)
        assertEquals("Zilla", state.currentServer.server)
    }

    @Test
    fun testPlayerUiState_firstEpisodeNoPrevious() {
        val episode = EpisodeEntity(
            id = "1_1",
            animeMalId = 1,
            episodeNumber = 1,
            title = "Episode 1",
            thumbnailUrl = null,
            videoUrl = "https://example.com/video"
        )
        val state = PlayerUiState.Success(
            episode = episode,
            anime = null,
            servers = emptyList(),
            currentServer = StreamServer("Default", ""),
            subOrDub = "sub",
            playbackSpeed = 1.0f,
            totalEpisodes = 10,
            hasPreviousEpisode = episode.episodeNumber > 1,
            hasNextEpisode = episode.episodeNumber < 10
        )

        assertFalse(state.hasPreviousEpisode)
        assertTrue(state.hasNextEpisode)
    }
}

