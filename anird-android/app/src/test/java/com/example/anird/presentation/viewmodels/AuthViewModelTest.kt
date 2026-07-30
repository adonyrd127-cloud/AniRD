package com.example.anird.presentation.viewmodels

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class AuthViewModelTest {

    @Test
    fun testAuthUiState_idleInitialState() {
        val state: AuthUiState = AuthUiState.Idle
        assertTrue(state is AuthUiState.Idle)
    }

    @Test
    fun testAuthUiState_errorStateMessage() {
        val errorMessage = "El usuario y la contraseña no pueden estar vacíos"
        val state = AuthUiState.Error(errorMessage)
        assertEquals(errorMessage, state.message)
    }

    @Test
    fun testAuthUiState_successState() {
        val state: AuthUiState = AuthUiState.Success
        assertTrue(state is AuthUiState.Success)
    }
}
