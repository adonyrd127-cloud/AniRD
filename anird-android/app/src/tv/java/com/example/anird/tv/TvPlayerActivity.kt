package com.example.anird.tv

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.lifecycleScope
import com.example.anird.R
import com.example.anird.data.model.StreamResponse
import com.example.anird.data.model.StreamServer
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.data.repository.AuthRepository
import kotlinx.coroutines.launch

/**
 * Actividad del Reproductor de Video de Android TV.
 * Carga servidores de streaming (Uwu, Mochi, Beep) desde el API del scraper y los reproduce
 * en un WebView optimizado a pantalla completa.
 * Proporciona un overlay nativo interactivo con D-pad para cambiar de servidor, cambiar entre
 * SUB/DUB, saltar de episodio, y guardar automáticamente el progreso de visualización en Room y la nube.
 */
class TvPlayerActivity : FragmentActivity() {

    companion object {
        private const val TAG = "AniRD-TvPlayer"
        private const val AUTO_HIDE_DELAY = 4000L // Ocultar controles tras 4 segundos de inactividad
    }

    private lateinit var animeRepo: AnimeRepository
    private lateinit var authRepo: AuthRepository
    
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null

    // Datos del episodio actual e historial
    private var animeId: Int = 0
    private var animeTitle: String = ""
    private var animeCover: String? = null
    
    private var currentEpisodeUrl: String = ""
    private var currentEpisodeNumber: Int = 1
    private var startTimeMs: Long = 0

    // Listas para control de Prev/Next
    private lateinit var episodesUrls: Array<String>
    private lateinit var episodesNumbers: IntArray
    private lateinit var episodesTitles: Array<String>

    // Servidores obtenidos
    private var streamServers = StreamResponse()
    private var isDubMode = false
    private var selectedServerUrl: String? = null

    // Vistas de la UI
    private lateinit var webView: WebView
    private lateinit var loadingLayout: RelativeLayout
    private lateinit var tvLoadingText: TextView
    private lateinit var controlsOverlay: RelativeLayout
    private lateinit var tvAnimeTitle: TextView
    private lateinit var tvEpisodeTitle: TextView
    private lateinit var btnPrev: Button
    private lateinit var btnNext: Button
    private lateinit var btnAudioSub: Button
    private lateinit var btnAudioDub: Button
    private lateinit var btnBack: Button
    private lateinit var serversContainer: LinearLayout

    // Control de auto-ocultación de controles
    private val handler = Handler(Looper.getMainLooper())
    private val hideControlsRunnable = Runnable { hideControls() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tv_player)

        animeRepo = TvRepositoryProvider.getAnimeRepository(this)
        authRepo = TvRepositoryProvider.getAuthRepository(this)
        startTimeMs = System.currentTimeMillis()

        extractIntentData()
        initViews()
        setupWebView()
        setupListeners()

