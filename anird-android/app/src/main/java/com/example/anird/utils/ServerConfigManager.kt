package com.example.anird.utils

import android.content.Context
import android.content.SharedPreferences
import com.example.anird.BuildConfig

class ServerConfigManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("anird_server_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_IP = "server_ip"
        private const val KEY_PORT = "server_port"
        private const val KEY_CONFIG_VERSION = "config_version"
        private const val CURRENT_CONFIG_VERSION = 2 // Incrementar al cambiar defaults
        
        // Extraer IP y puerto por defecto desde BuildConfig (definidos en build.gradle.kts)
        private val DEFAULT_IP: String
        private val DEFAULT_PORT: String

        init {
            val url = BuildConfig.LOCAL_API_URL.removePrefix("http://").removePrefix("https://").removeSuffix("/api/v1/")
            val parts = url.split(":")
            DEFAULT_IP = parts.getOrNull(0) ?: "10.0.0.9"
            DEFAULT_PORT = parts.getOrNull(1) ?: "3005"
        }
    }

    init {
        // Migración: si la versión de config guardada es antigua, resetear a los nuevos defaults
        val savedVersion = prefs.getInt(KEY_CONFIG_VERSION, 0)
        if (savedVersion < CURRENT_CONFIG_VERSION) {
            prefs.edit()
                .putString(KEY_IP, DEFAULT_IP)
                .putString(KEY_PORT, DEFAULT_PORT)
                .putInt(KEY_CONFIG_VERSION, CURRENT_CONFIG_VERSION)
                .apply()
        }
    }

    var ip: String
        get() = prefs.getString(KEY_IP, DEFAULT_IP) ?: DEFAULT_IP
        set(value) = prefs.edit().putString(KEY_IP, value.trim()).apply()

    var port: String
        get() = prefs.getString(KEY_PORT, DEFAULT_PORT) ?: DEFAULT_PORT
        set(value) = prefs.edit().putString(KEY_PORT, value.trim()).apply()

    val baseUrl: String
        get() = "http://$ip:$port/api/v1/"
}
