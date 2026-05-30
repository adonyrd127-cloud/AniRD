package com.example.anird.presentation.screens

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.pm.ActivityInfo
import android.media.AudioManager
import android.net.Uri
import android.view.ViewGroup
import android.view.WindowManager
import androidx.activity.compose.BackHandler
import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import com.example.anird.data.model.StreamServer
import com.example.anird.presentation.viewmodels.PlayerUiState
import com.example.anird.presentation.viewmodels.PlayerViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.math.abs

@Composable
fun PlayerScreen(
    malId: Int,
    episode: Int,
    onBackClick: () -> Unit = {},
    viewModel: PlayerViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val uiState by viewModel.uiState.collectAsState()

    // 1. Forzar orientación horizontal (Landscape) al entrar y restaurar vertical (Portrait) al salir
    DisposableEffect(key1 = Unit) {
        val activity = context.findActivity()
        activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
        // Ocultar barra de estado y barras del sistema
        activity?.window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        
        onDispose {
            activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    // Volver al hacer click en el botón de retroceso nativo
    BackHandler {
        onBackClick()
    }

    LaunchedEffect(malId, episode) {
        viewModel.loadEpisodeVideo(malId, episode)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        when (val state = uiState) {
            is PlayerUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                }
            }
            is PlayerUiState.Error -> {
                Box(
                    modifier = Modifier.fillMaxSize().padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Error de reproducción",
                            color = Color.White,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = state.message,
                            color = Color.LightGray,
                            fontSize = 14.sp,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.loadEpisodeVideo(malId, episode) },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Text("Reintentar")
                        }
                    }
                }
            }
            is PlayerUiState.Success -> {
                VideoPlayerContainer(
                    state = state,
                    onBackClick = onBackClick,
                    onProgressUpdate = { progress, duration ->
                        viewModel.saveWatchProgress(progress, duration)
                    },
                    onServerSelected = { viewModel.selectServer(it) },
                    onLanguageSelected = { viewModel.selectLanguage(it) }
                )
            }
        }
    }
}

