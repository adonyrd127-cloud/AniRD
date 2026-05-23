package com.example.anird

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.anird.theme.AniRDTheme

class MainActivity : ComponentActivity() {
    private var webView: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        enableEdgeToEdge()
        
        // Manejador del botón Atrás físico (Navegación nativa de la app web)
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView?.canGoBack() == true) {
                    webView?.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                    isEnabled = true
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
                            clearCache(true)
                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                databaseEnabled = true
                                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                                cacheMode = WebSettings.LOAD_NO_CACHE
                                userAgentString = userAgentString + " AniRD-AndroidTV"
                                useWideViewPort = true
                                loadWithOverviewMode = true
                                mediaPlaybackRequiresUserGesture = false
                            }
                            loadUrl("http://10.0.0.9:8090")
                        }
                    }
                )
            }
        }
    }
}
