package com.example.anird.presentation.screens
import androidx.compose.material3.Icon
import androidx.compose.runtime.collectAsState
import androidx.compose.material.icons.filled.*

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.statusBarsPadding
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.SentimentDissatisfied
import androidx.compose.material.icons.outlined.WarningAmber
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.data.model.Anime
import com.example.anird.presentation.viewmodels.SearchUiState
import com.example.anird.presentation.viewmodels.SearchViewModel

// ─── Premium Color Palette ────────────────────────────────────────────────
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

// ─── Genre data for the grid ─────────────────────────────────────────────
private data class GenreChip(val name: String, val count: Int)

private val genreGridData = listOf(
    GenreChip("Acción", 1240),
    GenreChip("Aventura", 980),
    GenreChip("Comedia", 1560),
    GenreChip("Drama", 870),
    GenreChip("Fantasía", 1100),
    GenreChip("Romance", 750),
    GenreChip("Terror", 320),
    GenreChip("Ciencia Ficción", 540),
    GenreChip("Deportes", 280),
    GenreChip("Mecha", 410),
    GenreChip("Misterio", 390),
    GenreChip("Slice of Life", 620),
)

private val trendingMockList = listOf(
    Triple(21, "One Piece", "https://cdn.myanimelist.net/images/anime/1244/138851.jpg"),
    Triple(50631, "Demon Slayer: Hashira Training", "https://cdn.myanimelist.net/images/anime/1908/135431.jpg"),
    Triple(51009, "Jujutsu Kaisen S2", "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"),
    Triple(50582, "Chainsaw Man", "https://cdn.myanimelist.net/images/anime/1806/126216.jpg"),
    Triple(52991, "Frieren", "https://cdn.myanimelist.net/images/anime/1015/138006.jpg"),
    Triple(51535, "Solo Leveling", "https://cdn.myanimelist.net/images/anime/1286/142680.jpg"),
    Triple(51829, "Oshi no Ko S2", "https://cdn.myanimelist.net/images/anime/1983/138014.jpg"),
)

@Composable
fun SearchScreen(
    onNavigateToDetail: (Int) -> Unit = {},
    viewModel: SearchViewModel = hiltViewModel()
) {
    val query by viewModel.query.collectAsState()
    val searchState by viewModel.searchState.collectAsState()
    val recentSearches by viewModel.recentSearches.collectAsState()

    var isFocused by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
            .statusBarsPadding()
    ) {
        // ─── Custom Search Bar ─────────────────────────────────────────
        PremiumSearchBar(
            query = query,
            isFocused = isFocused,
            onQueryChange = { viewModel.onQueryChanged(it) },
            onFocusChange = { focus ->
                isFocused = focus
            },
            onSearch = { viewModel.performSearch(it) }
        )

        // ─── Content Area ─────────────────────────────────────────────
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            when (val state = searchState) {
                is SearchUiState.Idle -> {
                    InitialSearchState(
                        recentSearches = recentSearches.map { it.query },
                        onQuerySelect = { viewModel.performSearch(it) },
                        onDelete = { viewModel.deleteRecentSearch(it) },
                        onClearAll = { viewModel.clearSearchHistory() },
                        onAnimeClick = onNavigateToDetail
                    )
                }

                is SearchUiState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            color = Primary,
                            strokeWidth = 3.dp,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }

                is SearchUiState.Error -> {
                    ErrorState(
                        message = state.message,
                        onRetry = {
                            if (query.isNotBlank()) viewModel.performSearch(query)
                        }
                    )
                }

                is SearchUiState.Success -> {
                    if (state.results.isEmpty()) {
                        EmptyResultsState(query = query)
                    } else {
                        SearchResultsList(
                            results = state.results,
                            onAnimeClick = onNavigateToDetail
                        )
                    }
                }
            }
        }
    }
}

