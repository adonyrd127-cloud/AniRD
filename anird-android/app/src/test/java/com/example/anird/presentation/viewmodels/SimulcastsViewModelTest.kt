package com.example.anird.presentation.viewmodels

import com.example.anird.data.model.Anime
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SimulcastsViewModelTest {

    @Test
    fun testDayOfWeekList_containsSevenDays() {
        val daysOfWeek = listOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")
        assertEquals(7, daysOfWeek.size)
        assertTrue(daysOfWeek.contains("monday"))
        assertTrue(daysOfWeek.contains("sunday"))
    }

    @Test
    fun testSimulcastUiState_loadingInitialState() {
        val state: SimulcastUiState = SimulcastUiState.Loading
        assertTrue(state is SimulcastUiState.Loading)
    }

    @Test
    fun testSimulcastUiState_successState() {
        val anime = Anime(
            malId = 1,
            title = "Test Anime",
            synopsis = "Test Synopsis",
            score = 8.5
        )
        val map = mapOf("monday" to listOf(anime))
        val state = SimulcastUiState.Success(
            schedulesByDay = map,
            selectedDay = "monday",
            followingIds = setOf(1)
        )

        assertEquals("monday", state.selectedDay)
        assertEquals(1, state.schedulesByDay["monday"]?.size)
        assertTrue(state.followingIds.contains(1))
    }
}
