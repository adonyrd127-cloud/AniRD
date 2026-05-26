package com.example.anird

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PictureInPictureParams
import android.app.UiModeManager
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.util.Rational
import android.view.KeyEvent
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.webkit.*
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.example.anird.theme.AniRDTheme
import java.util.concurrent.Executor

class MainActivity : FragmentActivity() {

    private var webView: WebView? = null
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    
    private var isTV: Boolean = false
    private var isWebViewReady = false
    private val baseUrl = BuildConfig.API_BASE_URL

    private lateinit var mediaSession: MediaSessionCompat
    private lateinit var executor: Executor

    override fun onCreate(savedInstanceState: Bundle?) {
        // FASE E.1: Inicializar Splash Screen nativa antes de onCreate
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        // Mantener el splash screen visible hasta que el WebView cargue
        splashScreen.setKeepOnScreenCondition { !isWebViewReady }

        // Inicializar si es TV de manera dinámica
        val uiModeManager = getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager
        isTV = uiModeManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION

        // FASE B.5 & E.1: Edge-to-edge e insets
        WindowCompat.setDecorFitsSystemWindows(window, false)

        // Mantener pantalla encendida mientras la app está abierta
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // FASE B.2: Configurar Media Session
        setupMediaSession()

        // FASE E.2: Crear canales de notificación
        createNotificationChannels()

        executor = ContextCompat.getMainExecutor(this)

        // Botón Atrás: salir de fullscreen primero, luego navegar en WebView
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                when {
                    customView != null -> hideCustomView()
                    webView?.canGoBack() == true -> webView?.goBack()
                    else -> {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                        isEnabled = true
                    }
                }
            }
        })

        // Manejar deep link inicial si existe
        handleDeepLink(intent)

        setContent {
            AniRDTheme {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { context ->
                        WebView(context).apply {
                            webView = this
                            
                            // WebView Remote Debugging en base a BuildConfig
                            if (BuildConfig.ENABLE_WEBVIEW_DEBUG) {
                                WebView.setWebContentsDebuggingEnabled(true)
                            }

                            // FASE B.5: Edge-to-Edge display con padding inteligente
                            ViewCompat.setOnApplyWindowInsetsListener(this) { view, insets ->
                                val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
                                // Si está en fullscreen (reproduciendo), no aplicar padding
                                if (customView != null) {
                                    view.setPadding(0, 0, 0, 0)
                                } else {
                                    view.setPadding(0, bars.top, 0, bars.bottom)
                                }
                                insets
                            }

                            // FASE A.4: WebViewClient
                            webViewClient = object : WebViewClient() {
                                override fun shouldOverrideUrlLoading(
                                    view: WebView,
                                    request: WebResourceRequest
                                ): Boolean {
                                    val url = request.url.toString()
                                    return if (url.startsWith("http://100.") ||
                                        url.startsWith("http://10.0.0") ||
                                        url.startsWith("http://localhost") ||
                                        url.startsWith("anird://")
                                    ) {
                                        if (url.startsWith("anird://")) {
                                            handleDeepLink(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                            true
                                        } else {
                                            false
                                        }
                                    } else {
                                        try {
                                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                        } catch (e: Exception) {
                                            e.printStackTrace()
                                        }
                                        true
                                    }
                                }

                                override fun onReceivedError(
                                    view: WebView,
                                    request: WebResourceRequest,
                                    error: WebResourceError
                                ) {
                                    if (request.isForMainFrame) {
                                        isWebViewReady = true
                                        view.loadData(
                                            """
                                            <html><body style="background:#0f0f0f;color:#f1f1f1;font-family:sans-serif;
                                              display:flex;flex-direction:column;align-items:center;justify-content:center;
                                              height:100vh;margin:0;text-align:center;gap:16px;padding:24px;">
                                              <h2 style="color:#e63946;margin-bottom:8px;">Sin conexión</h2>
                                              <p style="color:#aaa;line-height:1.6;">No se pudo conectar al servidor de AniRD.<br>Verifica que tu conexión o Tailscale estén activos.</p>
                                              <button onclick="location.reload()"
                                                style="background:#e63946;color:#fff;border:none;padding:12px 28px;
                                                border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer;margin-top:8px;
                                                box-shadow: 0 4px 6px rgba(0,0,0,0.2);">Reintentar</button>
                                            </body></html>
                                            """.trimIndent(),
                                            "text/html", "UTF-8"
                                        )
                                    }
                                }

                                override fun onPageFinished(view: WebView, url: String) {
                                    isWebViewReady = true
                                    // FASE C.4: Si es Android TV, inyectar tv-mode al body
                                    if (isTV) {
                                        view.evaluateJavascript(
                                            "document.body.classList.add('tv-mode');", null
                                        )
                                    }
                                }
                            }

                            // FASE A.3: WebChromeClient
                            webChromeClient = object : WebChromeClient() {
                                override fun onShowCustomView(
                                    view: View,
                                    callback: CustomViewCallback
                                ) {
                                    if (customView != null) {
                                        callback.onCustomViewHidden()
                                        return
                                    }

                                    customView = view
                                    customViewCallback = callback

                                    val decorView = window.decorView as FrameLayout
                                    decorView.addView(
                                        customView,
                                        FrameLayout.LayoutParams(
                                            FrameLayout.LayoutParams.MATCH_PARENT,
                                            FrameLayout.LayoutParams.MATCH_PARENT
                                        )
                                    )

                                    if (!isTV) {
                                        requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                                    }

                                    hideSystemBars()
                                }

                                override fun onHideCustomView() {
                                    hideCustomView()
                                }

                                override fun onPermissionRequest(request: PermissionRequest) {
                                    request.grant(request.resources)
                                }
                            }

                            // FASE A.1: Configuración de Settings
                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                databaseEnabled = true
                                cacheMode = WebSettings.LOAD_DEFAULT
                                mediaPlaybackRequiresUserGesture = false
                                allowFileAccess = false
                                allowContentAccess = false
                                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                                
                                userAgentString = if (isTV) {
                                    "$userAgentString AniRD-AndroidTV"
                                } else {
                                    "$userAgentString AniRD-AndroidMobile"
                                }

                                useWideViewPort = true
                                loadWithOverviewMode = true
                                setSupportZoom(false)
                                builtInZoomControls = false
                                displayZoomControls = false
                            }

                            // FASE B.1, B.2, E.3: Agregar JS Bridge nativo
                            addJavascriptInterface(JsBridge(), "Android")

                            loadUrl(baseUrl)
                        }
                    }
                )
            }
        }
    }

    private fun handleDeepLink(intent: Intent?) {
        val data = intent?.data ?: return
        val path = data.toString()
        webView?.let { view ->
            when {
                path.startsWith("anird://history") -> view.loadUrl("$baseUrl/#/history")
                path.startsWith("anird://favorites") -> view.loadUrl("$baseUrl/#/favorites")
                path.contains("/anime/") -> {
                    val id = data.lastPathSegment
                    view.loadUrl("$baseUrl/#/anime/$id")
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleDeepLink(intent)
    }

    // FASE A.3: Ocultar vista fullscreen del video
    private fun hideCustomView() {
        customView?.let { view ->
            val decorView = window.decorView as FrameLayout
            decorView.removeView(view)
        }
        customView = null
        customViewCallback?.onCustomViewHidden()
        customViewCallback = null

        if (!isTV) {
            requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        }

        showSystemBars()
    }

    @Suppress("DEPRECATION")
    private fun hideSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.apply {
                hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            )
        }
    }

    @Suppress("DEPRECATION")
    private fun showSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.show(
                WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars()
            )
        } else {
            window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
        }
    }

    // FASE B.1: Picture-in-Picture (PiP)
    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        enterPipIfWatching()
    }

    private fun enterPipIfWatching() {
        webView?.evaluateJavascript(
            "window.AniRDBridge?.isPlaying() || false"
        ) { result ->
            if (result == "true" && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val params = PictureInPictureParams.Builder()
                    .setAspectRatio(Rational(16, 9))
                    .build()
                enterPictureInPictureMode(params)
            }
        }
    }

    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration
    ) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        webView?.evaluateJavascript(
            if (isInPictureInPictureMode)
                "window.AniRDBridge?.enterPip()"
            else
                "window.AniRDBridge?.exitPip()"
            , null
        )
    }

    // FASE B.2: Media Session
    private fun setupMediaSession() {
        mediaSession = MediaSessionCompat(this, "AniRD").apply {
            setCallback(object : MediaSessionCompat.Callback() {
                override fun onPlay() {
                    webView?.evaluateJavascript("window.AniRDBridge?.play()", null)
                }

                override fun onPause() {
                    webView?.evaluateJavascript("window.AniRDBridge?.pause()", null)
                }

                override fun onSkipToNext() {
                    webView?.evaluateJavascript("window.AniRDBridge?.nextEpisode()", null)
                }

                override fun onSkipToPrevious() {
                    webView?.evaluateJavascript("window.AniRDBridge?.prevEpisode()", null)
                }
            })
            isActive = true
        }
    }

    fun updateMediaSession(title: String, isPlaying: Boolean) {
        val state = PlaybackStateCompat.Builder()
            .setState(
                if (isPlaying) PlaybackStateCompat.STATE_PLAYING
                else PlaybackStateCompat.STATE_PAUSED,
                PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN,
                1f
            )
            .setActions(
                PlaybackStateCompat.ACTION_PLAY or
                PlaybackStateCompat.ACTION_PAUSE or
                PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
            )
            .build()

        mediaSession.setPlaybackState(state)
        mediaSession.setMetadata(
            MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, "AniRD")
                .build()
        )
    }

    // FASE C.3: HDMI CEC / Control Remoto TV
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE -> {
                webView?.evaluateJavascript("window.AniRDBridge?.togglePlayPause();", null)
                true
            }
            KeyEvent.KEYCODE_MEDIA_PLAY -> {
                webView?.evaluateJavascript("window.AniRDBridge?.play();", null)
                true
            }
            KeyEvent.KEYCODE_MEDIA_PAUSE -> {
                webView?.evaluateJavascript("window.AniRDBridge?.pause();", null)
                true
            }
            KeyEvent.KEYCODE_MEDIA_NEXT -> {
                webView?.evaluateJavascript("window.AniRDBridge?.nextEpisode();", null)
                true
            }
            KeyEvent.KEYCODE_MEDIA_PREVIOUS -> {
                webView?.evaluateJavascript("window.AniRDBridge?.prevEpisode();", null)
                true
            }
            KeyEvent.KEYCODE_MEDIA_FAST_FORWARD -> {
                webView?.evaluateJavascript("window.AniRDBridge?.seekForward(30);", null)
                true
            }
            KeyEvent.KEYCODE_MEDIA_REWIND -> {
                webView?.evaluateJavascript("window.AniRDBridge?.seekBack(10);", null)
                true
            }
            KeyEvent.KEYCODE_BACK -> {
                // Si estamos en TV, permitir al JS controlar el retroceso antes de salir
                if (isTV) {
                    webView?.evaluateJavascript(
                        "window.AniRDBridge?.handleBack() || false"
                    ) { result ->
                        if (result != "true") {
                            finish()
                        }
                    }
                    true
                } else {
                    super.onKeyDown(keyCode, event)
                }
            }
            else -> super.onKeyDown(keyCode, event)
        }
    }

    // FASE E.2: Canales de Notificación
    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelNewEps = NotificationChannel(
                "new_episodes",
                "Nuevos episodios",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Aviso cuando sale un nuevo episodio de tus animes seguidos"
                setShowBadge(true)
            }

            val channelSync = NotificationChannel(
                "sync_status",
                "Sincronización",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Estado de sincronización con el servidor"
            }

            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannels(listOf(channelNewEps, channelSync))
        }
    }

    // FASE E.3: Autenticación Biométrica
    fun authenticateWithBiometrics() {
        val biometricManager = BiometricManager.from(this)
        if (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG) != BiometricManager.BIOMETRIC_SUCCESS) {
            return
        }

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Acceder a AniRD")
            .setSubtitle("Usa tu huella o Face Unlock")
            .setNegativeButtonText("Usar contraseña")
            .build()

        val biometricPrompt = BiometricPrompt(this, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                try {
                    val masterKey = MasterKey.Builder(this@MainActivity)
                        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                        .build()
                    val prefs = EncryptedSharedPreferences.create(
                        this@MainActivity,
                        "anird_secure_prefs",
                        masterKey,
                        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                    )
                    val token = prefs.getString("jwt_token", null)
                    if (token != null) {
                        webView?.evaluateJavascript(
                            "window.AniRDBridge?.loginWithToken('$token')", null
                        )
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        })

        biometricPrompt.authenticate(promptInfo)
    }

    // JS Bridge para interactuar con el Frontend Vite
    inner class JsBridge {
        @JavascriptInterface
        fun onPlaybackChanged(title: String, isPlaying: Boolean) {
            runOnUiThread {
                updateMediaSession(title, isPlaying)
            }
        }

        @JavascriptInterface
        fun saveToken(token: String) {
            runOnUiThread {
                try {
                    val masterKey = MasterKey.Builder(this@MainActivity)
                        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                        .build()
                    val prefs = EncryptedSharedPreferences.create(
                        this@MainActivity,
                        "anird_secure_prefs",
                        masterKey,
                        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                    )
                    prefs.edit().putString("jwt_token", token).apply()
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }

        @JavascriptInterface
        fun requestBiometricAuth() {
            runOnUiThread {
                authenticateWithBiometrics()
            }
        }
    }
}
