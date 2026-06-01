package com.example.anird.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Delete
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.presentation.viewmodels.MyListsViewModel

@OptIn(ExperimentalMaterial3Api::class)
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

    // Watchlist, Colecciones, Notificaciones, History
    var selectedTab by remember { 
        mutableStateOf(
            when (initialTab) {
                "watchlist" -> 0
                "favorites" -> 0
                "colecciones" -> 1
                "notificaciones" -> 2
                "history" -> 3
                else -> 0
            }
        ) 
    }
    val tabs = listOf("Watchlist", "Colecciones", "Notificaciones", "History")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF141519)) // Background AniRD
            .statusBarsPadding()
    ) {
        Text(
            text = "Mis Listas",
            color = Color.White,
            fontSize = 20.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(16.dp)
        )

        // TabRow con fondo transparente, indicador rojo
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = Color.Transparent,
            contentColor = MaterialTheme.colorScheme.primary, // Red AniRD
            indicator = { tabPositions ->
                TabRowDefaults.Indicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                    color = MaterialTheme.colorScheme.primary
                )
            },
            modifier = Modifier.padding(vertical = 4.dp)
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 13.sp
                        )
                    }
                )
            }
        }

        Box(modifier = Modifier.weight(1f)) {
            when (selectedTab) {
                0 -> { // Watchlist (Favorites/Following)
                    val combinedList = uiState.following + uiState.favorites.map { 
                        // Mapeamos temporalmente para unificar el renderizado en la grilla
                        com.example.anird.data.local.FollowingEntity(it.animeId, it.title, it.cover) 
                    }.distinctBy { it.animeId }

                    if (combinedList.isEmpty()) {
                        EmptyListState("Tu Watchlist está vacía")
                    } else {
                        // LazyVerticalGrid de 2 columnas con gap de 12.dp
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(2),
                            contentPadding = PaddingValues(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            items(combinedList) { item ->
                                WatchlistCard(
                                    title = item.title,
                                    coverUrl = item.cover,
                                    episodesText = "12 Episodios", // Simulado
                                    onClick = { onNavigateToDetail(item.animeId) }
                                )
                            }
                        }
                    }
                }
                1 -> { // Colecciones
                    EmptyListState("No tienes colecciones creadas")
                }
                2 -> { // Notificaciones
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Historial de Notificaciones",
                                color = Color.White,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
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
                        
                        Spacer(modifier = Modifier.height(12.dp))
                        
                        if (notifHistory.isEmpty()) {
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "No tienes notificaciones de nuevos capítulos",
                                    color = Color(0xFFA0A3A7),
                                    fontSize = 14.sp,
                                    textAlign = TextAlign.Center
                                )
                            }
                        } else {
                            LazyColumn(
                                verticalArrangement = Arrangement.spacedBy(10.dp),
                                modifier = Modifier.fillMaxSize()
                            ) {
                                items(notifHistory) { item ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .background(Color(0xFF1E2127), RoundedCornerShape(8.dp))
                                            .clickable { onNavigateToDetail(item.animeId) }
                                            .padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(36.dp)
                                                .background(MaterialTheme.colorScheme.primaryContainer, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Notifications,
                                                contentDescription = null,
                                                tint = MaterialTheme.colorScheme.primary,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                        
                                        Spacer(modifier = Modifier.width(12.dp))
                                        
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = "¡Episodio ${item.episode} ya disponible! 🎉",
                                                color = Color.White,
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Spacer(modifier = Modifier.height(2.dp))
                                            Text(
                                                text = "El nuevo capítulo de '${item.title}' ya se encuentra en emisión.",
                                                color = Color(0xFFA0A3A7),
                                                fontSize = 11.sp,
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
                                                fontSize = 9.sp
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                3 -> { // History
                    EmptyListState("Aún no tienes historial registrado")
                }
            }
        }
    }
}

@Composable
fun WatchlistCard(
    title: String,
    coverUrl: String?,
    episodesText: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E2127)),
        shape = RoundedCornerShape(8.dp)
    ) {
        Column {
            // Poster 2:3
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
                    .background(Color(0xFF2C2F35))
            ) {
                if (coverUrl != null) {
                    AsyncImage(
                        model = coverUrl,
                        contentDescription = title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
            
            // Textos y Menú ⋮
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        color = Color.White,
                        style = MaterialTheme.typography.bodyMedium, // bodyMedium solicitado
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = episodesText,
                        color = Color(0xFFA0A3A7), // bodySmall gris solicitado
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 1
                    )
                }
                IconButton(onClick = { /* Menú de opciones */ }, modifier = Modifier.size(24.dp)) {
                    Icon(
                        imageVector = Icons.Default.MoreVert,
                        contentDescription = "Opciones",
                        tint = Color.LightGray
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyListState(message: String) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.Default.Info,
                contentDescription = null,
                tint = Color(0xFFA0A3A7),
                modifier = Modifier.size(48.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = message,
                color = Color(0xFFA0A3A7),
                fontSize = 14.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}

data class NotifItemLocal(
    val animeId: Int,
    val title: String,
    val episode: Int,
    val timestamp: Long
)


