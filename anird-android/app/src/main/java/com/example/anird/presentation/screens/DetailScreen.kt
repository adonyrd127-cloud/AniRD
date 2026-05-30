package com.example.anird.presentation.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.anird.data.local.EpisodeEntity
import com.example.anird.data.model.Anime
import com.example.anird.data.model.AnimeCharacter
import com.example.anird.domain.usecase.ResolvedRelationGroup
import com.example.anird.presentation.viewmodels.DetailUiState
import com.example.anird.presentation.viewmodels.DetailViewModel

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
            .background(MaterialTheme.colorScheme.background) // Fondo principal: #141519
    ) {
        when (val state = uiState) {
            is DetailUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                }
            }
            is DetailUiState.Error -> {
                Box(
                    modifier = Modifier.fillMaxSize().padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Error al cargar la información del anime",
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = state.message,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.loadAnimeDetails(malId) },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Text("Reintentar", color = MaterialTheme.colorScheme.onPrimary)
                        }
                    }
                }
            }
            is DetailUiState.Success -> {
                // SheetMaxWidth: 640.dp y centrado en pantallas anchas
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.TopCenter
                ) {
                    Box(
                        modifier = Modifier
                            .widthIn(max = 640.dp)
                            .fillMaxHeight()
                            .background(MaterialTheme.colorScheme.surface) // Surface: #1E2127
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

@Composable
fun DetailContent(
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
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("Episodios", "Relacionados", "Personajes")
    var isSynopsisExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Drag handle superior (Asa superior estilo BottomSheet)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp, bottom = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(width = 40.dp, height = 4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f))
            )
        }

        // Botón de Volver Atrás discreto
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Volver",
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            // 1. Imagen de Banner (16:9) + Degradado a Surface + Botón "START WATCHING" pill
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(16f / 9f)
                ) {
                    // Banner 16:9
                    AsyncImage(
                        model = anime.bannerUrl ?: anime.imageUrl,
                        contentDescription = "Banner",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    
                    // Overlay degradado desvaneciendo hacia Surface (#1E2127)
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        MaterialTheme.colorScheme.surface.copy(alpha = 0.6f),
                                        MaterialTheme.colorScheme.surface
                                    )
                                )
                            )
                    )

                    // Botón "START WATCHING" pill naranja centrado sobre banner
                    Button(
                        onClick = {
                            if (episodes.isNotEmpty()) {
                                onEpisodeClick(episodes.first().episodeNumber)
                            } else {
                                onEpisodeClick(1)
                            }
                        },
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(top = 16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary, // #F47521 naranja
                            contentColor = MaterialTheme.colorScheme.onPrimary // #000000 negro
                        ),
                        shape = RoundedCornerShape(24.dp),
                        contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.PlayArrow,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onPrimary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "START WATCHING",
                                style = MaterialTheme.typography.titleSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimary
                                )
                            )
                        }
                    }
                }
            }

            // 2. Poster Solapado (-40dp offset) + Info (Título headlineSmall + Rating ★ amarilla + Score + Año + Eps)
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                        .offset(y = (-40).dp),
                    verticalAlignment = Alignment.Bottom
                ) {
                    // Poster 2:3 flotante de 100.dp
                    AsyncImage(
                        model = anime.imageUrl,
                        contentDescription = "Poster",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .width(100.dp)
                            .height(150.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .border(2.dp, MaterialTheme.colorScheme.surface, RoundedCornerShape(8.dp)) // Borde 2.dp Surface
                    )
                    
                    Spacer(modifier = Modifier.width(16.dp))
                    
                    // Info de texto al lado
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .padding(bottom = 4.dp)
                    ) {
                        Text(
                            text = anime.displayTitle,
                            color = MaterialTheme.colorScheme.onSurface,
                            style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                        
                        Spacer(modifier = Modifier.height(6.dp))
                        
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Rating",
                                    tint = Color(0xFFFFD700), // ★ amarilla
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = String.format("%.2f", anime.score ?: 0.0),
                                    color = MaterialTheme.colorScheme.onSurface,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            }
                            
                            Text(
                                text = anime.yearText,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                style = MaterialTheme.typography.bodyMedium
                            )
                            
                            Text(
                                text = "${anime.episodes ?: "?"} eps",
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                }
            }

            // 3. Chips de Géneros (SuggestionChip con fondo SurfaceVariant)
            item {
                val genres = anime.genres ?: emptyList()
                if (genres.isNotEmpty()) {
                    LazyRow(
                        modifier = Modifier
                            .fillMaxWidth()
                            .offset(y = (-30).dp),
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(genres) { genre ->
                            SuggestionChip(
                                onClick = {},
                                label = { 
                                    Text(
                                        text = genre.name, 
                                        style = MaterialTheme.typography.bodySmall,
                                        fontWeight = FontWeight.Medium
                                    ) 
                                },
                                colors = SuggestionChipDefaults.suggestionChipColors(
                                    containerColor = MaterialTheme.colorScheme.surfaceVariant, // Fondo SurfaceVariant: #2C2F35
                                    labelColor = MaterialTheme.colorScheme.onSurface // Texto blanco
                                ),
                                border = null
                            )
                        }
                    }
                }
            }

            // 4. Action icons: Favorite, Add, Share, MoreVert en fila SpaceEvenly
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .offset(y = (-20).dp)
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    DetailActionButton(
                        icon = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        label = "Favorito",
                        tint = if (isFavorite) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
                        onClick = onToggleFavorite
                    )

                    DetailActionButton(
                        icon = if (isFollowing) Icons.Default.Check else Icons.Default.Add,
                        label = "Añadir",
                        tint = if (isFollowing) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
                        onClick = onToggleFollowing
                    )

                    DetailActionButton(
                        icon = Icons.Default.Share,
                        label = "Compartir",
                        tint = MaterialTheme.colorScheme.onSurface,
                        onClick = { /* Compartir */ }
                    )

                    DetailActionButton(
                        icon = Icons.Default.MoreVert,
                        label = "Más",
                        tint = MaterialTheme.colorScheme.onSurface,
                        onClick = { /* Más opciones */ }
                    )
                }
            }

            // 5. Sinopsis: bodyMedium OnSurfaceVariant, max 3 líneas, botón more/less
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .offset(y = (-10).dp)
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = anime.synopsis ?: "Sin sinopsis disponible",
                        color = MaterialTheme.colorScheme.onSurfaceVariant, // #A0A3A7
                        style = MaterialTheme.typography.bodyMedium, // bodyMedium
                        maxLines = if (isSynopsisExpanded) Int.MAX_VALUE else 3,
                        overflow = TextOverflow.Ellipsis
                    )
                    
                    if (anime.synopsis != null && anime.synopsis.length > 150) {
                        Text(
                            text = if (isSynopsisExpanded) "Ver menos" else "Ver más",
                            color = MaterialTheme.colorScheme.primary, // naranja #F47521
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                            modifier = Modifier
                                .clickable { isSynopsisExpanded = !isSynopsisExpanded }
                                .padding(vertical = 4.dp)
                        )
                    }
                }
            }

            // 6. Tabs: Episodes, Related, Characters
            item {
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = Color.Transparent,
                    contentColor = MaterialTheme.colorScheme.primary,
                    indicator = { tabPositions ->
                        TabRowDefaults.SecondaryIndicator(
                            modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                            color = MaterialTheme.colorScheme.primary
                        )
                    },
                    divider = {
                        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant) // #2C2F35
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
                                    fontSize = 14.sp,
                                    color = if (selectedTab == index) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        )
                    }
                }
            }

            // 7. Contenido del Tab Seleccionado
            when (selectedTab) {
                0 -> { // Pestaña: Episodios (EpisodeListItem)
                    if (episodes.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "Buscando episodios disponibles...",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 14.sp
                                )
                            }
                        }
                    } else {
                        items(episodes) { episode ->
                            EpisodeListItem(
                                episode = episode, 
                                onClick = { onEpisodeClick(episode.episodeNumber) }
                            )
                        }
                    }
                }
                1 -> { // Pestaña: Relacionados
                    val relationsWithAnime = relations.filter { it.entries.isNotEmpty() }
                    if (relationsWithAnime.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "No se encontraron obras relacionadas en la franquicia",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 14.sp
                                )
                            }
                        }
                    } else {
                        items(relationsWithAnime) { group ->
                            RelationsSection(group = group)
                        }
                    }
                }
                2 -> { // Pestaña: Personajes
                    if (characters.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "No se encontraron personajes registrados",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 14.sp
                                )
                            }
                        }
                    } else {
                        item {
                            CharactersSection(characters = characters)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DetailActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    tint: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = tint,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun EpisodeListItem(
    episode: EpisodeEntity,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Thumbnail 16:9, 120.dp ancho
        Box(
            modifier = Modifier
                .width(120.dp)
                .aspectRatio(16f / 9f)
                .clip(RoundedCornerShape(6.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant)
        ) {
            if (!episode.thumbnailUrl.isNullOrBlank()) {
                AsyncImage(
                    model = episode.thumbnailUrl,
                    contentDescription = episode.title,
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
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                    )
                }
            }
            
            // Fina progress bar de visualización naranja (2.dp) en el bottom de imagen
            val progress = episode.watchedProgressMs ?: 0L
            val duration = episode.durationSeconds?.toLong()?.times(1000L) ?: 0L
            if (progress > 0L && duration > 0L) {
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .fillMaxWidth()
                        .height(2.dp)
                        .background(Color.Gray.copy(alpha = 0.3f))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(fraction = (progress.toFloat() / duration.toFloat()).coerceIn(0f, 1f))
                            .background(MaterialTheme.colorScheme.primary) // Naranja #F47521
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.width(12.dp))
        
        // Título, duración, badges SUB/DUB grises
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = "Episodio ${episode.episodeNumber}",
                color = MaterialTheme.colorScheme.onSurface,
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = episode.title ?: "Sin título",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                style = MaterialTheme.typography.bodySmall,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "24 min",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp)
                )
                
                // Badges grises SUB/DUB
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(2.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(horizontal = 6.dp, vertical = 1.dp)
                ) {
                    Text(
                        text = "SUB",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    )
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(2.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(horizontal = 6.dp, vertical = 1.dp)
                ) {
                    Text(
                        text = "DUB",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.width(8.dp))
        
        // Botón play circular naranja
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary)
                .clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.PlayArrow,
                contentDescription = "Reproducir",
                tint = MaterialTheme.colorScheme.onPrimary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
fun RelationsSection(group: ResolvedRelationGroup) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Text(
            text = group.relation,
            color = MaterialTheme.colorScheme.primary, // naranja #F47521
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
        )
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(group.entries) { entry ->
                Column(
                    modifier = Modifier.width(90.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(130.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        if (!entry.imageUrl.isNullOrBlank()) {
                            AsyncImage(
                                model = entry.imageUrl,
                                contentDescription = entry.name,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = entry.name,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun CharactersSection(characters: List<AnimeCharacter>) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        items(characters) { chr ->
            chr.character?.let { info ->
                Column(
                    modifier = Modifier.width(80.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    AsyncImage(
                        model = info.images?.jpg?.imageUrl,
                        contentDescription = info.name,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(70.dp)
                            .clip(CircleShape)
                            .border(1.5.dp, MaterialTheme.colorScheme.outline, CircleShape)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = info.name,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = chr.role ?: "Supporting",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 9.sp,
                        maxLines = 1
                    )
                }
            }
        }
    }
}
