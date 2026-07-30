package com.example.anird.domain.repository

import com.example.anird.data.model.AuthResponse

interface IAuthRepository {
    val isLoggedIn: Boolean
    val username: String?

    suspend fun login(username: String, password: String): Result<AuthResponse>
    suspend fun register(username: String, password: String): Result<AuthResponse>
    suspend fun logout()
    suspend fun syncToServer()
    suspend fun syncFromServerFull()
}
