package com.example.anird.utils

import android.content.Context
import android.util.Log
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

/**
 * Gestión segura del JWT usando EncryptedSharedPreferences.
 */
class JwtManager(context: Context) {
    companion object {
        private const val TAG = "AniRD-JWT"
        private const val PREFS_NAME = "anird_secure_prefs"
        private const val KEY_TOKEN = "jwt_token"
        private const val KEY_USERNAME = "username"
    }

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs = try {
        EncryptedSharedPreferences.create(
            context,
            PREFS_NAME,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    } catch (e: Exception) {
        Log.e(TAG, "Error creando EncryptedSharedPreferences, usando fallback", e)
        context.getSharedPreferences(PREFS_NAME + "_fallback", Context.MODE_PRIVATE)
    }

    fun saveToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
        Log.d(TAG, "Token guardado exitosamente")
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun saveUsername(username: String) {
        prefs.edit().putString(KEY_USERNAME, username).apply()
    }

    fun getUsername(): String? {
        return prefs.getString(KEY_USERNAME, null)
    }

    fun isLoggedIn(): Boolean {
        return getToken() != null
    }

    fun clear() {
        prefs.edit().clear().apply()
        Log.d(TAG, "Credenciales eliminadas")
    }
}
