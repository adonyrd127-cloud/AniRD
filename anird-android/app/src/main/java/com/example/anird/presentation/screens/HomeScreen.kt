package com.example.anird.presentation.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
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

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF141519)) // Background AniRD
    ) {
        // Contenido Principal
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            when (val state = uiState) {
                is HomeUiState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                    }
                }
                is HomeUiState.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize().padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            modifier = Modifier.statusBarsPadding().padding(top = 56.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Error al cargar la pantalla de inicio",
                                color = Color.White,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = { viewModel.loadHomeFeed() },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                            ) {
                                Text("Reintentar", color = MaterialTheme.colorScheme.onPrimary)
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
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(bottom = 24.dp)
                        ) {
                            // 1. Carrusel de Héroes (16:9, height 260.dp, auto-scroll 5s)
                            if (state.heroCarousel.isNotEmpty()) {
                                item {
                                    HeroCarousel(
                                        animeList = state.heroCarousel,
                                        onAnimeClick = onNavigateToDetail
                                    )
                                }
                            }

                            // 2. CategoryChips (seleccionado=naranja+texto negro, no sel=outline+texto gris)
                            item {
                                LazyRow(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 12.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(categories) { category ->
                                        val isSelected = selectedCategory == category
                                        FilterChip(
                                            selected = isSelected,
                                            onClick = { selectedCategory = category },
                                            label = { Text(category) },
                                            colors = FilterChipDefaults.filterChipColors(
                                                containerColor = Color.Transparent,
                                                labelColor = Color(0xFFA0A3A7),
                                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                                selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                                            ),
                                            border = FilterChipDefaults.filterChipBorder(
                                                enabled = true,
                                                selected = isSelected,
                                                borderColor = if (isSelected) Color.Transparent else Color(0xFF3A3F47),
                                                selectedBorderColor = Color.Transparent
                                            )
                                        )
                                    }
                                }
                            }

                            // 3. Continuar Viendo
                            if (state.continueWatching.isNotEmpty()) {
                                item {
                                    ContinueWatchingSection(
                                        list = state.continueWatching,
                                        onAnimeClick = onNavigateToDetail,
                                        onViewAllClick = onNavigateToSearch
                                    )
                                }
                            }

                            // 4. Simulcast (Emisión de esta Temporada)
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

                            // 5. Top 10 Popular (con números gigantes 40.sp superpuestos)
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

                        // Botón flotante para recarga manual (sutil y premium)
                        FloatingActionButton(
                            onClick = { viewModel.loadHomeFeed() },
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .padding(16.dp)
                                .size(50.dp),
                            shape = CircleShape
                        ) {
                            if (refreshing) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(24.dp),
                                    color = MaterialTheme.colorScheme.onPrimary,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(Icons.Default.Refresh, contentDescription = "Actualizar")
                            }
                        }
                    }
                }
            }
        }

        // Floating TopBar overlay with a premium dark gradient fade
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF141519).copy(alpha = 0.9f),
                            Color(0xFF141519).copy(alpha = 0.5f),
                            Color.Transparent
                        )
                    )
                )
                .statusBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Logo izquierdo
                Text(
                    text = "AniRD",
                    color = MaterialTheme.colorScheme.primary, // Red AniRD
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black
                )
                // Iconos Search, Notifications y Profile derecha
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateToSearch, modifier = Modifier.size(32.dp)) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = Color.White,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    IconButton(onClick = { showNotifSheet = true }, modifier = Modifier.size(32.dp)) {
                        BadgedBox(
                            badge = {
                                if (hasUnreadNotifs) {
                                    Badge(
                                        containerColor = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.offset(x = (-4).dp, y = 4.dp)
                                    )
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Notifications,
                                contentDescription = "Notificaciones",
                                tint = Color.White,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                    IconButton(onClick = onNavigateToProfile, modifier = Modifier.size(32.dp)) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Profile",
                            tint = Color.White,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }
        }
    }

    if (showNotifSheet) {
        ModalBottomSheet(
            onDismissRequest = { showNotifSheet = false },
            containerColor = Color(0xFF1E2127),
            contentColor = Color.White,
            shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
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
                        text = "Notificaciones Recientes",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
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
                                tint = MaterialTheme.colorScheme.primary
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
                        Text(
                            text = "No tienes notificaciones de nuevos capítulos",
                            color = Color(0xFFA0A3A7),
                            fontSize = 14.sp
                        )
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp)
                    ) {
                        items(notifHistory) { item ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFF2C2F35).copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                                    .clickable {
                                        showNotifSheet = false
                                        onNavigateToDetail(item.animeId)
                                    }
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .background(MaterialTheme.colorScheme.primaryContainer, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Notifications,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                
                                Spacer(modifier = Modifier.width(16.dp))
                                
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "¡Episodio ${item.episode} ya disponible! 🎉",
                                        color = Color.White,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "El nuevo capítulo de '${item.title}' ya se encuentra en emisión.",
                                        color = Color(0xFFA0A3A7),
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
                                        color = Color(0xFF6B6F78),
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

data class NotifItem(
    val animeId: Int,
    val title: String,
    val episode: Int,
    val timestamp: Long
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun HeroCarousel(
    animeList: List<Anime>,
    onAnimeClick: (Int) -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { animeList.size })
    val coroutineScope = rememberCoroutineScope()

    // Auto-scroll cada 5 segundos
    LaunchedEffect(key1 = pagerState) {
        while (true) {
            delay(5000)
            val nextPage = (pagerState.currentPage + 1) % animeList.size
            coroutineScope.launch {
                pagerState.animateScrollToPage(nextPage)
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(260.dp)
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
                // Banner background
                AsyncImage(
                    model = anime.imageUrl,
                    contentDescription = anime.displayTitle,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Overlay degradado inferior negro 80%
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    Color.Transparent,
                                    Color.Black.copy(alpha = 0.5f),
                                    Color.Black.copy(alpha = 0.85f)
                                )
                            )
                        )
                )

                // Contenido del carrusel
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp)
                ) {
                    // Badge "NEW" en naranja
                    Box(
                        modifier = Modifier
                            .background(
                                MaterialTheme.colorScheme.primary,
                                shape = RoundedCornerShape(4.dp)
                            )
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "NEW",
                            color = MaterialTheme.colorScheme.onPrimary,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = anime.displayTitle,
                        color = Color.White,
                        style = MaterialTheme.typography.headlineSmall, // headlineSmall solicitado
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }

        // Puntos indicadores abajo
        Row(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            animeList.forEachIndexed { index, _ ->
                Box(
                    modifier = Modifier
                        .size(if (pagerState.currentPage == index) 8.dp else 6.dp)
                        .clip(CircleShape)
                        .background(
                            if (pagerState.currentPage == index) MaterialTheme.colorScheme.primary
                            else Color.Gray.copy(alpha = 0.5f)
                        )
                )
            }
        }
    }
}

@Composable
fun SectionHeader(
    title: String,
    onViewAllClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            color = Color.White,
            style = MaterialTheme.typography.titleMedium, // titleMedium bold
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "VER TODO",
            color = MaterialTheme.colorScheme.primary, // Red AniRD
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.clickable { onViewAllClick() }
        )
    }
}

