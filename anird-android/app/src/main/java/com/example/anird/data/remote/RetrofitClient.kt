package com.example.anird.data.remote

import android.content.Context
import android.util.Log
import com.example.anird.BuildConfig
import com.example.anird.utils.JwtManager
import com.google.gson.GsonBuilder
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Singleton que provee las 3 instancias de Retrofit para las APIs.
 */
object RetrofitClient {
    private const val TAG = "AniRD-Retrofit"

    private val gson = GsonBuilder()
        .setLenient()
        .create()

    // --- Interceptors ---

    /** Interceptor que añade API Key al header para el API local */
    private val apiKeyInterceptor = Interceptor { chain ->
        val request = chain.request().newBuilder()
            .addHeader("X-API-Key", BuildConfig.API_KEY)
            .addHeader("Accept", "application/json")
            .build()
        chain.proceed(request)
    }

    /** Interceptor que añade JWT Bearer token para rutas de usuario */
    private class JwtInterceptor(private val jwtManager: JwtManager) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
            val requestBuilder = chain.request().newBuilder()
            val token = jwtManager.getToken()
            if (token != null) {
                requestBuilder.addHeader("Authorization", "Bearer $token")
            }
            return chain.proceed(requestBuilder.build())
        }
    }

    /** Logging interceptor (solo en debug) */
    private val loggingInterceptor = HttpLoggingInterceptor { message ->
        Log.d(TAG, message)
    }.apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }

    // --- Rate limiter simple para Jikan (500ms entre requests) ---

    private var lastJikanRequest = 0L
    private val jikanRateLimitInterceptor = Interceptor { chain ->
        synchronized(this) {
            val now = System.currentTimeMillis()
            val elapsed = now - lastJikanRequest
            if (elapsed < 500) {
                Thread.sleep(500 - elapsed)
            }
            lastJikanRequest = System.currentTimeMillis()
        }
        chain.proceed(chain.request())
    }

    // --- OkHttp Clients ---

    private val jikanClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(jikanRateLimitInterceptor)
        .addInterceptor(loggingInterceptor)
        .build()

    private fun localClient(jwtManager: JwtManager) = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(apiKeyInterceptor)
        .addInterceptor(JwtInterceptor(jwtManager))
        .addInterceptor(loggingInterceptor)
        .build()

    private val anilistClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(loggingInterceptor)
        .build()

    // --- Retrofit Instances ---

    val jikanApi: JikanApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.JIKAN_BASE_URL)
            .client(jikanClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(JikanApiService::class.java)
    }

    val anilistApi: AniListService by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.ANILIST_URL)
            .client(anilistClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(AniListService::class.java)
    }

    private var _localApi: LocalApiService? = null

    fun getLocalApi(context: Context, jwtManager: JwtManager): LocalApiService {
        if (_localApi == null) {
            val serverConfig = com.example.anird.utils.ServerConfigManager(context)
            val dynamicLocalClient = localClient(jwtManager).newBuilder()
                .addInterceptor { chain ->
                    var request = chain.request()
                    val targetIp = serverConfig.ip
                    val targetPort = serverConfig.port.toIntOrNull() ?: 3005
                    try {
                        val newUrl = request.url.newBuilder()
                            .host(targetIp)
                            .port(targetPort)
                            .build()
                        request = request.newBuilder().url(newUrl).build()
                    } catch (e: Exception) {
                        Log.e(TAG, "Error rewriting TV dynamic URL", e)
                    }
                    chain.proceed(request)
                }
                .build()

            _localApi = Retrofit.Builder()
                .baseUrl(BuildConfig.LOCAL_API_URL)
                .client(dynamicLocalClient)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()
                .create(LocalApiService::class.java)
        }
        return _localApi!!
    }

    /** Resetear el cliente local (por ejemplo al cambiar de token o de servidor) */
    fun resetLocalApi() {
        _localApi = null
    }
}
