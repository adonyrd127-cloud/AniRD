package com.example.anird.presentation.screens
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Icon
import androidx.compose.runtime.collectAsState
import androidx.compose.material.icons.filled.*

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.data.model.Anime
import com.example.anird.presentation.viewmodels.SimulcastUiState
import com.example.anird.presentation.viewmodels.SimulcastsViewModel
import java.util.Calendar

// ── Premium Color Palette ──────────────────────────────────────────────────
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

private val PrimaryContainer = Color(0xFF2A0A0E)

// ── Day mapping ────────────────────────────────────────────────────────────
private val daysOfWeekMap = listOf(
    "monday" to "LUN",
    "tuesday" to "MAR",
    "wednesday" to "MIÉ",
    "thursday" to "JUE",
    "friday" to "VIE",
    "saturday" to "SÁB",
    "sunday" to "DOM"
)

@Composable
fun SimulcastsScreen(
    onNavigateToDetail: (Int) -> Unit = {},
    viewModel: SimulcastsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val todayDayKey = remember { getTodayDayKey() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
            .statusBarsPadding()
    ) {
        // ── Header ──────────────────────────────────────────────────────
        Text(
            text = "Calendario de Simulcasts",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
        )

        when (val state = uiState) {
            is SimulcastUiState.Loading -> {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = Primary,
                        modifier = Modifier.size(36.dp),
                        strokeWidth = 3.dp
                    )
                }
            }

            is SimulcastUiState.Error -> {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = null,
                            tint = TextTertiary,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = state.message,
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(SurfaceVariant)
                                .clickable { viewModel.loadSchedules() }
                                .padding(horizontal = 24.dp, vertical = 10.dp)
                        ) {
                            Text(
                                text = "Reintentar",
                                color = Primary,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            is SimulcastUiState.Success -> {
                // ── Day Selector ─────────────────────────────────────────
                DaySelectorRow(
                    selectedDay = state.selectedDay,
                    todayDayKey = todayDayKey,
                    onDaySelected = { viewModel.selectDay(it) }
                )

                // ── Anime List ──────────────────────────────────────────
                val dayAnimeList = state.schedulesByDay[state.selectedDay] ?: emptyList()

                if (dayAnimeList.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Default.CalendarMonth,
                                contentDescription = null,
                                tint = TextTertiary,
                                modifier = Modifier.size(48.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "No hay simulcasts para este día",
                                color = TextSecondary,
                                fontSize = 14.sp
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(
                            items = dayAnimeList,
                            key = { it.malId }
                        ) { anime ->
                            SimulcastAnimeCard(
                                anime = anime,
                                isFollowed = state.followingIds.contains(anime.malId),
                                onClick = { onNavigateToDetail(anime.malId) }
                            )
                        }
                    }
                }
            }
        }
    }
}

// ── Day Selector ───────────────────────────────────────────────────────────
@Composable
private fun DaySelectorRow(
    selectedDay: String,
    todayDayKey: String,
    onDaySelected: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
    ) {
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(daysOfWeekMap) { (dayKey, dayLabel) ->
                val isSelected = selectedDay == dayKey
                val isToday = todayDayKey == dayKey
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .height(40.dp)
                            .clip(RoundedCornerShape(20.dp))
                            .background(
                                if (isSelected) Primary else SurfaceVariant
                            )
                            .clickable { onDaySelected(dayKey) }
                            .padding(horizontal = 18.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = dayLabel,
                            color = if (isSelected) Color.White else TextSecondary,
                            fontSize = 13.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                    if (isToday) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .size(4.dp)
                                .background(Primary, CircleShape)
                        )
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
    }
}

// ── Anime Card ─────────────────────────────────────────────────────────────
@Composable
private fun SimulcastAnimeCard(
    anime: Anime,
    isFollowed: Boolean,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.98f else 1f,
        animationSpec = tween(120),
        label = "card_press"
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .graphicsLayer { shadowElevation = if (isFollowed) 4f else 0f }
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceVariant)
            .then(
                if (isFollowed) {
                    Modifier.border(
                        width = 1.dp,
                        color = Primary.copy(alpha = 0.7f),
                        shape = RoundedCornerShape(14.dp)
                    )
                } else {
                    Modifier.border(
                        width = 0.5.dp,
                        color = Border,
                        shape = RoundedCornerShape(14.dp)
                    )
                }
            )
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Poster
        AsyncImage(
            model = anime.imageUrl,
            contentDescription = anime.displayTitle,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .size(width = 72.dp, height = 108.dp)
                .clip(RoundedCornerShape(10.dp))
        )

        Spacer(modifier = Modifier.width(12.dp))

        // Info column
        Column(modifier = Modifier.weight(1f)) {
            // Badges row
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(PrimaryContainer)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "SIMULCAST",
                        color = Primary,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                if (isFollowed) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(SurfaceBright)
                            .border(
                                width = 1.dp,
                                color = Primary.copy(alpha = 0.6f),
                                shape = RoundedCornerShape(4.dp)
                            )
                            .padding(start = 6.dp, end = 6.dp, top = 2.dp, bottom = 2.dp)
                    ) {
                        Text(
                            text = "SIGUIENDO",
                            color = Primary,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Title
            Text(
                text = anime.displayTitle,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Broadcast time
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Schedule,
                    contentDescription = null,
                    tint = TextSecondary,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = anime.broadcast?.string ?: "Hora por confirmar",
                    color = TextSecondary,
                    fontSize = 12.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Next episode date
            if (anime.nextEpisodeDate != null) {
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(Accent.copy(alpha = 0.1f))
                        .border(
                            width = 0.5.dp,
                            color = Accent.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(6.dp)
                        )
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CalendarMonth,
                        contentDescription = null,
                        tint = Accent,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = anime.nextEpisodeDate!!,
                        color = Accent,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

// ── Helpers ────────────────────────────────────────────────────────────────
private fun getTodayDayKey(): String {
    return when (Calendar.getInstance().get(Calendar.DAY_OF_WEEK)) {
        Calendar.MONDAY -> "monday"
        Calendar.TUESDAY -> "tuesday"
        Calendar.WEDNESDAY -> "wednesday"
        Calendar.THURSDAY -> "thursday"
        Calendar.FRIDAY -> "friday"
        Calendar.SATURDAY -> "saturday"
        Calendar.SUNDAY -> "sunday"
        else -> "sunday"
    }
}