@Composable
fun VideoPlayerContainer(
    state: PlayerUiState.Success,
    onBackClick: () -> Unit,
    onProgressUpdate: (Long, Long) -> Unit,
    onServerSelected: (StreamServer) -> Unit,
    onLanguageSelected: (String) -> Unit
) {
    val context = LocalContext.current
    val activity = context.findActivity()

    // Gestión del AudioManager para regular volumen
    val audioManager = remember { context.getSystemService(Context.AUDIO_SERVICE) as AudioManager }
    val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC).toFloat()

    // 2. Estados de gestos y sliders
    var volume by remember { mutableStateOf(audioManager.getStreamVolume(AudioManager.STREAM_MUSIC) / maxVolume) }
    var brightness by remember {
        mutableStateOf(
            activity?.window?.attributes?.screenBrightness ?: 0.5f
        )
    }

    var gestureIndicatorType by remember { mutableStateOf<String?>(null) } // "volume" o "brightness" or "seek"
    var gestureIndicatorValue by remember { mutableStateOf(0f) }

    // 3. Inicializar ExoPlayer
    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            playWhenReady = true
        }
    }

    var isPlaying by remember { mutableStateOf(false) }

    // Liberar el reproductor al destruir la vista
    DisposableEffect(key1 = exoPlayer) {
        val listener = object : Player.Listener {
            override fun onIsPlayingChanged(isPlayingChanged: Boolean) {
                isPlaying = isPlayingChanged
            }
        }
        exoPlayer.addListener(listener)
        onDispose {
            // Guardar el último progreso antes de liberar
            onProgressUpdate(exoPlayer.currentPosition, exoPlayer.duration)
            exoPlayer.removeListener(listener)
            exoPlayer.release()
        }
    }

    val isHtml = remember(state.currentServer.url) {
        val lower = state.currentServer.url.lowercase(java.util.Locale.ROOT)
        lower.contains("zilla-networks") || 
        lower.contains("zilla") ||
        lower.contains("embed") || 
        lower.contains("play") || 
        lower.contains("mp4upload") || 
        lower.contains("fembed") || 
        lower.contains("mega.nz") || 
        lower.contains("ok.ru") || 
        (!lower.endsWith(".mp4") && !lower.endsWith(".m3u8") && !lower.contains(".m3u8") && !lower.contains(".mp4"))
    }

    // Configurar la URL de video cada vez que cambia el servidor seleccionado
    LaunchedEffect(state.currentServer) {
        if (isHtml) {
            exoPlayer.stop()
        } else {
            val videoUri = Uri.parse(state.currentServer.url)
            val mediaItem = MediaItem.fromUri(videoUri)
            exoPlayer.setMediaItem(mediaItem)
            
            // Cargar progreso guardado si existe
            val initialProgress = state.episode.watchedProgressMs ?: 0L
            exoPlayer.prepare()
            if (initialProgress > 0L) {
                exoPlayer.seekTo(initialProgress)
            }
            exoPlayer.play()
        }
    }

    // 4. Temporizador de guardado automático de progreso (cada 8 segundos)
    LaunchedEffect(key1 = Unit) {
        while (true) {
            delay(8000)
            if (exoPlayer.isPlaying) {
                onProgressUpdate(exoPlayer.currentPosition, exoPlayer.duration)
            }
        }
    }

    // 5. Control de visibilidad de overlays
    var controlsVisible by remember { mutableStateOf(true) }
    LaunchedEffect(controlsVisible) {
        if (controlsVisible) {
            delay(4000) // Ocultar después de 4 segundos
            controlsVisible = false
        }
    }

    // Estructura visual interactiva
    val parentModifier = if (!isHtml) {
        Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                // Gestos swiping en el reproductor (Netflix/Crunchyroll Style)
                detectDragGestures(
                    onDragStart = { offset ->
                        // Al arrancar, si los controles estaban visibles, los apagamos temporalmente para no estorbar
                        controlsVisible = false
                    },
                    onDragEnd = {
                        gestureIndicatorType = null
                    },
                    onDrag = { change, dragAmount ->
                        change.consume()
                        val width = size.width
                        val height = size.height
                        
                        // Si el arrastre es predominantemente vertical
                        if (abs(dragAmount.y) > abs(dragAmount.x)) {
                            // Mitad izquierda -> Brillo
                            if (change.position.x < width / 2) {
                                gestureIndicatorType = "brightness"
                                // Ajuste sensible al arrastre
                                val delta = -dragAmount.y / height
                                brightness = (brightness + delta).coerceIn(0.01f, 1f)
                                
                                val layoutParams = activity?.window?.attributes
                                layoutParams?.screenBrightness = brightness
                                activity?.window?.attributes = layoutParams
                                gestureIndicatorValue = brightness
                            } 
                            // Mitad derecha -> Volumen
                            else {
                                gestureIndicatorType = "volume"
                                val delta = -dragAmount.y / height
                                volume = (volume + delta).coerceIn(0f, 1f)
                                
                                val targetVol = (volume * maxVolume).toInt()
                                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, targetVol, 0)
                                gestureIndicatorValue = volume
                            }
                        }
                    }
                )
            }
            .clickable { controlsVisible = !controlsVisible }
    } else {
        Modifier.fillMaxSize()
    }

    Box(modifier = parentModifier) {
        // Reproductor de Video Nativo AndroidView (Soporta ExoPlayer para streams directos y WebView para iframes/embeds)
        if (isHtml) {
            AndroidView(
                factory = { ctx ->
                    android.webkit.WebView(ctx).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.mediaPlaybackRequiresUserGesture = false
                        settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                        settings.userAgentString = "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                        webViewClient = android.webkit.WebViewClient()
                        webChromeClient = android.webkit.WebChromeClient()
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                update = { webView ->
                    if (webView.url != state.currentServer.url) {
                        webView.loadUrl(state.currentServer.url)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )

            // Header flotante superior siempre visible para WebView (no bloquea clics en el reproductor)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.TopStart)
                    .background(Color.Black.copy(alpha = 0.4f))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = onBackClick,
                        modifier = Modifier.background(Color.Black.copy(alpha = 0.3f), CircleShape)
                    ) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Atrás", tint = Color.White)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = state.anime?.displayTitle ?: "Anime",
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = "Episodio ${state.episode.episodeNumber}",
                            color = Color.LightGray,
                            fontSize = 12.sp
                        )
                    }
                }

                ServerSelectorMenu(
                    servers = state.servers,
                    currentServer = state.currentServer,
                    subOrDub = state.subOrDub,
                    onServerSelected = onServerSelected,
                    onLanguageSelected = onLanguageSelected
                )
            }
        } else {
            AndroidView(
                factory = { ctx ->
                    PlayerView(ctx).apply {
                        player = exoPlayer
                        useController = false // Deshabilitar controles XML por defecto
                        resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                modifier = Modifier.fillMaxSize()
            )

            // 6. Indicadores visuales temporales de gestos (Swipe)
            AnimatedVisibility(
                visible = gestureIndicatorType != null,
                enter = fadeIn() + scaleIn(),
                exit = fadeOut() + scaleOut(),
                modifier = Modifier.align(Alignment.Center)
            ) {
                Box(
                    modifier = Modifier
                        .background(Color.Black.copy(alpha = 0.7f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 24.dp, vertical = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (gestureIndicatorType == "brightness") Icons.Default.Star else Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = String.format("%d%%", (gestureIndicatorValue * 100).toInt()),
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // 7. Capa de Controles Personalizados para ExoPlayer
            AnimatedVisibility(
                visible = controlsVisible,
                enter = fadeIn() + slideInVertically { it / 4 },
                exit = fadeOut() + slideOutVertically { it / 4 },
                modifier = Modifier.fillMaxSize()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f))
                ) {
                    // Header (Título y Botón volver)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .align(Alignment.TopStart)
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(
                                onClick = onBackClick,
                                modifier = Modifier.background(Color.Black.copy(alpha = 0.3f), CircleShape)
                            ) {
                                Icon(Icons.Default.ArrowBack, contentDescription = "Atrás", tint = Color.White)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = state.anime?.displayTitle ?: "Anime",
                                    color = Color.White,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "Episodio ${state.episode.episodeNumber}",
                                    color = Color.LightGray,
                                    fontSize = 12.sp
                                )
                            }
                        }

                        // Selector de servidor / calidad
                        ServerSelectorMenu(
                            servers = state.servers,
                            currentServer = state.currentServer,
                            subOrDub = state.subOrDub,
                            onServerSelected = onServerSelected,
                            onLanguageSelected = onLanguageSelected
                        )
                    }

                    // Centro (Play/Pause/Rewind/FastForward)
                    Row(
                        modifier = Modifier.align(Alignment.Center),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(40.dp)
                    ) {
                        IconButton(
                            onClick = { exoPlayer.seekTo(exoPlayer.currentPosition - 10000) },
                            modifier = Modifier.size(48.dp)
                        ) {
                            Icon(
                                imageVector = IconsDefaultFastRewind,
                                contentDescription = "Retroceder 10s",
                                tint = Color.White,
                                modifier = Modifier.size(32.dp)
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary)
                                .clickable {
                                    if (exoPlayer.isPlaying) {
                                        exoPlayer.pause()
                                    } else {
                                        exoPlayer.play()
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isPlaying) IconsDefaultPause else Icons.Default.PlayArrow,
                                contentDescription = if (isPlaying) "Pausar" else "Reproducir",
                                tint = MaterialTheme.colorScheme.onPrimary,
                                modifier = Modifier.size(36.dp)
                            )
                        }

                        IconButton(
                            onClick = { exoPlayer.seekTo(exoPlayer.currentPosition + 10000) },
                            modifier = Modifier.size(48.dp)
                        ) {
                            Icon(
                                imageVector = IconsDefaultFastForward,
                                contentDescription = "Adelantar 10s",
                                tint = Color.White,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    // Footer (Barra de Progreso y Tiempo de Duración)
                    var currentPosition by remember { mutableStateOf(exoPlayer.currentPosition) }
                    var totalDuration by remember { mutableStateOf(exoPlayer.duration.coerceAtLeast(0L)) }

                    DisposableEffect(exoPlayer) {
                        val listener = object : Player.Listener {
                            override fun onEvents(player: Player, events: Player.Events) {
                                currentPosition = player.currentPosition
                                totalDuration = player.duration.coerceAtLeast(0L)
                            }
                        }
                        exoPlayer.addListener(listener)
                        onDispose { exoPlayer.removeListener(listener) }
                    }

                    // Corrutina para actualizar la barra en tiempo real
                    LaunchedEffect(isPlaying) {
                        while (isPlaying) {
                            currentPosition = exoPlayer.currentPosition
                            totalDuration = exoPlayer.duration.coerceAtLeast(0L)
                            delay(500)
                        }
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .align(Alignment.BottomStart)
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = formatTime(currentPosition),
                                color = Color.White,
                                fontSize = 12.sp
                            )
                            
                            // Slider de Seek
                            Slider(
                                value = if (totalDuration > 0) currentPosition.toFloat() / totalDuration else 0f,
                                onValueChange = { fraction ->
                                    val targetPos = (fraction * totalDuration).toLong()
                                    exoPlayer.seekTo(targetPos)
                                },
                                colors = SliderDefaults.colors(
                                    thumbColor = MaterialTheme.colorScheme.primary,
                                    activeTrackColor = MaterialTheme.colorScheme.primary,
                                    inactiveTrackColor = Color.Gray.copy(alpha = 0.5f)
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(horizontal = 16.dp)
                            )

                            Text(
                                text = formatTime(totalDuration),
                                color = Color.White,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ServerSelectorMenu(
    servers: List<StreamServer>,
    currentServer: StreamServer,
    subOrDub: String,
    onServerSelected: (StreamServer) -> Unit,
    onLanguageSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Box {
        Button(
            onClick = { expanded = true },
            colors = ButtonDefaults.buttonColors(containerColor = Color.Black.copy(alpha = 0.4f)),
            shape = RoundedCornerShape(20.dp),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Menu, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${currentServer.displayName} (${subOrDub.uppercase()})",
                    fontSize = 12.sp,
                    color = Color.White
                )
            }
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.background(Color(0xFF1E2127))
        ) {
            // Sección de Idiomas
            Text(
                text = "Idioma",
                color = Color.Gray,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
            DropdownMenuItem(
                text = { Text("Subtitulado", color = if (subOrDub == "sub") MaterialTheme.colorScheme.primary else Color.White) },
                onClick = {
                    onLanguageSelected("sub")
                    expanded = false
                }
            )
            DropdownMenuItem(
                text = { Text("Doblaje Latino", color = if (subOrDub == "dub") MaterialTheme.colorScheme.primary else Color.White) },
                onClick = {
                    onLanguageSelected("dub")
                    expanded = false
                }
            )

            HorizontalDivider(color = Color.Gray.copy(alpha = 0.2f))

            // Sección de Servidores
            Text(
                text = "Servidor",
                color = Color.Gray,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
            servers.forEach { server ->
                DropdownMenuItem(
                    text = { Text(server.displayName, color = if (server.server == currentServer.server) MaterialTheme.colorScheme.primary else Color.White) },
                    onClick = {
                        onServerSelected(server)
                        expanded = false
                    }
                )
            }
        }
    }
}

// Helpers para formatear tiempo
private fun formatTime(ms: Long): String {
    val seconds = (ms / 1000) % 60
    val minutes = (ms / (1000 * 60)) % 60
    val hours = (ms / (1000 * 60 * 60))
    return if (hours > 0) {
        String.format("%d:%02d:%02d", hours, minutes, seconds)
    } else {
        String.format("%02d:%02d", minutes, seconds)
    }
}

// Helper para encontrar la Activity del Context actual
private fun Context.findActivity(): Activity? {
    var context = this
    while (context is ContextWrapper) {
        if (context is Activity) return context
        context = context.baseContext
    }
    return null
}
