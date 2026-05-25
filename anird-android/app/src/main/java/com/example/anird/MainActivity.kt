package com.example.anird

import android.os.Build
import android.os.Bundle
import android.content.Context
import android.app.UiModeManager
import android.content.res.Configuration
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.view.WindowCompat
import com.example.anird.theme.AniRDTheme

class MainActivity : ComponentActivity() {

    private var webView: WebView? = null

    // ✅ FIX #1: Variables para manejar la vista fullscreen del video
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    private var isTV: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inicializar si es TV de manera dinámica
        val uiModeManager = getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager
        isTV = uiModeManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION

        // ✅ FIX #2: Reemplazar enableEdgeToEdge() por esto.
        // Hace que las system bars sean opacas y el contenido NO se incruste en ellas.
        WindowCompat.setDecorFitsSystemWindows(window, true)

        // Mantener pantalla encendida mientras la app está abierta
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Botón Atrás: salir de fullscreen primero, luego navegar en WebView
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                when {
                    // Si hay un video en fullscreen, cerrarlo primero
                    customView != null -> hideCustomView()
                    // Si el WebView tiene historial, navegar atrás
                    webView?.canGoBack() == true -> webView?.goBack()
                    // Si no, cerrar la app normalmente
                    else -> {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                        isEnabled = true
                    }
                }
            }
        })

        setContent {
            AniRDTheme {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { context ->
                        WebView(context).apply {
                            webView = this
                            webViewClient = WebViewClient()

                            // ✅ FIX #1: WebChromeClient con soporte completo de fullscreen
                            webChromeClient = object : WebChromeClient() {

                                /**
                                 * Se llama cuando el player pide ir a pantalla completa.
                                 * Agrega la vista del video encima de TODO el layout.
                                 */
                                override fun onShowCustomView(
                                    view: View,
                                    callback: CustomViewCallback
                                ) {
                                    // Si ya hay un video en fullscreen, rechazar
                                    if (customView != null) {
                                        callback.onCustomViewHidden()
                                        return
                                    }

                                    customView = view
                                    customViewCallback = callback

                                    // Agregar el video encima de todo el decorView
                                    val decorView = window.decorView as FrameLayout
                                    decorView.addView(
                                        customView,
                                        FrameLayout.LayoutParams(
                                            FrameLayout.LayoutParams.MATCH_PARENT,
                                            FrameLayout.LayoutParams.MATCH_PARENT
                                        )
                                    )

                                    // Si no es TV (es móvil/tablet), rotar pantalla a horizontal (Landscape)
                                    if (!isTV) {
                                        requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                                    }

                                    // Activar modo inmersivo (ocultar status bar + nav bar)
                                    hideSystemBars()
                                }

                                /**
                                 * Se llama cuando el usuario sale del fullscreen
                                 * (botón de salir fullscreen del player o botón Atrás).
                                 */
                                override fun onHideCustomView() {
                                    hideCustomView()
                                }
                            }

                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                databaseEnabled = true
                                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                                cacheMode = WebSettings.LOAD_DEFAULT
                                
                                // Usar la variable miembro de clase para configurar el User-Agent
                                userAgentString = if (isTV) {
                                    "$userAgentString AniRD-AndroidTV"
                                } else {
                                    "$userAgentString AniRD-AndroidMobile"
                                }

                                useWideViewPort = true
                                loadWithOverviewMode = true
                                mediaPlaybackRequiresUserGesture = false
                                // Permitir zoom manual si el usuario lo necesita
                                setSupportZoom(false)
                                builtInZoomControls = false
                            }

                            loadUrl("http://10.0.0.9:8090")
                        }
                    }
                )
            }
        }
    }

    /**
     * Quita la vista fullscreen del video y restaura las barras del sistema.
     */
    private fun hideCustomView() {
        customView?.let { view ->
            val decorView = window.decorView as FrameLayout
            decorView.removeView(view)
        }
        customView = null
        customViewCallback?.onCustomViewHidden()
        customViewCallback = null

        // Si no es TV (es móvil/tablet), restaurar orientación normal
        if (!isTV) {
            requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        }

        // Restaurar las barras del sistema
        showSystemBars()
    }

    /**
     * Oculta status bar y navigation bar para fullscreen inmersivo.
     * Compatible con Android 11+ (API 30) y versiones anteriores.
     */
    @Suppress("DEPRECATION")
    private fun hideSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // Android 11+ — API moderna
            window.insetsController?.apply {
                hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            // Android 10 y anteriores — API legacy
            @Suppress("DEPRECATION")
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

    /**
     * Restaura status bar y navigation bar después del fullscreen.
     */
    @Suppress("DEPRECATION")
    private fun showSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.show(
                WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars()
            )
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
        }
    }
}