// ─── Premium Search Bar ────────────────────────────────────────────────────
@Composable
private fun PremiumSearchBar(
    query: String,
    isFocused: Boolean,
    onQueryChange: (String) -> Unit,
    onFocusChange: (Boolean) -> Unit,
    onSearch: (String) -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val focused by interactionSource.collectIsFocusedAsState()

    // Keep parent in sync
    onFocusChange(focused)

    val glowAlpha by animateFloatAsState(
        targetValue = if (focused) 0.35f else 0f,
        label = "glow_alpha"
    )

    val borderColor = if (focused) Primary else Border

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .drawBehind {
                // Subtle glow behind the bar when focused
                if (glowAlpha > 0f) {
                    drawRoundRect(
                        brush = Brush.horizontalGradient(
                            colors = listOf(
                                Primary.copy(alpha = glowAlpha),
                                Primary.copy(alpha = glowAlpha * 0.3f)
                            )
                        ),
                        cornerRadius = CornerRadius(14.dp.toPx())
                    )
                }
            }
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceVariant)
            .border(
                width = 1.dp,
                color = borderColor,
                shape = RoundedCornerShape(14.dp)
            )
            .height(52.dp)
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Search icon
            Icon(
                imageVector = Icons.Outlined.Search,
                contentDescription = "Buscar",
                tint = TextSecondary,
                modifier = Modifier.size(20.dp)
            )

            Spacer(modifier = Modifier.width(10.dp))

            // Text input
            Box(modifier = Modifier.weight(1f)) {
                if (query.isEmpty()) {
                    Text(
                        text = "Buscar anime, episodios...",
                        color = TextTertiary,
                        fontSize = 14.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                BasicTextField(
                    value = query,
                    onValueChange = onQueryChange,
                    singleLine = true,
                    textStyle = androidx.compose.ui.text.TextStyle(
                        color = TextPrimary,
                        fontSize = 15.sp
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    interactionSource = interactionSource,
                    cursorBrush = Brush.verticalGradient(colors = listOf(Primary, Primary))
                )
            }

            // Clear button (only when has text)
            if (query.isNotEmpty()) {
                IconButton(
                    onClick = { onQueryChange("") },
                    modifier = Modifier.size(20.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Limpiar",
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

// ─── Initial Search State ─────────────────────────────────────────────────
@Composable
fun InitialSearchState(
    recentSearches: List<String>,
    onQuerySelect: (String) -> Unit,
    onDelete: (String) -> Unit,
    onClearAll: () -> Unit,
    onAnimeClick: (Int) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(top = 8.dp, bottom = 24.dp)
    ) {
        // ─── Recent Searches ──────────────────────────────────────────
        if (recentSearches.isNotEmpty()) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Búsquedas recientes",
                        color = TextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                    TextButton(
                        onClick = onClearAll,
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                    ) {
                        Text(
                            text = "Borrar todo",
                            color = Primary,
                            fontSize = 13.sp
                        )
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
            }

            items(recentSearches.take(4)) { queryStr ->
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onQuerySelect(queryStr) }
                            .padding(horizontal = 16.dp, vertical = 13.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.History,
                            contentDescription = null,
                            tint = TextTertiary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(14.dp))
                        Text(
                            text = queryStr,
                            color = TextSecondary,
                            fontSize = 14.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(
                            onClick = { onDelete(queryStr) },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Eliminar",
                                tint = TextTertiary,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                    ) {
                        HorizontalDivider(
                            color = Border,
                            thickness = 1.dp
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(20.dp)) }
        }

        // ─── Genre Grid ───────────────────────────────────────────────
        item {
            Text(
                text = "Explorar por género",
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        item {
            androidx.compose.foundation.lazy.grid.LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(
                        56.dp * (genreGridData.size / 2)
                    ),
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                userScrollEnabled = false
            ) {
                items(genreGridData) { genre ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceVariant)
                            .clickable { onQuerySelect(genre.name) }
                            .padding(12.dp)
                    ) {
                        Column {
                            Text(
                                text = genre.name,
                                color = TextPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "${genre.count} anime",
                                color = TextTertiary,
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }

        // ─── Trending Section ─────────────────────────────────────────
        item {
            Text(
                text = "Tendencias de Hoy",
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(trendingMockList) { (id, title, imageUrl) ->
                    Column(
                        modifier = Modifier
                            .width(100.dp)
                            .clickable { onAnimeClick(id) }
                    ) {
                        AsyncImage(
                            model = imageUrl,
                            contentDescription = title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(145.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(SurfaceVariant)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = title,
                            color = TextSecondary,
                            fontSize = 11.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }
    }
}

// ─── Search Results List ───────────────────────────────────────────────────
@Composable
fun SearchResultsList(
    results: List<Anime>,
    onAnimeClick: (Int) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Results count header
        item {
            Text(
                text = "${results.size} resultado${if (results.size != 1) "s" else ""}",
                color = TextTertiary,
                fontSize = 12.sp,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        items(results) { anime ->
            SearchResultCard(
                anime = anime,
                onClick = { onAnimeClick(anime.malId) }
            )
        }
    }
}

@Composable
private fun SearchResultCard(
    anime: Anime,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceVariant)
            .clickable(onClick = onClick)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Poster
        AsyncImage(
            model = anime.imageUrl,
            contentDescription = anime.displayTitle,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .size(width = 56.dp, height = 80.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(SurfaceBright)
        )

        Spacer(modifier = Modifier.width(12.dp))

        // Info column
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = anime.displayTitle,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Genres
            Text(
                text = anime.genres?.joinToString(", ") { it.name } ?: "",
                color = TextSecondary,
                fontSize = 12.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Metadata row
            val metadataParts = mutableListOf<String>()
            anime.year?.let { metadataParts.add(it.toString()) }
            anime.type?.let { metadataParts.add(it) }
            anime.episodes?.let { metadataParts.add("$it eps") }
            Text(
                text = metadataParts.joinToString(" · "),
                color = TextTertiary,
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }

        Spacer(modifier = Modifier.width(8.dp))

        // Score badge
        if (anime.score != null) {
            Box(
                modifier = Modifier
                    .background(
                        color = Accent.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(6.dp)
                    )
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "★ ${anime.score}",
                    color = Accent,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// ─── Error State ───────────────────────────────────────────────────────────
@Composable
private fun ErrorState(
    message: String,
    onRetry: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Outlined.WarningAmber,
                contentDescription = "Error",
                tint = Primary,
                modifier = Modifier.size(40.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = message,
                color = TextSecondary,
                fontSize = 14.sp,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(20.dp))
            OutlinedButton(
                onClick = onRetry,
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, Primary),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = Primary
                )
            ) {
                Text(
                    text = "Reintentar",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

// ─── Empty Results State ───────────────────────────────────────────────────
@Composable
private fun EmptyResultsState(query: String) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(32.dp)
        ) {
            Icon(
                imageVector = Icons.Outlined.SentimentDissatisfied,
                contentDescription = null,
                tint = TextTertiary,
                modifier = Modifier.size(48.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Sin resultados",
                color = TextSecondary,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "No encontramos anime para \"$query\". Intenta con otros términos.",
                color = TextTertiary,
                fontSize = 13.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}
