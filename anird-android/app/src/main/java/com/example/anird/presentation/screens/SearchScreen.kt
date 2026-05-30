package com.example.anird.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
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
import com.example.anird.data.model.Anime
import com.example.anird.presentation.viewmodels.SearchUiState
import com.example.anird.presentation.viewmodels.SearchViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    onNavigateToDetail: (Int) -> Unit = {},
    viewModel: SearchViewModel = hiltViewModel()
) {
    val query by viewModel.query.collectAsState()
    val searchState by viewModel.searchState.collectAsState()
    val recentSearches by viewModel.recentSearches.collectAsState()

    var activeSearch by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF141519)) // Background AniRD
    ) {
        // SearchBar Material3 en top, full width, hint "Search anime, episodes..."
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            SearchBar(
                query = query,
                onQueryChange = { viewModel.onQueryChanged(it) },
                onSearch = { 
                    viewModel.performSearch(it)
                    activeSearch = false
                },
                active = activeSearch,
                onActiveChange = { activeSearch = it },
                placeholder = { Text("Search anime, episodes...", color = Color(0xFFA0A3A7)) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Color.LightGray) },
                trailingIcon = {
                    if (query.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onQueryChanged("") }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear", tint = Color.White)
                        }
                    }
                },
                colors = SearchBarDefaults.colors(
                    containerColor = Color(0xFF1E2127),
                    inputFieldColors = TextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = MaterialTheme.colorScheme.primary
                    )
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // Autocomplete / sugerencias de búsqueda debajo del SearchBar cuando está activo
                if (query.isNotEmpty()) {
                    val suggestions = listOf("Attack on Titan", "Demon Slayer", "One Piece", "Jujutsu Kaisen", "Naruto")
                        .filter { it.contains(query, ignoreCase = true) }
                    
                    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                        suggestions.forEach { suggestion ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { 
                                        viewModel.onQueryChanged(suggestion)
                                        viewModel.performSearch(suggestion)
                                        activeSearch = false
                                    }
                                    .padding(vertical = 12.dp)
                            ) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color.Gray)
                                Spacer(modifier = Modifier.width(16.dp))
                                Text(text = suggestion, color = Color.White, fontSize = 14.sp)
                            }
                        }
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            when (val state = searchState) {
                is SearchUiState.Idle -> {
                    // Estado Inicial: Recent Searches (borrables con X) + Trending Now (LazyRow posters)
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
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                    }
                }
                is SearchUiState.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize().padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = state.message, color = Color.Red, fontSize = 14.sp)
                    }
                }
                is SearchUiState.Success -> {
                    // Estado Resultados: LazyColumn agrupada por categorías (Anime, Episodes, Characters)
                    SearchResultsList(
                        results = state.results,
                        onAnimeClick = onNavigateToDetail
                    )
                }
            }
        }
    }
}

@Composable
fun InitialSearchState(
    recentSearches: List<String>,
    onQuerySelect: (String) -> Unit,
    onDelete: (String) -> Unit,
    onClearAll: () -> Unit,
    onAnimeClick: (Int) -> Unit
) {
    Column(modifier = Modifier.fillMaxSize()) {
        // 1. Historial de búsquedas recientes borrables con X
        if (recentSearches.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Búsquedas recientes",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = onClearAll) {
                    Text("Borrar todo", color = MaterialTheme.colorScheme.primary, fontSize = 13.sp)
                }
            }
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 200.dp)
                    .padding(horizontal = 16.dp)
            ) {
                items(recentSearches.take(4)) { queryStr ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onQuerySelect(queryStr) }
                            .padding(vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = queryStr, color = Color(0xFFA0A3A7), fontSize = 14.sp)
                        IconButton(
                            onClick = { onDelete(queryStr) },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Eliminar",
                                tint = Color.Gray,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                    HorizontalDivider(color = Color(0xFF2C2F35))
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }

        // 2. Trending Now (LazyRow posters)
        Text(
            text = "Tendencias de Hoy",
            color = Color.White,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        // Simulación o carga rápida de posters de tendencias
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Posters estáticos reales de tendencias populares
            val trendingMockList = listOf(
                Triple(21, "One Piece", "https://cdn.myanimelist.net/images/anime/1244/138851.jpg"),
                Triple(50631, "Demon Slayer: Hashira Training Arc", "https://cdn.myanimelist.net/images/anime/1908/135431.jpg"),
                Triple(51009, "Jujutsu Kaisen Season 2", "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"),
                Triple(50582, "Chainsaw Man", "https://cdn.myanimelist.net/images/anime/1806/126216.jpg")
            )
            items(trendingMockList) { (id, title, imageUrl) ->
                Column(
                    modifier = Modifier
                        .width(110.dp)
                        .clickable { onAnimeClick(id) }
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF1E2127))
                    ) {
                        AsyncImage(
                            model = imageUrl,
                            contentDescription = title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = title,
                        color = Color(0xFFA0A3A7),
                        fontSize = 12.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun SearchResultsList(
    results: List<Anime>,
    onAnimeClick: (Int) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Grupo: Anime
        item {
            Text(
                text = "Anime",
                color = MaterialTheme.colorScheme.primary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }

        items(results) { anime ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onAnimeClick(anime.malId) }
                    .background(Color(0xFF1E2127), RoundedCornerShape(8.dp))
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = anime.imageUrl,
                    contentDescription = anime.displayTitle,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(width = 60.dp, height = 90.dp)
                        .clip(RoundedCornerShape(6.dp))
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = anime.displayTitle,
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = anime.genres?.joinToString { it.name } ?: "Géneros no disponibles",
                        color = Color(0xFFA0A3A7),
                        fontSize = 12.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}
