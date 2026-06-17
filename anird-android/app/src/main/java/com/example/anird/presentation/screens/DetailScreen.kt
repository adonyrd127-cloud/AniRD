package com.example.anird.presentation.screens
import androidx.compose.runtime.collectAsState

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.data.local.EpisodeEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.model.AnimeCharacter
import com.example.anird.domain.usecase.ResolvedRelationEntry
import com.example.anird.domain.usecase.ResolvedRelationGroup
import com.example.anird.presentation.viewmodels.DetailUiState
import com.example.anird.presentation.viewmodels.DetailViewModel
import kotlinx.coroutines.delay

// ─── Premium Color Palette ───────────────────────────────────────────────────

private val BG = Color(0xFF0A0B0E)
private val SurfaceVariant = Color(0xFF1A1D26)
private val SurfaceBright = Color(0xFF222633)
private val Primary = Color(0xFFE50914)
private val Accent = Color(0xFF00D4AA)
private val TextPrimary = Color(0xFFF0F0F5)
private val TextSecondary = Color(0xFF8B8FA3)
private val TextTertiary = Color(0xFF5A5E6E)
private val Border = Color(0xFF1E2230)
private val Glass = Color(0xFF12141A).copy(alpha = 0.85f)

// ─── Tab definitions ─────────────────────────────────────────────────────────

private val detailTabs = listOf("Info", "Episodios", "Personajes", "Recomendados", "Relaciones")

// ─── Main Entry Point ────────────────────────────────────────────────────────