@Composable
fun ContinueWatchingSection(
    list: List<HistoryEntity>,
    onAnimeClick: (Int) -> Unit,
    onViewAllClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        SectionHeader(title = "Continuar Viendo", onViewAllClick = onViewAllClick)
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(list) { history ->
                Column(
                    modifier = Modifier
                        .width(120.dp) // Poster width 120.dp
                        .clickable { onAnimeClick(history.animeId) }
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp) // Aspect ratio 2:3
                            .clip(RoundedCornerShape(8.dp))
                    ) {
                        AsyncImage(
                            model = history.cover,
                            contentDescription = history.title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )

                        // Botón de reproducción flotante
                        Box(
                            modifier = Modifier
                                .align(Alignment.Center)
                                .size(32.dp)
                                .background(Color.Black.copy(alpha = 0.6f), shape = CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.PlayArrow,
                                contentDescription = "Reproducir",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }

                        // LinearProgressIndicator fina 2.dp en bottom de imagen, color naranja
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .fillMaxWidth()
                                .height(2.dp)
                                .background(Color.Gray.copy(alpha = 0.4f))
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxHeight()
                                    .fillMaxWidth(fraction = (history.progress.toFloat() / history.duration.toFloat()).coerceIn(0f, 1f))
                                    .background(MaterialTheme.colorScheme.primary)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = history.title ?: "Anime",
                        color = Color(0xFFA0A3A7), // Texto gris
                        style = MaterialTheme.typography.bodySmall, // bodySmall solicitado
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

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
            .padding(vertical = 8.dp)
    ) {
        SectionHeader(title = title, onViewAllClick = onViewAllClick)
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(animeList) { anime ->
                Column(
                    modifier = Modifier
                        .width(120.dp) // Width 120.dp
                        .clickable { onAnimeClick(anime.malId) }
                ) {
                    AsyncImage(
                        model = anime.imageUrl,
                        contentDescription = anime.displayTitle,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp) // Aspect ratio 2:3
                            .clip(RoundedCornerShape(8.dp)) // Corners 8.dp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = anime.displayTitle,
                        color = Color(0xFFA0A3A7), // Título bodySmall gris debajo
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun TopTenSection(
    animeList: List<Anime>,
    onAnimeClick: (Int) -> Unit,
    onViewAllClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        SectionHeader(title = "Top 10 Popular", onViewAllClick = onViewAllClick)
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(animeList.take(10).size) { index ->
                val anime = animeList[index]
                Box(
                    modifier = Modifier
                        .width(135.dp)
                        .height(200.dp)
                        .clickable { onAnimeClick(anime.malId) }
                ) {
                    // Poster
                    AsyncImage(
                        model = anime.imageUrl,
                        contentDescription = anime.displayTitle,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .width(120.dp)
                            .height(180.dp)
                            .clip(RoundedCornerShape(8.dp))
                    )

                    // Número 40.sp bold blanco con sombra negra superpuesto en la esquina superior izquierda
                    Text(
                        text = (index + 1).toString(),
                        color = Color.White,
                        fontSize = 44.sp,
                        fontWeight = FontWeight.Black,
                        style = TextStyle(
                            shadow = Shadow(
                                color = Color.Black,
                                offset = Offset(2f, 2f),
                                blurRadius = 4f
                            )
                        ),
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = (-4).dp, y = (-4).dp)
                    )
                }
            }
        }
    }
}
