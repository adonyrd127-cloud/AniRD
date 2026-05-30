package com.example.anird.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.anird.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

import com.example.anird.utils.ServerConfigManager
import com.example.anird.data.remote.RetrofitClient

sealed interface AuthUiState {
    object Idle : AuthUiState
    object Loading : AuthUiState
    object Success : AuthUiState
    data class Error(val message: String) : AuthUiState
}

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val serverConfigManager: ServerConfigManager
) : ViewModel() {

    private val _serverIp = MutableStateFlow(serverConfigManager.ip)
    val serverIp: StateFlow<String> = _serverIp.asStateFlow()

    private val _serverPort = MutableStateFlow(serverConfigManager.port)
    val serverPort: StateFlow<String> = _serverPort.asStateFlow()

    fun updateServerConfig(ip: String, port: String) {
        serverConfigManager.ip = ip
        serverConfigManager.port = port
        _serverIp.value = serverConfigManager.ip
        _serverPort.value = serverConfigManager.port
        RetrofitClient.resetLocalApi()
    }

    private val _isLoggedIn = MutableStateFlow(authRepository.isLoggedIn)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    private val _username = MutableStateFlow(authRepository.username)
    val username: StateFlow<String?> = _username.asStateFlow()

    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    private val _syncing = MutableStateFlow(false)
    val syncing: StateFlow<Boolean> = _syncing.asStateFlow()

    fun login(user: String, pass: String) {
        if (user.isBlank() || pass.isBlank()) {
            _uiState.value = AuthUiState.Error("El usuario y la contraseña no pueden estar vacíos")
            return
        }
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            val result = authRepository.login(user.trim(), pass)
            if (result.isSuccess) {
                _isLoggedIn.value = true
                _username.value = authRepository.username
                _uiState.value = AuthUiState.Success
            } else {
                _uiState.value = AuthUiState.Error(result.exceptionOrNull()?.message ?: "Error al iniciar sesión")
            }
        }
    }

    fun register(user: String, pass: String) {
        if (user.isBlank() || pass.isBlank()) {
            _uiState.value = AuthUiState.Error("El usuario y la contraseña no pueden estar vacíos")
            return
        }
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            val result = authRepository.register(user.trim(), pass)
            if (result.isSuccess) {
                _isLoggedIn.value = true
                _username.value = authRepository.username
                _uiState.value = AuthUiState.Success
            } else {
                _uiState.value = AuthUiState.Error(result.exceptionOrNull()?.message ?: "Error al registrarse")
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _isLoggedIn.value = false
            _username.value = null
            _uiState.value = AuthUiState.Idle
        }
    }

    fun syncLibrary() {
        if (!authRepository.isLoggedIn) return
        viewModelScope.launch {
            _syncing.value = true
            try {
                // Sincronización bidireccional completa
                authRepository.syncToServer()
                authRepository.syncFromServerFull()
            } catch (e: Exception) {
                // Silencioso
            } finally {
                _syncing.value = false
            }
        }
    }
}