@Composable
fun DetailScreen(
    malId: Int,
    onNavigateToPlayer: (Int, Int) -> Unit = { _, _ -> },
    onBackClick: () -> Unit = {},
    viewModel: DetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(malId) {
        viewModel.loadAnimeDetails(malId)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
    ) {
        when (val state = uiState) {
            is DetailUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Primary)
                }
            }
            is DetailUiState.Error -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Error al cargar la información del anime",
                            color = TextPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = state.message,
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.loadAnimeDetails(malId) },
                            colors = ButtonDefaults.buttonColors(containerColor = Primary)
                        ) {
                            Text("Reintentar", color = Color.White)
                        }
                    }
                }
            }
            is DetailUiState.Success -> {
                // Fade-in on load (300ms feel)
                var visible by remember { mutableStateOf(false) }
                LaunchedEffect(Unit) {
                    delay(80)
                    visible = true
                }

                AnimatedVisibility(
                    visible = visible,
                    enter = fadeIn(animationSpec = spring(stiffness = Spring.StiffnessMediumLow)),
                    exit = fadeOut()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(BG),
                        contentAlignment = Alignment.TopCenter
                    ) {
                        Box(
                            modifier = Modifier
                                .widthIn(max = 640.dp)
                                .fillMaxHeight()
                        ) {
                            DetailContent(
                                anime = state.anime,
                                characters = state.characters,
                                relations = state.relations,
                                recommendations = state.recommendations,
                                episodes = state.episodes,
                                isFavorite = state.isFavorite,
                                isFollowing = state.isFollowing,
                                onToggleFavorite = { viewModel.toggleFavorite(state.anime) },
                                onToggleFollowing = { viewModel.toggleFollowing(state.anime) },
                                onBackClick = onBackClick,
                                onEpisodeClick = { episodeNumber ->
                                    onNavigateToPlayer(malId, episodeNumber)
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

// ─── Detail Content ──────────────────────────────────────────────────────────

@Composable
private fun DetailContent(
    anime: Anime,
    characters: List<AnimeCharacter>,
    relations: List<ResolvedRelationGroup>,
    recommendations: List<Anime>,
    episodes: List<EpisodeEntity>,
    isFavorite: Boolean,
    isFollowing: Boolean,
    onToggleFavorite: () -> Unit,
    onToggleFollowing: () -> Unit,
    onBackClick: () -> Unit,
    onEpisodeClick: (Int) -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(1) } // Default to Episodes tab
    var isSynopsisExpanded by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
    ) {
        // ─── 1. Banner / Backdrop Area (280dp) ────────────────────────────
        item {
            BannerSection(
                anime = anime,
                isFavorite = isFavorite,
                onBackClick = onBackClick,
                onToggleFavorite = onToggleFavorite
            )
        }

        // ─── 2. Poster overlapping banner + Title + Metadata pills ────────
        item {
            PosterTitleSection(anime = anime)
        }

        // ─── 3. Synopsis ─────────────────────────────────────────────────
        item {
            SynopsisSection(
                synopsis = anime.synopsis,
                isExpanded = isSynopsisExpanded,
                onToggle = { isSynopsisExpanded = !isSynopsisExpanded }
            )
        }

        // ─── 4. Action Buttons Row ───────────────────────────────────────
        item {
            ActionButtonsSection(
                episodes = episodes,
                isFollowing = isFollowing,
                onPlayClick = {
                    if (episodes.isNotEmpty()) {
                        onEpisodeClick(episodes.first().episodeNumber)
                    } else {
                        onEpisodeClick(1)
                    }
                },
                onToggleFollowing = onToggleFollowing
            )
        }

        // ─── 5. Airing Countdown (conditional) ──────────────────────────
        if (anime.nextEpisodeDate != null) {
            item {
                AiringCountdownSection(nextEpisodeDate = anime.nextEpisodeDate!!)
            }
        }

        // ─── 6. Custom Tab Bar ──────────────────────────────────────────
        item {
            PremiumTabBar(
                tabs = detailTabs,
                selectedTab = selectedTab,
                onTabSelected = { selectedTab = it }
            )
        }

        // ─── 7. Tab Content (Crossfade animated) ────────────────────────
        item {
            Crossfade(
                targetState = selectedTab,
                animationSpec = spring(stiffness = Spring.StiffnessMediumLow)
            ) { tab ->
                when (tab) {
                    0 -> InfoTabContent(anime = anime)
                    1 -> EpisodesTabContent(
                        episodes = episodes,
                        onEpisodeClick = onEpisodeClick
                    )
                    2 -> CharactersTabContent(characters = characters)
                    3 -> RecommendationsTabContent(recommendations = recommendations)
                    4 -> RelationsTabContent(relations = relations)
                }
            }
        }

        // Bottom spacing for system bars
        item { Spacer(modifier = Modifier.height(32.dp)) }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// BANNER SECTION
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun BannerSection(
    anime: Anime,
    isFavorite: Boolean,
    onBackClick: () -> Unit,
    onToggleFavorite: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(280.dp)
    ) {
        // Banner image
        AsyncImage(
            model = anime.bannerUrl ?: anime.imageUrl,
            contentDescription = "Banner",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Multi-layer gradient overlay: transparent → 30% black at 40% → 90% black at bottom
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colorStops = arrayOf(
                            0.0f to Color.Transparent,
                            0.4f to Color.Black.copy(alpha = 0.3f),
                            1.0f to Color.Black.copy(alpha = 0.9f)
                        )
                    )
                )
        )

        // Floating back button: top-left, 40dp circle, Glass bg, white ArrowBack
        IconButton(
            onClick = onBackClick,
            modifier = Modifier
                .padding(top = 12.dp, start = 12.dp)
                .align(Alignment.TopStart)
                .size(40.dp)
                .shadow(8.dp, CircleShape)
                .background(Glass, CircleShape)
                .border(1.dp, Color.White.copy(alpha = 0.1f), CircleShape)
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Volver",
                tint = Color.White,
                modifier = Modifier.size(20.dp)
            )
        }

        // Floating favorite button: top-right, 40dp circle, Glass bg
        IconButton(
            onClick = onToggleFavorite,
            modifier = Modifier
                .padding(top = 12.dp, end = 12.dp)
                .align(Alignment.TopEnd)
                .size(40.dp)
                .shadow(8.dp, CircleShape)
                .background(Glass, CircleShape)
                .border(1.dp, Color.White.copy(alpha = 0.1f), CircleShape)
        ) {
            Icon(
                imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                contentDescription = "Favorito",
                tint = if (isFavorite) Primary else Color.White,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// POSTER + TITLE + METADATA SECTION
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun PosterTitleSection(anime: Anime) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .offset(y = (-30).dp)
            .padding(horizontal = 16.dp)
    ) {
        Row(verticalAlignment = Alignment.Bottom) {
            // Poster 100x145dp, 12dp corners, overlapping banner bottom by -30dp
            AsyncImage(
                model = anime.imageUrl,
                contentDescription = "Poster",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .width(100.dp)
                    .height(145.dp)
                    .shadow(8.dp, RoundedCornerShape(12.dp))
                    .clip(RoundedCornerShape(12.dp))
                    .border(
                        width = 1.dp,
                        color = Color.White.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(12.dp)
                    )
            )

            Spacer(modifier = Modifier.width(14.dp))

            // Title: 22sp Bold white, max 2 lines
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = anime.displayTitle,
                    color = TextPrimary,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 26.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Metadata pills row: Score, Year, Type, Episodes, Status
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            anime.score?.let { score ->
                MetadataPill(
                    icon = Icons.Default.Star,
                    text = String.format("%.1f", score),
                    iconTint = Color(0xFFFFD700)
                )
            }
            MetadataPill(text = anime.yearText)
            anime.type?.let { MetadataPill(text = it) }
            anime.episodes?.let { MetadataPill(text = "${it} eps") }
            anime.status?.let { MetadataPill(text = it) }
        }
    }
}

@Composable
private fun MetadataPill(
    icon: ImageVector? = null,
    text: String,
    iconTint: Color = TextSecondary
) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(SurfaceVariant)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(12.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
        }
        Text(
            text = text,
            color = TextSecondary,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNOPSIS SECTION
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun SynopsisSection(
    synopsis: String?,
    isExpanded: Boolean,
    onToggle: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = synopsis ?: "Sin sinopsis disponible",
            color = TextSecondary,
            fontSize = 13.sp,
            lineHeight = 20.sp,
            maxLines = if (isExpanded) Int.MAX_VALUE else 5,
            overflow = TextOverflow.Ellipsis
        )

        if (!synopsis.isNullOrBlank() && synopsis.length > 150) {
            Text(
                text = if (isExpanded) "Ver menos" else "Ver más",
                color = Primary,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .clickable { onToggle() }
                    .padding(vertical = 4.dp)
            )
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION BUTTONS SECTION
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun ActionButtonsSection(
    episodes: List<EpisodeEntity>,
    isFollowing: Boolean,
    onPlayClick: () -> Unit,
    onToggleFollowing: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // "Reproducir" button — Primary bg, white text, 16dp icon + text
        PressableButton(
            onClick = onPlayClick,
            modifier = Modifier.weight(1f)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Primary, RoundedCornerShape(10.dp))
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Reproducir",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // "Añadir a Lista" button — SurfaceVariant bg, Primary border, Primary text
        PressableButton(
            onClick = onToggleFollowing,
            modifier = Modifier.weight(1f)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SurfaceVariant, RoundedCornerShape(10.dp))
                    .border(1.dp, Primary, RoundedCornerShape(10.dp))
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = if (isFollowing) Icons.Default.Check else Icons.Default.Add,
                    contentDescription = null,
                    tint = Primary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isFollowing) "En Lista" else "Añadir a Lista",
                    color = Primary,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// AIRING COUNTDOWN SECTION
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun AiringCountdownSection(nextEpisodeDate: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Primary.copy(alpha = 0.08f))
            .border(1.dp, Primary.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.PlayArrow,
            contentDescription = "Próximo Episodio",
            tint = Primary,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = "PRÓXIMO EPISODIO",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = Primary
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = nextEpisodeDate,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM TAB BAR (horizontal scrollable, custom indicator)
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun PremiumTabBar(
    tabs: List<String>,
    selectedTab: Int,
    onTabSelected: (Int) -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(BG)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(scrollState)
                .padding(start = 16.dp, end = 16.dp, top = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            tabs.forEachIndexed { index, title ->
                val isSelected = selectedTab == index
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .clickable { onTabSelected(index) }
                        .padding(vertical = 8.dp)
                ) {
                    // Tab text: Primary if selected, TextTertiary if not; 14sp Bold when selected
                    Text(
                        text = title,
                        color = if (isSelected) Primary else TextTertiary,
                        fontSize = 14.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    // 2dp Primary underline indicator when selected
                    Box(
                        modifier = Modifier
                            .height(2.dp)
                            .width(24.dp)
                            .background(
                                color = if (isSelected) Primary else Color.Transparent,
                                shape = RoundedCornerShape(1.dp)
                            )
                    )
                }
            }
        }

        // Bottom border
        HorizontalDivider(
            color = Border,
            thickness = 1.dp,
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 0: INFO — Metadata cards grid + Genre flow pills
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun InfoTabContent(anime: Anime) {
    val studios = anime.studios?.map { it.name } ?: emptyList()
    val genres = anime.genres?.map { it.name } ?: emptyList()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        // Build metadata grid items from available Anime fields
        val gridItems = buildList {
            if (studios.isNotEmpty()) add("Estudio" to studios.joinToString(", "))
            anime.rating?.let { add("Clasificación" to it) }
            anime.type?.let { add("Tipo" to it) }
            anime.status?.let { add("Estado" to it) }
            anime.episodes?.let { add("Episodios" to "$it") }
            anime.year?.let { add("Año" to "$it") }
            anime.broadcast?.string?.let { add("Emisión" to it) }
        }

        // 2-column metadata cards grid
        gridItems.chunked(2).forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                rowItems.forEach { (label, value) ->
                    // Each card: SurfaceVariant bg, 12dp corners, 12dp padding
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceVariant)
                            .padding(12.dp)
                    ) {
                        Column {
                            Text(
                                text = label,
                                color = TextTertiary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Normal
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = value,
                                color = TextPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
                // Balance layout when odd number of items
                if (rowItems.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Genre pills: SurfaceBright bg, TextSecondary text, 12dp rounded
        if (genres.isNotEmpty()) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Géneros",
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 10.dp)
            )
            // Chunked for manual flow layout (3 per row)
            genres.chunked(3).forEach { rowGenres ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    rowGenres.forEach { genre ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(SurfaceBright)
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = genre,
                                color = TextSecondary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1: EPISODES — Episode cards with number, title, progress, play button
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun EpisodesTabContent(
    episodes: List<EpisodeEntity>,
    onEpisodeClick: (Int) -> Unit
) {
    if (episodes.isEmpty()) {
        // Loading state while episodes are being fetched
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(40.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                CircularProgressIndicator(
                    color = Primary,
                    modifier = Modifier.size(32.dp),
                    strokeWidth = 3.dp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Buscando episodios disponibles...",
                    color = TextSecondary,
                    fontSize = 14.sp
                )
            }
        }
    } else {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            episodes.forEachIndexed { index, episode ->
                PremiumEpisodeItem(
                    episode = episode,
                    isLast = index == episodes.lastIndex,
                    onClick = { onEpisodeClick(episode.episodeNumber) }
                )
            }
        }
    }
}

@Composable
private fun PremiumEpisodeItem(
    episode: EpisodeEntity,
    isLast: Boolean,
    onClick: () -> Unit
) {
    val progress = episode.watchedProgressMs ?: 0L
    val duration = episode.durationSeconds?.toLong()?.times(1000L) ?: 0L
    val progressFraction = if (duration > 0L && progress > 0L) (progress.toFloat() / duration).coerceIn(0f, 1f) else 0f

    PressableButton(onClick = onClick) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceVariant)
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: Episode number in 24sp Bold Primary color
            Text(
                text = String.format("%02d", episode.episodeNumber),
                color = Primary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.width(48.dp),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.width(12.dp))

            // Center: Episode title + subtitle + progress indicator
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Episodio ${episode.episodeNumber}",
                    color = TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                // Show custom title if different from default
                if (!episode.title.isNullOrBlank() && episode.title != "Episodio ${episode.episodeNumber}") {
                    Text(
                        text = episode.title,
                        color = TextTertiary,
                        fontSize = 12.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                // Episode progress indicator (if watched)
                if (progressFraction > 0f) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.6f)
                            .height(3.dp)
                            .clip(RoundedCornerShape(1.5.dp))
                            .background(SurfaceBright)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxHeight()
                                .fillMaxWidth(progressFraction)
                                .clip(RoundedCornerShape(1.5.dp))
                                .background(Accent)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Right: Play icon button, 40dp circle, Primary bg
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(Primary),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Reproducir",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }

    // Divider between episodes: 1dp Border color
    if (!isLast) {
        HorizontalDivider(
            color = Border,
            thickness = 1.dp,
            modifier = Modifier.padding(vertical = 1.dp)
        )
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2: CHARACTERS — Horizontal scroll row of circle avatars
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun CharactersTabContent(characters: List<AnimeCharacter>) {
    if (characters.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(40.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No se encontraron personajes registrados",
                color = TextSecondary,
                fontSize = 14.sp
            )
        }
    } else {
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(characters) { chr ->
                chr.character?.let { info ->
                    Column(
                        modifier = Modifier.width(80.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // 70x70dp circle avatar
                        AsyncImage(
                            model = info.images?.jpg?.imageUrl,
                            contentDescription = info.name,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(70.dp)
                                .clip(CircleShape)
                                .border(1.5.dp, Border, CircleShape)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        // Name: 12sp TextPrimary
                        Text(
                            text = info.name,
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        // Role: 10sp TextTertiary
                        Text(
                            text = chr.role ?: "Supporting",
                            color = TextTertiary,
                            fontSize = 10.sp,
                            maxLines = 1,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3: RECOMMENDATIONS — Vertical list of rich recommendation cards
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun RecommendationsTabContent(recommendations: List<Anime>) {
    if (recommendations.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(40.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No hay recomendaciones disponibles",
                color = TextSecondary,
                fontSize = 14.sp
            )
        }
    } else {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .verticalScroll(rememberScrollState())
        ) {
            recommendations.forEach { rec ->
                RecommendationCard(anime = rec)
                Spacer(modifier = Modifier.height(10.dp))
            }
        }
    }
}

@Composable
private fun RecommendationCard(anime: Anime) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceVariant)
            .padding(10.dp),
        verticalAlignment = Alignment.Top
    ) {
        // 60x85dp poster with 8dp corners
        AsyncImage(
            model = anime.imageUrl,
            contentDescription = anime.displayTitle,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .width(60.dp)
                .height(85.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(SurfaceBright)
        )

        Spacer(modifier = Modifier.width(12.dp))

        // Info column: score badge, title 14sp Bold, genres 11sp, type + eps
        Column(modifier = Modifier.weight(1f)) {
            // Score badge with star
            anime.score?.let { score ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        tint = Color(0xFFFFD700),
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = String.format("%.1f", score),
                        color = Color(0xFFFFD700),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
            }

            Text(
                text = anime.displayTitle,
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Genres
            val genreText = anime.genres?.take(3)?.joinToString(" · ") { it.name } ?: ""
            if (genreText.isNotEmpty()) {
                Text(
                    text = genreText,
                    color = TextSecondary,
                    fontSize = 11.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Type + Episodes metadata
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(top = 4.dp)
            ) {
                anime.type?.let {
                    Text(text = it, color = TextTertiary, fontSize = 11.sp)
                }
                anime.episodes?.let {
                    Text(text = "${it} eps", color = TextTertiary, fontSize = 11.sp)
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4: RELATIONS — Grouped by relation type with headers
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun RelationsTabContent(relations: List<ResolvedRelationGroup>) {
    val relationsWithAnime = relations.filter { it.entries.isNotEmpty() }
    if (relationsWithAnime.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(40.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No se encontraron obras relacionadas en la franquicia",
                color = TextSecondary,
                fontSize = 14.sp
            )
        }
    } else {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            relationsWithAnime.forEach { group ->
                // Group header: Primary 13sp Bold
                Text(
                    text = group.relation,
                    color = Primary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(vertical = 8.dp)
                )

                // Horizontal row of relation entries
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(group.entries) { entry ->
                        RelationEntryCard(entry = entry)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun RelationEntryCard(entry: ResolvedRelationEntry) {
    Column(
        modifier = Modifier.width(100.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(SurfaceVariant)
        ) {
            if (!entry.imageUrl.isNullOrBlank()) {
                AsyncImage(
                    model = entry.imageUrl,
                    contentDescription = entry.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = TextTertiary,
                        modifier = Modifier.size(32.dp)
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = entry.name,
            color = TextPrimary,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            lineHeight = 14.sp
        )
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESSABLE BUTTON — with 0.97f scale animation on press
// ═══════════════════════════════════════════════════════════════════════════

@Composable
private fun PressableButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (pressed) 0.97f else 1f,
        animationSpec = spring(stiffness = Spring.StiffnessHigh)
    )

    Box(
        modifier = modifier
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = {
                    pressed = true
                    onClick()
                }
            ),
        content = { content() }
    )
}
