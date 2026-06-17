package com.example.anird.presentation.screens
import androidx.compose.foundation.interaction.collectIsPressedAsState

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.presentation.viewmodels.HistoryViewModel

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
fun HistoryScreen(
    onNavigateToDetail: (Int) -> Unit = {},
    onNavigateToPlayer: (Int, Int) -> Unit = { _, _ -> },
    viewModel: HistoryViewModel = hiltViewModel()
) {
    val historyList by viewModel.historyList.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
    ) {
        // ── Header ──
        Text(
            text = "Historial de reproducción",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(16.dp)
        )

        // ── Content ──
        when {
            historyList.isEmpty() -> {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.History,
                            contentDescription = null,
                            tint = TextTertiary,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No tienes historial de reproducción todavía",
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Tu historial aparecerá aquí",
                            color = TextTertiary,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            else -> {
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(historyList) { history ->
                        HistoryItem(
                            coverUrl = history.cover ?: "",
                            title = history.title ?: "Anime",
                            episodeNumber = history.episodeNumber,
                            progress = history.progress,
                            duration = history.duration,
                            progressPercent = history.progressPercent,
                            onClick = { onNavigateToDetail(history.animeId) },
                            onPlayClick = { onNavigateToPlayer(history.animeId, history.episodeNumber) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HistoryItem(
    coverUrl: String,
    title: String,
    episodeNumber: Int,
    progress: Long,
    duration: Long,
    progressPercent: Float,
    onClick: () -> Unit,
    onPlayClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.98f else 1f,
        animationSpec = spring(stiffness = 400f),
        label = "press_scale"
    )
    val progressFraction = if (duration > 0) (progress.toFloat() / duration.toFloat()).coerceIn(0f, 1f) else 0f

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .background(SurfaceVariant, RoundedCornerShape(14.dp))
            .clickable(
                interactionSource = interactionSource,
                indication = null
            ) { onClick() }
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // ── Poster with overlay controls ──
        Box(
            modifier = Modifier
                .size(width = 110.dp, height = 65.dp)
                .clip(RoundedCornerShape(8.dp))
        ) {
            AsyncImage(
                model = coverUrl,
                contentDescription = title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Resume play button overlay
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .size(30.dp)
                    .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                    .clickable { onPlayClick() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Reanudar",
                    tint = Primary,
                    modifier = Modifier.size(16.dp)
                )
            }

            // Progress bar at bottom
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .height(3.dp)
                    .clip(RoundedCornerShape(1.5.dp))
                    .background(SurfaceBright)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(fraction = progressFraction)
                        .clip(RoundedCornerShape(1.5.dp))
                        .background(Primary)
                )
            }
        }

        Spacer(modifier = Modifier.width(12.dp))

        // ── Info column ──
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "Resumen: Episodio $episodeNumber",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "Progreso: ${progressPercent.toInt()}% visto",
                color = Primary,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
