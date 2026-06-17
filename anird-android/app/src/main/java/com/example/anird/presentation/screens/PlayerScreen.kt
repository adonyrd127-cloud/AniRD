package com.example.anird.presentation.screens
import androidx.compose.foundation.lazy.rememberLazyListState

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
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
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

// ─── Premium Color Palette ───────────────────────────────────────────────────
private val BG = Color(0xFF000000)
private val Surface = Color(0xFF12141A)
private val SurfaceVariant = Color(0xFF1A1D26)
private val SurfaceBright = Color(0xFF222633)
private val Primary = Color(0xFFE50914)
private val PrimaryDim = Color(0xFFB00710)
private val Accent = Color(0xFF00D4AA)
private val TextPrimary = Color(0xFFF0F0F5)
private val TextSecondary = Color(0xFF8B8FA3)
private val TextTertiary = Color(0xFF5A5E6E)
private val Border = Color(0xFF1E2230)
private val Glass = Color(0xFF000000).copy(alpha = 0.6f)
private val GlassHeavy = Color(0xFF000000).copy(alpha = 0.85f)

// ─── Main Entry Point ────────────────────────────────────────────────────────

@Composable
fun PlayerScreen(
    malId: Int,
    episode: Int,
    onBackClick: () -> Unit = {},
    viewModel: PlayerViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val uiState by viewModel.uiState.collectAsState()

    // Force landscape on enter, restore portrait on exit
    DisposableEffect(key1 = Unit) {
        val activity = context.findActivity()
        activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
        activity?.window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        onDispose {
            activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    BackHandler {
        onBackClick()
    }

    LaunchedEffect(malId, episode) {
        viewModel.loadEpisodeVideo(malId, episode)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
    ) {
        when (val state = uiState) {
            is PlayerUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = Primary,
                        modifier = Modifier.size(40.dp),
                        strokeWidth = 3.dp
                    )
                }
            }
            is PlayerUiState.Error -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Error,
                            contentDescription = null,
                            tint = PrimaryDim,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Error de reproducción",
                            color = TextPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = state.message,
                            color = TextSecondary,
                            fontSize = 14.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 20.sp
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = { viewModel.loadEpisodeVideo(malId, episode) },
                            colors = ButtonDefaults.buttonColors(containerColor = Primary),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
                        ) {
                            Text(
                                "Reintentar",
                                color = Color.White,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
            is PlayerUiState.Success -> {
                VideoPlayerContainer(
                    state = state,
                    malId = malId,
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

// ─── Video Player Container (ExoPlayer + Controls) ───────────────────────────

@Composable
fun VideoPlayerContainer(
    state: PlayerUiState.Success,
    malId: Int,
    onBackClick: () -> Unit,
    onProgressUpdate: (Long, Long) -> Unit,
    onServerSelected: (StreamServer) -> Unit,
    onLanguageSelected: (String) -> Unit
) {
    val context = LocalContext.current
    val activity = context.findActivity()
    val scope = rememberCoroutineScope()

    // Audio manager for volume control
    val audioManager = remember { context.getSystemService(Context.AUDIO_SERVICE) as AudioManager }
    val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC).toFloat()

    // Gesture state
    var volume by remember { mutableStateOf(audioManager.getStreamVolume(AudioManager.STREAM_MUSIC) / maxVolume) }
    var brightness by remember {
        mutableStateOf(activity?.window?.attributes?.screenBrightness ?: 0.5f)
    }
    var gestureIndicatorType by remember { mutableStateOf<String?>(null) }
    var gestureIndicatorValue by remember { mutableStateOf(0f) }
    var seekGestureDirection by remember { mutableStateOf<Int?>(null) } // -1 = rewind, 1 = forward

    // ExoPlayer initialization
    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            playWhenReady = true
        }
    }

    var isPlaying by remember { mutableStateOf(false) }
    var isBuffering by remember { mutableStateOf(false) }

    // Player lifecycle
    DisposableEffect(key1 = exoPlayer) {
        val listener = object : Player.Listener {
            override fun onIsPlayingChanged(playing: Boolean) {
                isPlaying = playing
            }
            override fun onPlaybackStateChanged(playbackState: Int) {
                isBuffering = playbackState == Player.STATE_BUFFERING
            }
        }
        exoPlayer.addListener(listener)
        onDispose {
            onProgressUpdate(exoPlayer.currentPosition, exoPlayer.duration)
            exoPlayer.removeListener(listener)
            exoPlayer.release()
        }
    }

    // Determine if HTML/iframe or direct video
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

    // Setup media when server changes
    LaunchedEffect(state.currentServer) {
        if (isHtml) {
            exoPlayer.stop()
        } else {
            val videoUri = Uri.parse(state.currentServer.url)
            val mediaItem = MediaItem.fromUri(videoUri)
            exoPlayer.setMediaItem(mediaItem)
            val initialProgress = state.episode.watchedProgressMs ?: 0L
            exoPlayer.prepare()
            if (initialProgress > 0L) {
                exoPlayer.seekTo(initialProgress)
            }
            exoPlayer.play()
        }
    }

    // Auto-save progress every 8 seconds
    LaunchedEffect(key1 = Unit) {
        while (true) {
            delay(8000)
            if (exoPlayer.isPlaying) {
                onProgressUpdate(exoPlayer.currentPosition, exoPlayer.duration)
            }
        }
    }

    // Controls visibility with 3s auto-hide
    var controlsVisible by remember { mutableStateOf(true) }
    var controlsAlpha by remember { mutableFloatStateOf(1f) }

    LaunchedEffect(controlsVisible) {
        if (controlsVisible) {
            controlsAlpha = 1f
            delay(3000)
            controlsVisible = false
        }
    }

    // Animate controls alpha
    val animatedControlsAlpha by animateFloatAsState(
        targetValue = if (controlsVisible) 1f else 0f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "controls_alpha"
    )

    // Episode list panel
    var episodeListVisible by remember { mutableStateOf(false) }

    // Server selection dialog
    var serverSheetVisible by remember { mutableStateOf(false) }

    // Seek bar state
    var currentPosition by remember { mutableFloatStateOf(0f) }
    var totalDuration by remember { mutableFloatStateOf(0f) }
    var isSeeking by remember { mutableStateOf(false) }
    var seekDragValue by remember { mutableFloatStateOf(0f) }
    var showTimeTooltip by remember { mutableStateOf(false) }

    // Track position updates
    DisposableEffect(exoPlayer) {
        val listener = object : Player.Listener {
            override fun onEvents(player: Player, events: Player.Events) {
                if (!isSeeking) {
                    currentPosition = player.currentPosition.toFloat()
                    totalDuration = player.duration.coerceAtLeast(0L).toFloat()
                }
            }
        }
        exoPlayer.addListener(listener)
        onDispose { exoPlayer.removeListener(listener) }
    }

    // Real-time position update coroutine
    LaunchedEffect(isPlaying) {
        while (isPlaying) {
            if (!isSeeking) {
                currentPosition = exoPlayer.currentPosition.toFloat()
                totalDuration = exoPlayer.duration.coerceAtLeast(0L).toFloat()
            }
            delay(250)
        }
    }

    // Double-tap detection state
    var lastTapTime by remember { mutableLongStateOf(0L) }
    var tapSide by remember { mutableStateOf<String?>(null) }
    var showDoubleTapFeedback by remember { mutableStateOf(false) }
    var doubleTapFeedbackIcon by remember { mutableStateOf("") }

    // Gesture modifier for the video area (non-HTML)
    val gestureModifier = if (!isHtml) {
        Modifier
            .pointerInput(Unit) {
                detectTapGestures(
                    onDoubleTap = { offset ->
                        if (offset.x < size.width / 2) {
                            // Double tap left: rewind 10s
                            val target = (exoPlayer.currentPosition - 10000).coerceAtLeast(0)
                            exoPlayer.seekTo(target)
                            doubleTapFeedbackIcon = "rewind"
                            showDoubleTapFeedback = true
                            scope.launch {
                                delay(600)
                                showDoubleTapFeedback = false
                            }
                        } else {
                            // Double tap right: forward 10s
                            val target = (exoPlayer.currentPosition + 10000).coerceAtMost(exoPlayer.duration.coerceAtLeast(0))
                            exoPlayer.seekTo(target)
                            doubleTapFeedbackIcon = "forward"
                            showDoubleTapFeedback = true
                            scope.launch {
                                delay(600)
                                showDoubleTapFeedback = false
                            }
                        }
                    },
                    onTap = {
                        val now = System.currentTimeMillis()
                        if (now - lastTapTime < 300) {
                            // Already handled by double tap
                        } else {
                            controlsVisible = !controlsVisible
                        }
                        lastTapTime = now
                    }
                )
            }
            .pointerInput(Unit) {
                detectDragGestures(
                    onDragStart = { offset ->
                        controlsVisible = false
                        seekGestureDirection = null
                    },
                    onDragEnd = {
                        gestureIndicatorType = null
                        seekGestureDirection = null
                    },
                    onDrag = { change, dragAmount ->
                        change.consume()
                        val width = size.width
                        val height = size.height

                        if (abs(dragAmount.y) > abs(dragAmount.x)) {
                            // Vertical gesture
                            if (change.position.x < width / 2) {
                                // Left half: brightness
                                gestureIndicatorType = "brightness"
                                val delta = -dragAmount.y / height
                                brightness = (brightness + delta).coerceIn(0.01f, 1f)
                                val layoutParams = activity?.window?.attributes
                                layoutParams?.screenBrightness = brightness
                                activity?.window?.attributes = layoutParams
                                gestureIndicatorValue = brightness
                            } else {
                                // Right half: volume
                                gestureIndicatorType = "volume"
                                val delta = -dragAmount.y / height
                                volume = (volume + delta).coerceIn(0f, 1f)
                                val targetVol = (volume * maxVolume).toInt()
                                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, targetVol, 0)
                                gestureIndicatorValue = volume
                            }
                        } else {
                            // Horizontal gesture on right half: seek
                            if (change.position.x >= width / 2) {
                                gestureIndicatorType = "seek"
                                val seekDelta = dragAmount.x / width * 30f // 30 seconds max sweep
                                gestureIndicatorValue = seekDelta
                                if (dragAmount.x > 5) {
                                    seekGestureDirection = 1
                                } else if (dragAmount.x < -5) {
                                    seekGestureDirection = -1
                                }
                            }
                        }
                    }
                )
            }
    } else {
        Modifier
    }

    Box(modifier = Modifier.fillMaxSize()) {
        // ─── Video / WebView Layer ────────────────────────────────────────────
        if (isHtml) {
            AndroidView(
                factory = { ctx ->
                    android.webkit.WebView(ctx).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.mediaPlaybackRequiresUserGesture = false
                        settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                        settings.userAgentString =
                            "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
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

            // WebView always-visible top bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.TopStart)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
                        )
                    )
                    .padding(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = onBackClick,
                            modifier = Modifier
                                .size(40.dp)
                                .background(Glass, CircleShape)
                        ) {
                            Icon(
                                Icons.Default.ArrowBack,
                                contentDescription = "Atrás",
                                tint = Color.White,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "${state.anime?.displayTitle ?: "Anime"} - Episodio ${state.episode.episodeNumber}",
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    ServerSelectorMenu(
                        servers = state.servers,
                        currentServer = state.currentServer,
                        subOrDub = state.subOrDub,
                        onServerSelected = onServerSelected,
                        onLanguageSelected = onLanguageSelected
                    )
                }
            }
        } else {
            // ─── ExoPlayer View ──────────────────────────────────────────────
            AndroidView(
                factory = { ctx ->
                    PlayerView(ctx).apply {
                        player = exoPlayer
                        useController = false
                        resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxSize()
                    .then(gestureModifier)
            )

            // ─── Top Gradient Overlay ────────────────────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp)
                    .align(Alignment.TopCenter)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
                        )
                    )
                    .graphicsLayer { alpha = animatedControlsAlpha }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Back button
                    IconButton(
                        onClick = onBackClick,
                        modifier = Modifier
                            .size(40.dp)
                            .background(Glass, CircleShape)
                    ) {
                        Icon(
                            Icons.Default.ArrowBack,
                            contentDescription = "Atrás",
                            tint = Color.White,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    // Center title
                    Text(
                        text = "${state.anime?.displayTitle ?: "Anime"} - Episodio ${state.episode.episodeNumber}",
                        color = TextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 12.dp)
                    )

                    // Right buttons: server + settings
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        IconButton(
                            onClick = { serverSheetVisible = true },
                            modifier = Modifier
                                .size(40.dp)
                                .background(Glass, CircleShape)
                        ) {
                            Icon(
                                Icons.Default.List,
                                contentDescription = "Servidor",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        IconButton(
                            onClick = { /* Quality settings placeholder */ },
                            modifier = Modifier
                                .size(40.dp)
                                .background(Glass, CircleShape)
                        ) {
                            Icon(
                                Icons.Default.MoreVert,
                                contentDescription = "Calidad",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            // ─── Bottom Gradient Overlay ─────────────────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .align(Alignment.BottomCenter)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.9f))
                        )
                    )
                    .graphicsLayer { alpha = animatedControlsAlpha }
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .align(Alignment.BottomCenter)
                ) {
                    // ─── Seek Bar ────────────────────────────────────────────
                    PremiumSeekBar(
                        currentPosition = currentPosition,
                        totalDuration = totalDuration,
                        isSeeking = isSeeking,
                        bufferedPosition = exoPlayer.bufferedPosition.toFloat(),
                        onSeekStart = { isSeeking = true; showTimeTooltip = true },
                        onSeeking = { fraction ->
                            seekDragValue = fraction
                            showTimeTooltip = true
                        },
                        onSeekEnd = { fraction ->
                            val target = (fraction * totalDuration).toLong().coerceIn(0, totalDuration.toLong())
                            exoPlayer.seekTo(target)
                            isSeeking = false
                            showTimeTooltip = false
                        }
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // ─── Episode Navigation Row ──────────────────────────────
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Previous episode
                        TextButton(
                            onClick = { /* Navigate to previous episode */ },
                            enabled = state.episode.episodeNumber > 1,
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text(
                                "EP ANTERIOR",
                                color = if (state.episode.episodeNumber > 1) TextSecondary else TextTertiary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        // Episode selector
                        TextButton(
                            onClick = { episodeListVisible = true },
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                        ) {
                            Text(
                                "EP ${state.episode.episodeNumber} / ${state.anime?.episodes ?: "?"}",
                                color = TextPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Icon(
                                Icons.Default.KeyboardArrowDown,
                                contentDescription = null,
                                tint = TextPrimary,
                                modifier = Modifier.size(16.dp)
                            )
                        }

                        // Next episode
                        TextButton(
                            onClick = { /* Navigate to next episode */ },
                            enabled = state.episode.episodeNumber < (state.anime?.episodes ?: Int.MAX_VALUE),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text(
                                "EP SIGUIENTE",
                                color = if (state.episode.episodeNumber < (state.anime?.episodes ?: Int.MAX_VALUE)) TextSecondary else TextTertiary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // ─── Center Controls ─────────────────────────────────────────────
            AnimatedVisibility(
                visible = controlsVisible,
                enter = fadeIn(tween(250)) + scaleIn(tween(250, easing = FastOutSlowInEasing), initialScale = 0.8f),
                exit = fadeOut(tween(200)) + scaleOut(tween(200), targetScale = 0.8f),
                modifier = Modifier.align(Alignment.Center)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(48.dp)
                ) {
                    // Rewind 10s
                    PressablePlayerButton(
                        onClick = {
                            val target = (exoPlayer.currentPosition - 10000).coerceAtLeast(0)
                            exoPlayer.seekTo(target)
                        },
                        size = 48.dp,
                        iconSize = 24.dp
                    ) {
                        Icon(
                            imageVector = IconsDefaultFastRewind,
                            contentDescription = "Retroceder 10s",
                            tint = Color.White,
                            modifier = Modifier.size(it)
                        )
                    }

                    // Play/Pause
                    PressablePlayerButton(
                        onClick = {
                            if (exoPlayer.isPlaying) exoPlayer.pause() else exoPlayer.play()
                        },
                        size = 64.dp,
                        iconSize = 32.dp,
                        backgroundColor = Primary
                    ) {
                        Icon(
                            imageVector = if (isPlaying) IconsDefaultPause else Icons.Default.PlayArrow,
                            contentDescription = if (isPlaying) "Pausar" else "Reproducir",
                            tint = Color.White,
                            modifier = Modifier.size(it)
                        )
                    }

                    // Forward 10s
                    PressablePlayerButton(
                        onClick = {
                            val target = (exoPlayer.currentPosition + 10000).coerceAtMost(exoPlayer.duration.coerceAtLeast(0))
                            exoPlayer.seekTo(target)
                        },
                        size = 48.dp,
                        iconSize = 24.dp
                    ) {
                        Icon(
                            imageVector = IconsDefaultFastForward,
                            contentDescription = "Adelantar 10s",
                            tint = Color.White,
                            modifier = Modifier.size(it)
                        )
                    }
                }
            }

            // ─── Gesture Indicator Overlay ───────────────────────────────────
            AnimatedVisibility(
                visible = gestureIndicatorType != null,
                enter = fadeIn() + scaleIn(),
                exit = fadeOut() + scaleOut(),
                modifier = Modifier.align(Alignment.Center)
            ) {
                Box(
                    modifier = Modifier
                        .background(GlassHeavy, RoundedCornerShape(16.dp))
                        .padding(horizontal = 24.dp, vertical = 14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = when (gestureIndicatorType) {
                                "brightness" -> Icons.Default.Star
                                "volume" -> if (gestureIndicatorValue > 0.5f) Icons.Default.Notifications else Icons.Default.Notifications
                                "seek" -> if (seekGestureDirection == 1) IconsDefaultFastForward else IconsDefaultFastRewind
                                else -> Icons.Default.PlayArrow
                            },
                            contentDescription = null,
                            tint = Primary,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = when (gestureIndicatorType) {
                                "brightness", "volume" -> String.format("%d%%", (gestureIndicatorValue * 100).toInt())
                                "seek" -> if (seekGestureDirection == 1) ">>" else "<<"
                                else -> ""
                            },
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            // ─── Double Tap Feedback ─────────────────────────────────────────
            AnimatedVisibility(
                visible = showDoubleTapFeedback,
                enter = fadeIn(tween(150)) + scaleIn(tween(150)),
                exit = fadeOut(tween(300)) + scaleOut(tween(300)),
                modifier = Modifier.align(
                    if (doubleTapFeedbackIcon == "rewind") Alignment.CenterStart else Alignment.CenterEnd
                ).padding(horizontal = 48.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(Glass, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (doubleTapFeedbackIcon == "rewind") IconsDefaultFastRewind else IconsDefaultFastForward,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            // ─── Buffering Indicator ─────────────────────────────────────────
            AnimatedVisibility(
                visible = isBuffering && isPlaying,
                enter = fadeIn(),
                exit = fadeOut(),
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(bottom = 100.dp, end = 20.dp)
            ) {
                CircularProgressIndicator(
                    color = Primary.copy(alpha = 0.7f),
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp
                )
            }
        }

        // ─── Episode List Panel (Slide-up) ──────────────────────────────────
        AnimatedVisibility(
            visible = episodeListVisible,
            enter = slideInVertically(tween(350, easing = FastOutSlowInEasing)) { it },
            exit = slideOutVertically(tween(300, easing = FastOutSlowInEasing)) { it },
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            EpisodeListPanel(
                currentEpisode = state.episode.episodeNumber,
                totalEpisodes = state.anime?.episodes ?: 24,
                onEpisodeSelected = { epNum ->
                    episodeListVisible = false
                    // Episode change would be handled here
                },
                onDismiss = { episodeListVisible = false }
            )
        }

        // ─── Server Selection Bottom Sheet ──────────────────────────────────
        AnimatedVisibility(
            visible = serverSheetVisible,
            enter = slideInVertically(tween(350, easing = FastOutSlowInEasing)) { it },
            exit = slideOutVertically(tween(300, easing = FastOutSlowInEasing)) { it },
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            ServerSelectionSheet(
                servers = state.servers,
                currentServer = state.currentServer,
                subOrDub = state.subOrDub,
                onServerSelected = {
                    onServerSelected(it)
                    serverSheetVisible = false
                },
                onLanguageSelected = {
                    onLanguageSelected(it)
                    serverSheetVisible = false
                },
                onDismiss = { serverSheetVisible = false }
            )
        }
    }
}

// ─── Pressable Player Button with Scale Animation ────────────────────────────

@Composable
private fun PressablePlayerButton(
    onClick: () -> Unit,
    size: androidx.compose.ui.unit.Dp,
    iconSize: androidx.compose.ui.unit.Dp,
    backgroundColor: Color = Glass,
    content: @Composable (iconSizeDp: androidx.compose.ui.unit.Dp) -> Unit
) {
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (pressed) 0.9f else 1f,
        animationSpec = tween(120),
        label = "btn_scale"
    )

    Box(
        modifier = Modifier
            .size(size)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .shadow(
                elevation = if (backgroundColor == Primary) 12.dp else 0.dp,
                shape = CircleShape,
                ambientColor = if (backgroundColor == Primary) PrimaryDim else Color.Transparent,
                spotColor = if (backgroundColor == Primary) PrimaryDim else Color.Transparent
            )
            .background(backgroundColor, CircleShape)
            .clip(CircleShape)
            .pointerInput(Unit) {
                awaitPointerEventScope {
                    while (true) {
                        val event = awaitPointerEvent()
                        when (event.type) {
                            androidx.compose.ui.input.pointer.PointerEventType.Press -> pressed = true
                            androidx.compose.ui.input.pointer.PointerEventType.Release -> {
                                pressed = false
                                onClick()
                            }
                        }
                    }
                }
            },
        contentAlignment = Alignment.Center
    ) {
        content(iconSize)
    }
}

// ─── Premium Seek Bar ────────────────────────────────────────────────────────

@Composable
private fun PremiumSeekBar(
    currentPosition: Float,
    totalDuration: Float,
    bufferedPosition: Float,
    isSeeking: Boolean,
    onSeekStart: () -> Unit,
    onSeeking: (Float) -> Unit,
    onSeekEnd: (Float) -> Unit
) {
    val progress = if (totalDuration > 0f) currentPosition / totalDuration else 0f
    val bufferedProgress = if (totalDuration > 0f) bufferedPosition / totalDuration else 0f

    var dragFraction by remember { mutableFloatStateOf(0f) }
    var isDragging by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        // Time labels row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = formatTime(
                    if (isDragging) (dragFraction * totalDuration).toLong() else currentPosition.toLong()
                ),
                color = TextSecondary,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace
            )
            // Time tooltip (visible while dragging)
            if (isDragging) {
                Box(
                    modifier = Modifier
                        .background(GlassHeavy, RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = formatTime((dragFraction * totalDuration).toLong()),
                        color = TextPrimary,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            Text(
                text = formatTime(totalDuration.toLong()),
                color = TextSecondary,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace
            )
        }

        // Custom seek bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(20.dp)
                .clip(RoundedCornerShape(4.dp))
                .pointerInput(Unit) {
                    awaitPointerEventScope {
                        while (true) {
                            val event = awaitPointerEvent()
                            val change = event.changes.firstOrNull() ?: continue
                            val x = change.position.x.coerceIn(0f, size.width.toFloat())
                            val fraction = x / size.width.toFloat()

                            when (event.type) {
                                androidx.compose.ui.input.pointer.PointerEventType.Press -> {
                                    isDragging = true
                                    dragFraction = fraction
                                    onSeekStart()
                                    change.consume()
                                }
                                androidx.compose.ui.input.pointer.PointerEventType.Move -> {
                                    if (isDragging) {
                                        dragFraction = fraction
                                        onSeeking(fraction)
                                        change.consume()
                                    }
                                }
                                androidx.compose.ui.input.pointer.PointerEventType.Release -> {
                                    if (isDragging) {
                                        onSeekEnd(dragFraction)
                                        isDragging = false
                                        change.consume()
                                    }
                                }
                            }
                        }
                    }
                }
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.Center)
            ) {
                val trackHeight = 3.dp.toPx()
                val yCenter = size.height / 2 - trackHeight / 2

                // Background track
                drawRoundRect(
                    color = TextTertiary.copy(alpha = 0.3f),
                    size = Size(size.width, trackHeight),
                    topLeft = Offset(0f, yCenter),
                    cornerRadius = CornerRadius(trackHeight / 2)
                )

                // Buffered / progress track
                val progressFraction = if (isDragging) dragFraction else progress
                val progressWidth = (size.width * progressFraction).coerceAtLeast(0f)
                if (progressWidth > 0f) {
                    drawRoundRect(
                        color = Primary,
                        size = Size(progressWidth, trackHeight),
                        topLeft = Offset(0f, yCenter),
                        cornerRadius = CornerRadius(trackHeight / 2)
                    )
                }

                // Thumb
                val thumbRadius = 7.dp.toPx()
                val thumbX = (size.width * progressFraction).coerceIn(thumbRadius, size.width - thumbRadius)
                val thumbY = size.height / 2

                // White border
                drawCircle(
                    color = Color.White,
                    radius = thumbRadius + 2.dp.toPx(),
                    center = Offset(thumbX, thumbY)
                )
                // Primary fill
                drawCircle(
                    color = Primary,
                    radius = thumbRadius,
                    center = Offset(thumbX, thumbY)
                )
            }
        }
    }
}

// ─── Episode List Panel ──────────────────────────────────────────────────────

@Composable
private fun EpisodeListPanel(
    currentEpisode: Int,
    totalEpisodes: Int,
    onEpisodeSelected: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    val listState = rememberLazyListState()

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.65f)
            .background(GlassHeavy, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Drag handle
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp, bottom = 4.dp),
                contentAlignment = Alignment.TopCenter
            ) {
                Box(
                    modifier = Modifier
                        .width(24.dp)
                        .height(4.dp)
                        .background(SurfaceBright, RoundedCornerShape(2.dp))
                )
            }

            // Title
            Text(
                text = "Lista de Episodios",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)
            )

            HorizontalDivider(color = Border, thickness = 1.dp)

            // Episodes list
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items((1..totalEpisodes).toList()) { epNum ->
                    val isCurrent = epNum == currentEpisode

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (isCurrent) Primary.copy(alpha = 0.1f) else Color.Transparent
                            )
                            .drawBehind {
                                if (isCurrent) {
                                    drawRoundRect(
                                        color = Primary,
                                        size = Size(3.dp.toPx(), size.height),
                                        topLeft = Offset(0f, 0f),
                                        cornerRadius = CornerRadius(1.5f)
                                    )
                                }
                            }
                            .clickable { onEpisodeSelected(epNum) }
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Play icon for current episode
                        if (isCurrent) {
                            Icon(
                                Icons.Default.PlayArrow,
                                contentDescription = null,
                                tint = Primary,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                        } else {
                            Spacer(modifier = Modifier.width(30.dp))
                        }

                        Text(
                            text = "Episodio $epNum",
                            color = if (isCurrent) Primary else TextSecondary,
                            fontSize = 14.sp,
                            fontWeight = if (isCurrent) FontWeight.SemiBold else FontWeight.Normal
                        )
                    }
                }
            }
        }
    }
}

// ─── Server Selection Sheet ──────────────────────────────────────────────────

@Composable
private fun ServerSelectionSheet(
    servers: List<StreamServer>,
    currentServer: StreamServer,
    subOrDub: String,
    onServerSelected: (StreamServer) -> Unit,
    onLanguageSelected: (String) -> Unit,
    onDismiss: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(GlassHeavy, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp)
        ) {
            // Drag handle
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 4.dp),
                contentAlignment = Alignment.TopCenter
            ) {
                Box(
                    modifier = Modifier
                        .width(24.dp)
                        .height(4.dp)
                        .background(SurfaceBright, RoundedCornerShape(2.dp))
                )
            }

            // Language selection
            Text(
                text = "Idioma",
                color = TextTertiary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, top = 12.dp, bottom = 8.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Sub
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (subOrDub == "sub") Primary.copy(alpha = 0.15f) else SurfaceVariant
                        )
                        .drawBehind {
                            if (subOrDub == "sub") {
                                drawRoundRect(
                                    color = Primary,
                                    size = Size(3.dp.toPx(), size.height),
                                    topLeft = Offset(0f, 0f),
                                    cornerRadius = CornerRadius(1.5f)
                                )
                            }
                        }
                        .clickable { onLanguageSelected("sub") }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(
                        "SUB",
                        color = if (subOrDub == "sub") Primary else TextSecondary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                // Dub
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (subOrDub == "dub") Primary.copy(alpha = 0.15f) else SurfaceVariant
                        )
                        .drawBehind {
                            if (subOrDub == "dub") {
                                drawRoundRect(
                                    color = Primary,
                                    size = Size(3.dp.toPx(), size.height),
                                    topLeft = Offset(0f, 0f),
                                    cornerRadius = CornerRadius(1.5f)
                                )
                            }
                        }
                        .clickable { onLanguageSelected("dub") }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(
                        "LAT",
                        color = if (subOrDub == "dub") Primary else TextSecondary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            HorizontalDivider(
                color = Border,
                thickness = 1.dp,
                modifier = Modifier.padding(vertical = 12.dp, horizontal = 20.dp)
            )

            // Server section title
            Text(
                text = "Servidor",
                color = TextTertiary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 8.dp)
            )

            // Servers list
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                servers.forEach { server ->
                    val isSelected = server.server == currentServer.server
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(
                                if (isSelected) Primary.copy(alpha = 0.08f) else Color.Transparent
                            )
                            .drawBehind {
                                if (isSelected) {
                                    drawRoundRect(
                                        color = Primary,
                                        size = Size(3.dp.toPx(), size.height),
                                        topLeft = Offset(0f, 0f),
                                        cornerRadius = CornerRadius(1.5f)
                                    )
                                }
                            }
                            .clickable { onServerSelected(server) }
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.List,
                                contentDescription = null,
                                tint = if (isSelected) Primary else TextTertiary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = server.displayName,
                                color = if (isSelected) Primary else TextSecondary,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                        // Language badge
                        Box(
                            modifier = Modifier
                                .background(SurfaceVariant, RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = subOrDub.uppercase(),
                                color = TextTertiary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

// ─── Server Selector Menu (compact dropdown for WebView mode) ────────────────

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
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(20.dp))
                .background(Glass)
                .clickable { expanded = true }
                .padding(horizontal = 14.dp, vertical = 6.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.List,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "${currentServer.displayName} (${subOrDub.uppercase()})",
                    fontSize = 11.sp,
                    color = TextPrimary,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = TextSecondary,
                    modifier = Modifier.size(14.dp)
                )
            }
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.background(SurfaceVariant)
        ) {
            // Language section
            Text(
                text = "IDIOMA",
                color = TextTertiary,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
            DropdownMenuItem(
                text = { Text("Subtitulado", color = if (subOrDub == "sub") Primary else TextPrimary) },
                onClick = {
                    onLanguageSelected("sub")
                    expanded = false
                }
            )
            DropdownMenuItem(
                text = { Text("Doblaje Latino", color = if (subOrDub == "dub") Primary else TextPrimary) },
                onClick = {
                    onLanguageSelected("dub")
                    expanded = false
                }
            )

            HorizontalDivider(color = Border, thickness = 1.dp)

            // Server section
            Text(
                text = "SERVIDOR",
                color = TextTertiary,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
            servers.forEach { server ->
                DropdownMenuItem(
                    text = {
                        Text(
                            server.displayName,
                            color = if (server.server == currentServer.server) Primary else TextPrimary
                        )
                    },
                    onClick = {
                        onServerSelected(server)
                        expanded = false
                    }
                )
            }
        }
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

private fun Context.findActivity(): Activity? {
    var context = this
    while (context is ContextWrapper) {
        if (context is Activity) return context
        context = context.baseContext
    }
    return null
}
