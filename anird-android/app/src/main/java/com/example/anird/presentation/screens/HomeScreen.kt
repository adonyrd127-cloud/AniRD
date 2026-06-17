package com.example.anird.presentation.screens
import androidx.compose.ui.draw.shadow

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.data.local.HistoryEntity
import com.example.anird.data.model.Anime
import com.example.anird.presentation.viewmodels.HomeUiState
import com.example.anird.presentation.viewmodels.HomeViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// ─── Premium Color Palette ───────────────────────────────────────────────────
private val BG = Color(0xFF0A0B0E)
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

// ─── NotifItem Data Class ────────────────────────────────────────────────────
data class NotifItem(
    val animeId: Int,
    val title: String,
    val episode: Int,
    val timestamp: Long
)

// ─── Main HomeScreen ─────────────────────────────────────────────────────────
@OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToDetail: (Int) -> Unit = {},
    onNavigateToSearch: () -> Unit = {},
    onNavigateToProfile: () -> Unit = {},
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val refreshing by viewModel.refreshing.collectAsState()
    val lazyListState = rememberLazyListState()

    val context = androidx.compose.ui.platform.LocalContext.current
    val prefs = remember { context.getSharedPreferences("anird_prefs", android.content.Context.MODE_PRIVATE) }
    var showNotifSheet by remember { mutableStateOf(false) }
    var notifHistory by remember {
        mutableStateOf(
            run {
                val historySet = prefs.getStringSet("notification_history_set", emptySet()) ?: emptySet()
                historySet.mapNotNull { item ->
                    val parts = item.split("|")
                    if (parts.size >= 4) {
                        NotifItem(
                            animeId = parts[0].toIntOrNull() ?: 0,
                            title = parts[1],
                            episode = parts[2].toIntOrNull() ?: 0,
                            timestamp = parts[3].toLongOrNull() ?: 0L
                        )
                    } else null
                }.sortedByDescending { it.timestamp }
            }
        )
    }

    val lastReadNotifTime = remember { mutableStateOf(prefs.getLong("last_read_notif_time", 0L)) }
    var hasUnreadNotifs by remember {
        mutableStateOf(
            notifHistory.any { it.timestamp > lastReadNotifTime.value }
        )
    }

    val reloadHistory = {
        val historySet = prefs.getStringSet("notification_history_set", emptySet()) ?: emptySet()
        notifHistory = historySet.mapNotNull { item ->
            val parts = item.split("|")
            if (parts.size >= 4) {
                NotifItem(
                    animeId = parts[0].toIntOrNull() ?: 0,
                    title = parts[1],
                    episode = parts[2].toIntOrNull() ?: 0,
                    timestamp = parts[3].toLongOrNull() ?: 0L
                )
            } else null
        }.sortedByDescending { it.timestamp }
        hasUnreadNotifs = notifHistory.any { it.timestamp > lastReadNotifTime.value }
    }

    LaunchedEffect(showNotifSheet) {
        if (showNotifSheet) {
            reloadHistory()
            val now = System.currentTimeMillis()
            prefs.edit().putLong("last_read_notif_time", now).apply()
            lastReadNotifTime.value = now
            hasUnreadNotifs = false
        }
    }

    var selectedCategory by remember { mutableStateOf("Todo") }
    val categories = listOf("Todo", "Acción", "Fantasía", "Comedia", "Drama", "Romance", "Sci-Fi", "Deportes")

    // ── TopBar scroll-based visibility ──
    val isScrolled by remember {
        derivedStateOf {
            lazyListState.firstVisibleItemIndex > 0 || lazyListState.firstVisibleItemScrollOffset > 60
        }
    }
    val topBarAlpha by animateFloatAsState(
        targetValue = if (isScrolled) 1f else 0f,
        animationSpec = tween(300, easing = FastOutSlowInEasing),
        label = "topBarAlpha"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
    ) {
        // ── Main Content ──
        Box(modifier = Modifier.fillMaxSize()) {
            when (val state = uiState) {
                is HomeUiState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = Primary, strokeWidth = 3.dp)
                    }
                }
                is HomeUiState.Error -> {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            modifier = Modifier.statusBarsPadding().padding(top = 56.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Error al cargar la pantalla de inicio",
                                color = TextPrimary,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = { viewModel.loadHomeFeed() },
                                colors = ButtonDefaults.buttonColors(containerColor = Primary)
                            ) {
                                Text("Reintentar", color = Color.White)
                            }
                        }
                    }
                }
                is HomeUiState.Success -> {
                    val genreMap = mapOf(
                        "Acción" to "Action",
                        "Fantasía" to "Fantasy",
                        "Comedia" to "Comedy",
                        "Drama" to "Drama",
                        "Romance" to "Romance",
                        "Sci-Fi" to "Sci-Fi",
                        "Deportes" to "Sports"
                    )
                    val englishCategory = genreMap[selectedCategory] ?: selectedCategory
                    val filterAnime = { list: List<Anime> ->
                        if (selectedCategory == "Todo") list
                        else list.filter { anime -> anime.genreNames.any { it.contains(englishCategory, ignoreCase = true) } }
                    }
                    val filteredSimulcasts = filterAnime(state.simulcasts)
                    val filteredLatest = filterAnime(state.latestEpisodes)
                    val filteredMovies = filterAnime(state.movies)
                    val filteredTopTen = filterAnime(state.topTen)

                    Box(modifier = Modifier.fillMaxSize()) {
                        LazyColumn(
                            state = lazyListState,
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(bottom = 32.dp)
                        ) {
                            // 1. Hero Carousel
                            if (state.heroCarousel.isNotEmpty()) {
                                item {
                                    HeroCarousel(
                                        animeList = state.heroCarousel,
                                        onAnimeClick = onNavigateToDetail
                                    )
                                }
                            }

                            // 2. Category Filter Pills
                            item {
                                LazyRow(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 12.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(categories) { category ->
                                        val isSelected = selectedCategory == category
                                        Box(
                                            modifier = Modifier
                                                .height(36.dp)
                                                .clip(RoundedCornerShape(18.dp))
                                                .then(
                                                    if (isSelected) Modifier.background(Primary)
                                                    else Modifier
                                                        .background(SurfaceVariant)
                                                        .border(
                                                            width = 1.dp,
                                                            color = Border,
                                                            shape = RoundedCornerShape(18.dp)
                                                        )
                                                )
                                                .clickable { selectedCategory = category }
                                                .padding(horizontal = 16.dp),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = category,
                                                color = if (isSelected) Color.White else TextSecondary,
                                                fontSize = 13.sp,
                                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                            )
                                        }
                                    }
                                }
                            }

                            // 3. Continue Watching
                            if (state.continueWatching.isNotEmpty()) {
                                item {
                                    ContinueWatchingSection(
                                        list = state.continueWatching,
                                        onAnimeClick = onNavigateToDetail,
                                        onViewAllClick = onNavigateToSearch
                                    )
                                }
                            }

                            // 4. Simulcast
                            if (filteredSimulcasts.isNotEmpty()) {
                                item {
                                    AnimeRowSection(
                                        title = "Simulcast de esta Temporada",
                                        animeList = filteredSimulcasts,
                                        onAnimeClick = onNavigateToDetail,
                                        onViewAllClick = onNavigateToSearch
                                    )
                                }
                            }

                            // 5. Top 10 Popular
                            if (filteredTopTen.isNotEmpty()) {
                                item {
                                    TopTenSection(
                                        animeList = filteredTopTen,
                                        onAnimeClick = onNavigateToDetail,
                                        onViewAllClick = onNavigateToSearch
                                    )
                                }
                            }

                            // 6. Últimos Lanzamientos
                            if (filteredLatest.isNotEmpty()) {
                                item {
                                    AnimeRowSection(
                                        title = "Últimos Lanzamientos",
                                        animeList = filteredLatest,
                                        onAnimeClick = onNavigateToDetail,
                                        onViewAllClick = onNavigateToSearch
                                    )
                                }
                            }

                            // 7. Películas Populares
                            if (filteredMovies.isNotEmpty()) {
                                item {
                                    AnimeRowSection(
                                        title = "Películas Populares",
                                        animeList = filteredMovies,
                                        onAnimeClick = onNavigateToDetail,
                                        onViewAllClick = onNavigateToSearch
                                    )
                                }
                            }
                        }

                        // FAB Refresh
                        FloatingActionButton(
                            onClick = { viewModel.loadHomeFeed() },
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .padding(16.dp)
                                .size(48.dp)
                                .shadow(
                                    elevation = 4.dp,
                                    shape = CircleShape,
                                    ambientColor = Color.Black.copy(alpha = 0.3f),
                                    spotColor = Color.Black.copy(alpha = 0.3f)
                                ),
                            containerColor = SurfaceBright,
                            contentColor = Primary,
                            shape = CircleShape
                        ) {
                            if (refreshing) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    color = Primary,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(
                                    Icons.Default.Refresh,
                                    contentDescription = "Actualizar",
                                    tint = Primary,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // ── Floating Glass TopBar ──
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .alpha(topBarAlpha)
                .background(Surface.copy(alpha = 0.85f))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp)
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "AniRD",
                    color = Primary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateToSearch, modifier = Modifier.size(40.dp)) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    IconButton(onClick = { showNotifSheet = true }, modifier = Modifier.size(40.dp)) {
                        BadgedBox(
                            badge = {
                                if (hasUnreadNotifs) {
                                    Badge(
                                        containerColor = Primary,
                                        modifier = Modifier.offset(x = (-4).dp, y = 4.dp)
                                    )
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Notifications,
                                contentDescription = "Notificaciones",
                                tint = Color.White,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                    IconButton(onClick = onNavigateToProfile, modifier = Modifier.size(40.dp)) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Profile",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }
        }
    }

    // ── Notification Bottom Sheet ──
    if (showNotifSheet) {
        ModalBottomSheet(
            onDismissRequest = { showNotifSheet = false },
            containerColor = Surface,
            contentColor = Color.White,
            shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
            dragHandle = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp, bottom = 4.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .width(24.dp)
                            .height(4.dp)
                            .background(SurfaceBright, RoundedCornerShape(2.dp))
                    )
                }
            }
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Notificaciones",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    if (notifHistory.isNotEmpty()) {
                        IconButton(
                            onClick = {
                                prefs.edit().putStringSet("notification_history_set", emptySet()).apply()
                                notifHistory = emptyList()
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Limpiar todas",
                                tint = Primary
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (notifHistory.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(150.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Default.Notifications,
                                contentDescription = null,
                                tint = TextTertiary,
                                modifier = Modifier.size(40.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "No tienes notificaciones de nuevos capítulos",
                                color = TextTertiary,
                                fontSize = 14.sp
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp)
                    ) {
                        items(notifHistory) { item ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(SurfaceVariant, RoundedCornerShape(12.dp))
                                    .clickable {
                                        showNotifSheet = false
                                        onNavigateToDetail(item.animeId)
                                    }
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(Primary.copy(alpha = 0.15f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Notifications,
                                        contentDescription = null,
                                        tint = Primary,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(14.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "¡Episodio ${item.episode} ya disponible! 🎉",
                                        color = TextPrimary,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "El nuevo capítulo de '${item.title}' ya se encuentra en emisión.",
                                        color = TextSecondary,
                                        fontSize = 12.sp,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    val minutesAgo = (System.currentTimeMillis() - item.timestamp) / 60000
                                    val timeText = if (minutesAgo < 1) {
                                        "Ahora mismo"
                                    } else if (minutesAgo < 60) {
                                        "Hace $minutesAgo min"
                                    } else {
                                        val hoursAgo = minutesAgo / 60
                                        if (hoursAgo < 24) "Hace $hoursAgo h" else "Hace ${hoursAgo / 24} d"
                                    }
                                    Text(
                                        text = timeText,
                                        color = TextTertiary,
                                        fontSize = 10.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ─── Hero Carousel ───────────────────────────────────────────────────────────
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun HeroCarousel(
    animeList: List<Anime>,
    onAnimeClick: (Int) -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { animeList.size })
    val coroutineScope = rememberCoroutineScope()

    // Auto-scroll every 6 seconds
    LaunchedEffect(key1 = pagerState) {
        while (true) {
            delay(6000)
            val nextPage = (pagerState.currentPage + 1) % animeList.size
            coroutineScope.launch {
                pagerState.animateScrollToPage(nextPage, animationSpec = tween(600, easing = FastOutSlowInEasing))
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(320.dp)
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->
            val anime = animeList[page]
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clickable { onAnimeClick(anime.malId) }
            ) {
                // Full-bleed banner image
                AsyncImage(
                    model = anime.bannerUrl ?: anime.imageUrl,
                    contentDescription = anime.displayTitle,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Multi-layer gradient: transparent top → 40% black middle → 95% black bottom
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    Color.Transparent,
                                    Color.Black.copy(alpha = 0.4f),
                                    Color.Black.copy(alpha = 0.95f)
                                )
                            )
                        )
                )

                // Bottom-left content area
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(start = 16.dp, bottom = 40.dp, end = 80.dp)
                ) {
                    // Genre pill
                    val firstGenre = anime.genreNames.firstOrNull()
                    if (firstGenre != null) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(Primary.copy(alpha = 0.2f))
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Text(
                                text = firstGenre.uppercase(),
                                color = Primary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }

                    // Title with text shadow
                    Text(
                        text = anime.displayTitle,
                        color = Color.White,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        style = TextStyle(
                            shadow = Shadow(
                                color = Color.Black,
                                offset = Offset(0f, 2f),
                                blurRadius = 6f
                            )
                        )
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Synopsis line
                    anime.synopsis?.let { syn ->
                        Text(
                            text = syn,
                            color = TextSecondary,
                            fontSize = 13.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            lineHeight = 18.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Play button pill
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(Primary)
                            .clickable { onAnimeClick(anime.malId) }
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            Icons.Default.PlayArrow,
                            contentDescription = "Reproducir",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "Reproducir",
                            color = Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Dots indicator - bottom right
        Row(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 16.dp, bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            animeList.forEachIndexed { index, _ ->
                val isActive = pagerState.currentPage == index
                val width by animateDpAsState(
                    targetValue = if (isActive) 20.dp else 6.dp,
                    animationSpec = tween(300, easing = FastOutSlowInEasing),
                    label = "dotWidth"
                )
                Box(
                    modifier = Modifier
                        .width(width)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(
                            if (isActive) Primary
                            else Color.White.copy(alpha = 0.3f)
                        )
                )
            }
        }
    }
}

// ─── Section Header ──────────────────────────────────────────────────────────
@Composable
fun SectionHeader(
    title: String,
    onViewAllClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            color = TextPrimary,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "VER TODO →",
            color = Primary,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.clickable { onViewAllClick() }
        )
    }
}

// ─── Continue Watching Section ───────────────────────────────────────────────
@Composable
fun ContinueWatchingSection(
    list: List<HistoryEntity>,
    onAnimeClick: (Int) -> Unit,
    onViewAllClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        SectionHeader(title = "Continuar Viendo", onViewAllClick = onViewAllClick)
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(list) { history ->
                val progressFraction = if (history.duration > 0) {
                    (history.progress.toFloat() / history.duration.toFloat()).coerceIn(0f, 1f)
                } else 0f

                Column(
                    modifier = Modifier
                        .width(130.dp)
                        .clickable { onAnimeClick(history.animeId) }
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(195.dp)
                            .clip(RoundedCornerShape(12.dp))
                    ) {
                        AsyncImage(
                            model = history.cover,
                            contentDescription = history.title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )

                        // Play button overlay - glass circle
                        Box(
                            modifier = Modifier
                                .align(Alignment.Center)
                                .size(36.dp)
                                .background(Color.Black.copy(alpha = 0.6f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.PlayArrow,
                                contentDescription = "Reproducir",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        // Progress bar at bottom with rounded ends
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .fillMaxWidth()
                                .height(3.dp)
                                .clip(RoundedCornerShape(bottomStart = 12.dp, bottomEnd = 12.dp))
                                .background(Color.White.copy(alpha = 0.15f))
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxHeight()
                                    .fillMaxWidth(fraction = progressFraction)
                                    .clip(RoundedCornerShape(2.dp))
                                    .background(Primary)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = history.title ?: "Anime",
                        color = TextSecondary,
                        fontSize = 12.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        lineHeight = 16.sp
                    )
                    Text(
                        text = "Ep. ${history.episodeNumber}",
                        color = TextTertiary,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}

// ─── Anime Row Section ───────────────────────────────────────────────────────
@Composable
fun AnimeRowSection(
    title: String,
    animeList: List<Anime>,
    onAnimeClick: (Int) -> Unit,
    onViewAllClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        SectionHeader(title = title, onViewAllClick = onViewAllClick)
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(animeList) { anime ->
                val interactionSource = remember { MutableInteractionSource() }
                val isPressed by interactionSource.collectIsPressedAsState()
                val scale by animateFloatAsState(
                    targetValue = if (isPressed) 0.97f else 1f,
                    animationSpec = tween(150),
                    label = "cardScale"
                )

                Column(
                    modifier = Modifier
                        .width(115.dp)
                        .scale(scale)
                        .clickable(
                            interactionSource = interactionSource,
                            indication = null
                        ) { onAnimeClick(anime.malId) }
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(170.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceVariant)
                    ) {
                        AsyncImage(
                            model = anime.imageUrl,
                            contentDescription = anime.displayTitle,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )

                        // Score badge top-right
                        anime.score?.let { score ->
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .padding(6.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color.Black.copy(alpha = 0.7f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "★ ${"%.1f".format(score)}",
                                    color = Accent,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = anime.displayTitle,
                        color = TextSecondary,
                        fontSize = 12.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}

// ─── Top 10 Section ──────────────────────────────────────────────────────────
@Composable
fun TopTenSection(
    animeList: List<Anime>,
    onAnimeClick: (Int) -> Unit,
    onViewAllClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        SectionHeader(title = "Top 10 Popular", onViewAllClick = onViewAllClick)
        LazyRow(
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(animeList.take(10).size) { index ->
                val anime = animeList[index]
                Box(
                    modifier = Modifier
                        .width(140.dp)
                        .clickable { onAnimeClick(anime.malId) }
                ) {
                    // Number with red gradient glow behind it
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = (-16).dp, y = 0.dp)
                            .drawBehind {
                                drawRoundRect(
                                    brush = Brush.verticalGradient(
                                        colors = listOf(
                                            Primary.copy(alpha = 0.6f),
                                            PrimaryDim.copy(alpha = 0.25f)
                                        )
                                    ),
                                    cornerRadius = CornerRadius(8f),
                                    size = Size(size.width * 1.3f, size.height * 1.1f)
                                )
                            }
                    ) {
                        Text(
                            text = (index + 1).toString(),
                            color = Color.White,
                            fontSize = 52.sp,
                            fontWeight = FontWeight.Black,
                            style = TextStyle(
                                shadow = Shadow(
                                    color = Color.Black,
                                    offset = Offset(2f, 2f),
                                    blurRadius = 8f
                                )
                            )
                        )
                    }

                    // Poster offset to the right
                    AsyncImage(
                        model = anime.imageUrl,
                        contentDescription = anime.displayTitle,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .width(120.dp)
                            .height(175.dp)
                            .clip(RoundedCornerShape(12.dp))
                    )
                }
            }
        }
    }
}
