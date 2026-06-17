package com.example.anird.presentation.screens
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.Icon

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.presentation.viewmodels.MyListsViewModel

// ─── Color Palette ───────────────────────────────────────────────────────────
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

@Composable
fun MyListsScreen(
    initialTab: String = "watchlist",
    onNavigateToDetail: (Int) -> Unit = {},
    viewModel: MyListsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    val context = androidx.compose.ui.platform.LocalContext.current
    val prefs = remember { context.getSharedPreferences("anird_prefs", android.content.Context.MODE_PRIVATE) }
    var notifHistory by remember {
        mutableStateOf(
            run {
                val historySet = prefs.getStringSet("notification_history_set", emptySet()) ?: emptySet()
                historySet.mapNotNull { item ->
                    val parts = item.split("|")
                    if (parts.size >= 4) {
                        NotifItemLocal(
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

    val reloadHistory = {
        val historySet = prefs.getStringSet("notification_history_set", emptySet()) ?: emptySet()
        notifHistory = historySet.mapNotNull { item ->
            val parts = item.split("|")
            if (parts.size >= 4) {
                NotifItemLocal(
                    animeId = parts[0].toIntOrNull() ?: 0,
                    title = parts[1],
                    episode = parts[2].toIntOrNull() ?: 0,
                    timestamp = parts[3].toLongOrNull() ?: 0L
                )
            } else null
        }.sortedByDescending { it.timestamp }
    }

    LaunchedEffect(Unit) {
        reloadHistory()
    }

    // Favoritos, Siguiendo, Historial, Notificaciones
    var selectedTab by remember {
        mutableStateOf(
            when (initialTab) {
                "favorites" -> 0
                "following" -> 1
                "history" -> 2
                "notificaciones" -> 3
                else -> 0
            }
        )
    }
    val tabs = listOf("Favoritos", "Siguiendo", "Historial", "Notificaciones")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
            .statusBarsPadding()
    ) {
        // ─── Header ───────────────────────────────────────────────────────
        Text(
            text = "Mis Listas",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 12.dp)
        )

        // ─── Custom Tab Bar ───────────────────────────────────────────────
        CustomTabBar(
            tabs = tabs,
            selectedTabIndex = selectedTab,
            onTabSelected = { selectedTab = it }
        )

        // ─── Content Area ─────────────────────────────────────────────────
        Box(modifier = Modifier.weight(1f)) {
            when (selectedTab) {
                0 -> { // Favoritos
                    val favoritesList = uiState.favorites
                    if (favoritesList.isEmpty()) {
                        EmptyListState(
                            message = "Tu lista de Favoritos está vacía",
                            icon = Icons.Default.Star
                        )
                    } else {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(3),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            items(favoritesList) { item ->
                                WatchlistCard(
                                    title = item.title,
                                    coverUrl = item.cover,
                                    episodesText = "Guardado",
                                    onClick = { onNavigateToDetail(item.animeId) }
                                )
                            }
                        }
                    }
                }
                1 -> { // Siguiendo
                    val followingList = uiState.following
                    if (followingList.isEmpty()) {
                        EmptyListState(
                            message = "No estás siguiendo ningún anime",
                            icon = Icons.Default.Info
                        )
                    } else {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(3),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            items(followingList) { item ->
                                WatchlistCard(
                                    title = item.title,
                                    coverUrl = item.cover,
                                    episodesText = "Siguiendo",
                                    onClick = { onNavigateToDetail(item.animeId) }
                                )
                            }
                        }
                    }
                }
                2 -> { // Historial
                    EmptyListState(
                        message = "Aún no tienes historial registrado",
                        icon = Icons.Default.History
                    )
                }
                3 -> { // Notificaciones
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Historial de Notificaciones",
                                color = TextPrimary,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                            if (notifHistory.isNotEmpty()) {
                                IconButton(
                                    onClick = {
                                        prefs.edit().putStringSet("notification_history_set", emptySet()).apply()
                                        notifHistory = emptyList()
                                    },
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Limpiar todas",
                                        tint = Primary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        if (notifHistory.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(bottom = 32.dp),
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
                                        text = "No hay notificaciones",
                                        color = TextSecondary,
                                        fontSize = 14.sp
                                    )
                                }
                            }
                        } else {
                            LazyColumn(
                                verticalArrangement = Arrangement.spacedBy(10.dp),
                                modifier = Modifier.fillMaxSize()
                            ) {
                                items(notifHistory) { item ->
                                    NotificationCard(
                                        item = item,
                                        onClick = { onNavigateToDetail(item.animeId) }
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

// ─── Custom Tab Bar ──────────────────────────────────────────────────────────
@Composable
private fun CustomTabBar(
    tabs: List<String>,
    selectedTabIndex: Int,
    onTabSelected: (Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .drawBehind {
                // Subtle bottom border
                drawLine(
                    color = Border,
                    start = androidx.compose.ui.geometry.Offset(0f, size.height),
                    end = androidx.compose.ui.geometry.Offset(size.width, size.height),
                    strokeWidth = 1.dp.toPx()
                )
            }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.Bottom
        ) {
            tabs.forEachIndexed { index, title ->
                val isSelected = selectedTabIndex == index
                val textColor by animateColorAsState(
                    targetValue = if (isSelected) TextPrimary else TextTertiary,
                    label = "tabColor"
                )

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .clickable { onTabSelected(index) }
                        .padding(bottom = 8.dp)
                ) {
                    Text(
                        text = title,
                        color = textColor,
                        fontSize = 14.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )

                    // Animated underline indicator
                    Box(
                        modifier = Modifier
                            .padding(top = 6.dp)
                            .height(2.dp)
                            .width(
                                animateDpAsState(
                                    targetValue = if (isSelected) 24.dp else 0.dp,
                                    label = "underlineWidth"
                                ).value
                            )
                            .background(
                                color = if (isSelected) Primary else Color.Transparent,
                                shape = RoundedCornerShape(1.dp)
                            )
                    )
                }
            }
        }
    }
}

// ─── Watchlist Card ──────────────────────────────────────────────────────────
@Composable
fun WatchlistCard(
    title: String,
    coverUrl: String?,
    episodesText: String,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.97f else 1f,
        label = "cardScale"
    )

    var showMenu by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .scale(scale)
            .background(SurfaceVariant, RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() }
    ) {
        // Poster with 2:3 aspect ratio
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(2f / 3f)
                .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                .background(SurfaceBright)
        ) {
            if (coverUrl != null) {
                AsyncImage(
                    model = coverUrl,
                    contentDescription = title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Gradient overlay at bottom for readability
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .height(40.dp)
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color(0xCC000000))
                        )
                    )
            )

            // MoreVert menu trigger on long press
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(4.dp)
                    .clip(CircleShape)
                    .background(Color(0x88000000))
                    .size(24.dp)
                    .clickable { showMenu = true },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.MoreVert,
                    contentDescription = "Opciones",
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            }
        }

        // Title + status text
        Column(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 8.dp)
        ) {
            Text(
                text = title,
                color = TextPrimary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = episodesText,
                color = TextTertiary,
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

// ─── Notification Card ───────────────────────────────────────────────────────
@Composable
private fun NotificationCard(
    item: NotifItemLocal,
    onClick: () -> Unit
) {
    val minutesAgo = (System.currentTimeMillis() - item.timestamp) / 60000
    val timeText = if (minutesAgo < 1) {
        "Ahora mismo"
    } else if (minutesAgo < 60) {
        "Hace $minutesAgo min"
    } else {
        val hoursAgo = minutesAgo / 60
        if (hoursAgo < 24) "Hace $hoursAgo h" else "Hace ${hoursAgo / 24} d"
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(SurfaceVariant, RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Icon circle
        Box(
            modifier = Modifier
                .size(36.dp)
                .background(
                    color = Color(0x1AE50914), // Primary with low alpha
                    shape = CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Notifications,
                contentDescription = null,
                tint = Primary,
                modifier = Modifier.size(16.dp)
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        // Text column
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = "Episodio ${item.episode} ya disponible",
                color = TextPrimary,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "El nuevo capítulo de '${item.title}' ya se encuentra en emisión.",
                color = TextSecondary,
                fontSize = 11.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 14.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = timeText,
                color = TextTertiary,
                fontSize = 10.sp
            )
        }
    }
}

// ─── Empty List State ────────────────────────────────────────────────────────
@Composable
fun EmptyListState(
    message: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector = Icons.Default.Info
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = TextTertiary,
                modifier = Modifier.size(48.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = message,
                color = TextSecondary,
                fontSize = 14.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}

// ─── Data Class ──────────────────────────────────────────────────────────────
data class NotifItemLocal(
    val animeId: Int,
    val title: String,
    val episode: Int,
    val timestamp: Long
)