        loadEpisodeData()
    }

    private fun extractIntentData() {
        animeId = intent.getIntExtra("anime_id", 0)
        animeTitle = intent.getStringExtra("anime_title") ?: ""
        animeCover = intent.getStringExtra("anime_cover")

        currentEpisodeUrl = intent.getStringExtra("episode_url") ?: ""
        currentEpisodeNumber = intent.getIntExtra("episode_number", 1)

        episodesUrls = intent.getStringArrayExtra("episodes_urls") ?: emptyArray()
        episodesNumbers = intent.getIntArrayExtra("episodes_numbers") ?: intArrayOf()
        episodesTitles = intent.getStringArrayExtra("episodes_titles") ?: emptyArray()
    }

    private fun initViews() {
        webView = findViewById(R.id.player_webview)
        loadingLayout = findViewById(R.id.loading_layout)
        tvLoadingText = findViewById(R.id.tv_loading_text)
        controlsOverlay = findViewById(R.id.controls_overlay)
        
        tvAnimeTitle = findViewById(R.id.tv_player_anime_title)
        tvEpisodeTitle = findViewById(R.id.tv_player_episode_title)
        
        btnPrev = findViewById(R.id.btn_player_prev)
        btnNext = findViewById(R.id.btn_player_next)
        btnAudioSub = findViewById(R.id.btn_audio_sub)
        btnAudioDub = findViewById(R.id.btn_audio_dub)
        btnBack = findViewById(R.id.btn_player_back)
        serversContainer = findViewById(R.id.servers_container)

        // Hacer el WebView enfocable para recibir clics del D-pad (play/pause del iframe)
        webView.isFocusable = true
        webView.isFocusableInTouchMode = true

        // Vincular navegación D-pad vertical: botones inferiores → servidores (arriba)
        btnPrev.nextFocusUpId = R.id.servers_container
        btnNext.nextFocusUpId = R.id.servers_container
        btnAudioSub.nextFocusUpId = R.id.servers_container
        btnAudioDub.nextFocusUpId = R.id.servers_container
        btnBack.nextFocusUpId = R.id.servers_container

        // Mostrar textos de títulos
        tvAnimeTitle.text = animeTitle
        updateEpisodeTitleText()

        // Mostrar controles por defecto al inicio
        showControls()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        // Habilitar cookies globales y cookies de terceros para CDNs cross-origin de stream
        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }

        // Optimización agresiva del WebView para TVs (Orange Pi / Fire TV)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort = true
            loadWithOverviewMode = true
            userAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Ocultar pantalla de carga una vez renderizado el reproductor iframe
                loadingLayout.visibility = View.GONE
            }

            override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: android.net.http.SslError?) {
                // Proceder ante errores transitorios de SSL en CDNs de stream
                handler?.proceed()
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: ""
                val isMainFrame = request?.isForMainFrame ?: false
                
                // Si la navegación es dentro de un subframe (iframe), permitirla siempre para evitar romper reproductores CDNs
                if (!isMainFrame) {
                    return false
                }

                // Para el frame principal, solo permitir la URL de referer, data URIs, o hosts autorizados
                val baseRefererUrl = com.example.anird.BuildConfig.API_BASE_URL.replace(":3005", ":8090")
                return if (url.startsWith("data:") || url.contains("10.0.0.9") || url.contains("100.101.132.92") || url.startsWith(baseRefererUrl)) {
                    false
                } else {
                    Log.d(TAG, "Redireccion externa en frame principal bloqueada: $url")
                    true
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            // Implementar pantalla completa nativa real solicitada por reproductores HTML5 embebidos
            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                if (customView != null) {
                    callback?.onCustomViewHidden()
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

                hideSystemBars()
            }

            override fun onHideCustomView() {
                hideCustomView()
            }

            override fun onPermissionRequest(request: PermissionRequest) {
                request.grant(request.resources)
            }
        }

        webView.setBackgroundColor(Color.BLACK)
    }

    private fun setupListeners() {
        btnBack.setOnClickListener {
            finish()
        }

        btnPrev.setOnClickListener {
            navigateEpisode(currentEpisodeNumber - 1)
        }

        btnNext.setOnClickListener {
            navigateEpisode(currentEpisodeNumber + 1)
        }

        btnAudioSub.setOnClickListener {
            if (isDubMode) {
                isDubMode = false
                updateAudioSelectorButtons()
                populateServers()
            }
        }

        btnAudioDub.setOnClickListener {
            if (!isDubMode) {
                isDubMode = true
                updateAudioSelectorButtons()
                populateServers()
            }
        }
    }

    /**
     * Cargar servidores de streaming del episodio.
     */
    private fun loadEpisodeData() {
        showLoading("Cargando servidores del Ep. $currentEpisodeNumber…")
        lifecycleScope.launch {
            try {
                val servers = animeRepo.getStreamServers(currentEpisodeUrl)
                streamServers = servers

                // Auto-detectar si hay servidores doblados si no hay subtitulados, o viceversa
                isDubMode = servers.sub.isEmpty() && servers.dub.isNotEmpty()
                
                updateAudioSelectorButtons()
                updateNavigationButtons()
                populateServers()

            } catch (e: Exception) {
                Log.e(TAG, "Error cargando servidores de streaming", e)
                showError("No hay servidores disponibles.")
            }
        }
    }

    private fun populateServers() {
        serversContainer.removeAllViews()
        val servers = if (isDubMode) streamServers.dub else streamServers.sub

        if (servers.isEmpty()) {
            showError("No hay servidores disponibles para este audio.")
            return
        }

        // Crear botones interactivos para cada servidor de streaming (Uwu, Mochi, Beep...)
        var firstServerButtonId = View.NO_ID
        for (i in servers.indices) {
            val server = servers[i]
            val contextThemeWrapper = android.view.ContextThemeWrapper(this, R.style.AniRD_TvButton_Secondary)
            val btnServer = Button(contextThemeWrapper).apply {
                id = View.generateViewId()
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    marginEnd = resources.getDimensionPixelSize(R.dimen.tv_spacing_sm)
                }
                text = server.displayName
                textSize = 13f
                setPadding(20, 8, 20, 8)
                isFocusable = true
                isFocusableInTouchMode = true
                // Vincular navegación D-pad vertical: servidor → fila de controles inferiores
                nextFocusDownId = R.id.btn_player_prev
                
                setOnClickListener {
                    playServer(server)
                }
            }

            if (i == 0) firstServerButtonId = btnServer.id
            serversContainer.addView(btnServer)
            
            // Auto-reproducir el primer servidor al cargar la lista
            if (i == 0) {
                playServer(server)
                btnServer.requestFocus()
            }
        }

        // Actualizar fila inferior para que UP lleve al primer botón de servidor
        if (firstServerButtonId != View.NO_ID) {
            val bottomButtons = listOf(btnPrev, btnNext, btnAudioSub, btnAudioDub, btnBack)
            for (btn in bottomButtons) {
                btn.nextFocusUpId = firstServerButtonId
            }
        }
    }

    private fun playServer(server: StreamServer) {
        selectedServerUrl = server.url
        
        // Resaltar visualmente el servidor seleccionado usando isSelected (preserva tv_button_selector focus states)
        for (i in 0 until serversContainer.childCount) {
            val child = serversContainer.getChildAt(i) as? Button ?: continue
            child.isSelected = (child.text == server.displayName)
        }

        showLoading("Cargando reproductor en ${server.displayName}…")

        // Asegurar que las URLs relativas del tipo //dominio se resuelvan a HTTPS para evitar fallos de protocolo mixto
        val iframeUrl = if (server.url.startsWith("//")) {
            "https:" + server.url
        } else {
            server.url
        }
        
        // Cargar iframe a pantalla completa con HTML personalizado para deshabilitar clicks publicitarios
        // e incluir permisos explícitos para autoplay, descifrado de contenido encriptado (DRM) y Picture-in-Picture
        val html = """
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                    body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background-color:#000; }
                    iframe { width:100%; height:100%; border:none; }
                </style>
            </head>
            <body>
                <iframe src="$iframeUrl" allowfullscreen="true" allow="autoplay; encrypted-media; picture-in-picture" scrolling="no"></iframe>
            </body>
            </html>
        """.trimIndent()

        // Cargamos la URL usando loadDataWithBaseURL para simular el referer correcto del frontend
        val baseRefererUrl = com.example.anird.BuildConfig.API_BASE_URL.replace(":3005", ":8090")
        webView.loadDataWithBaseURL(baseRefererUrl, html, "text/html", "utf-8", null)
    }

    private fun navigateEpisode(targetEpisodeNum: Int) {
        val index = episodesNumbers.indexOf(targetEpisodeNum)
        if (index == -1) return

        // 1. Guardar progreso actual del episodio anterior antes de cambiar
        saveEpisodeProgress()

        // 2. Cargar los nuevos parámetros del episodio
        currentEpisodeUrl = episodesUrls[index]
        currentEpisodeNumber = targetEpisodeNum
        
        // Reiniciar contador de tiempo de reproducción para el nuevo episodio
        startTimeMs = System.currentTimeMillis()

        updateEpisodeTitleText()
        loadEpisodeData()
    }

    private fun updateEpisodeTitleText() {
        val index = episodesNumbers.indexOf(currentEpisodeNumber)
        val epTitle = if (index != -1) episodesTitles[index] else "Episodio $currentEpisodeNumber"
        tvEpisodeTitle.text = epTitle
    }

    private fun updateAudioSelectorButtons() {
        btnAudioSub.visibility = if (streamServers.sub.isNotEmpty()) View.VISIBLE else View.GONE
        btnAudioDub.visibility = if (streamServers.dub.isNotEmpty()) View.VISIBLE else View.GONE
        
        // Usar isSelected para preservar los estados de focus del tv_button_selector
        btnAudioSub.isSelected = !isDubMode
        btnAudioDub.isSelected = isDubMode
    }

    private fun updateNavigationButtons() {
        val hasPrev = episodesNumbers.contains(currentEpisodeNumber - 1)
        val hasNext = episodesNumbers.contains(currentEpisodeNumber + 1)

        btnPrev.isEnabled = hasPrev
        btnNext.isEnabled = hasNext

        btnPrev.alpha = if (hasPrev) 1.0f else 0.4f
        btnNext.alpha = if (hasNext) 1.0f else 0.4f
    }

    // --- Control de Interfaz y Visibilidad ---

    private fun showControls() {
        controlsOverlay.visibility = View.VISIBLE
        // Auto-enfocar el primer elemento disponible
        if (serversContainer.childCount > 0) {
            serversContainer.getChildAt(0).requestFocus()
        } else {
            btnBack.requestFocus()
        }
        resetAutoHideTimer()
    }

    private fun hideControls() {
        controlsOverlay.visibility = View.INVISIBLE
        // Solicitar foco al WebView para que pueda recibir y procesar clics del D-pad
        webView.requestFocus()
    }

    private fun resetAutoHideTimer() {
        handler.removeCallbacks(hideControlsRunnable)
        handler.postDelayed(hideControlsRunnable, AUTO_HIDE_DELAY)
    }

    /**
     * Interceptar cualquier pulsación física del control remoto para mostrar controles.
     */
    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN) {
            if (controlsOverlay.visibility == View.INVISIBLE) {
                // Permitir que las teclas del D-pad (Direccionales y OK/Enter) y BACK pasen directamente al WebView
                // cuando los controles estén ocultos, para que el usuario pueda navegar por el iframe y dar PLAY.
                if (event.keyCode == KeyEvent.KEYCODE_DPAD_CENTER ||
                    event.keyCode == KeyEvent.KEYCODE_DPAD_LEFT ||
                    event.keyCode == KeyEvent.KEYCODE_DPAD_RIGHT ||
                    event.keyCode == KeyEvent.KEYCODE_DPAD_UP ||
                    event.keyCode == KeyEvent.KEYCODE_DPAD_DOWN ||
                    event.keyCode == KeyEvent.KEYCODE_ENTER ||
                    event.keyCode == KeyEvent.KEYCODE_BACK
                ) {
                    return super.dispatchKeyEvent(event)
                }
                
                showControls()
                return true
            }
            resetAutoHideTimer()
        }
        return super.dispatchKeyEvent(event)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (customView != null) {
                hideCustomView()
                return true
            }
            if (controlsOverlay.visibility == View.VISIBLE) {
                hideControls()
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }

    // --- Estado de Carga / Errores ---

    private fun showLoading(message: String) {
        loadingLayout.visibility = View.VISIBLE
        tvLoadingText.text = message
    }

    private fun showError(message: String) {
        loadingLayout.visibility = View.VISIBLE
        tvLoadingText.text = message
        // Ocultar ProgressBar para indicar que se detuvo por error
        findViewById<ProgressBar>(R.id.loading_progress).visibility = View.GONE
    }

    // --- Persistencia y Sincronización ---

    private fun saveEpisodeProgress() {
        if (animeId == 0) return
        val timeSpent = System.currentTimeMillis() - startTimeMs
        
        // Consideramos 24 minutos duración estándar por si no hay metadato
        val mockDuration = 24 * 60 * 1000L 
        
        lifecycleScope.launch {
            try {
                animeRepo.saveProgress(
                    animeId = animeId,
                    episodeNumber = currentEpisodeNumber,
                    progress = minOf(timeSpent, mockDuration),
                    duration = mockDuration,
                    title = animeTitle,
                    cover = animeCover
                )
                authRepo.syncToServer()
            } catch (e: Exception) {
                Log.w(TAG, "Error guardando progreso del episodio", e)
            }
        }
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        saveEpisodeProgress()
    }

    override fun onDestroy() {
        saveEpisodeProgress()
        webView.apply {
            stopLoading()
            webChromeClient = null
            destroy()
        }
        super.onDestroy()
    }

    private fun hideCustomView() {
        customView?.let { view ->
            val decorView = window.decorView as FrameLayout
            decorView.removeView(view)
        }
        customView = null
        customViewCallback?.onCustomViewHidden()
        customViewCallback = null

        showSystemBars()
    }

    @Suppress("DEPRECATION")
    private fun hideSystemBars() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            window.insetsController?.apply {
                hide(android.view.WindowInsets.Type.statusBars() or android.view.WindowInsets.Type.navigationBars())
                systemBarsBehavior = android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
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
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            window.insetsController?.show(
                android.view.WindowInsets.Type.statusBars() or android.view.WindowInsets.Type.navigationBars()
            )
        } else {
            window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
        }
    }
}
