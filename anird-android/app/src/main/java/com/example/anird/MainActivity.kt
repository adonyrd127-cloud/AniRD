package com.example.anird

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.fragment.app.FragmentActivity
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.DateRange
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.rememberNavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.anird.presentation.navigation.AniRDNavHost
import com.example.anird.theme.AniRDTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Deshabilitar barra de título nativa programáticamente antes de inicializar la ventana
        requestWindowFeature(android.view.Window.FEATURE_NO_TITLE)
        actionBar?.hide()
        
        enableEdgeToEdge()
        
        super.onCreate(savedInstanceState)
        
        setContent {
            AniRDTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: "home"

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        // Ocultamos la barra en pantallas secundarias (como Detail o Player)
                        if (currentRoute in listOf("home", "lists", "browse", "simulcasts", "account")) {
                            Column {
                                // Divider superior de 1.dp con OutlineVariant (#2C2F35)
                                HorizontalDivider(
                                    thickness = 1.dp,
                                    color = MaterialTheme.colorScheme.outlineVariant
                                )
                                NavigationBar(
                                    containerColor = MaterialTheme.colorScheme.surface,
                                    tonalElevation = 3.dp,
                                    modifier = Modifier.height(80.dp)
                                ) {
                                    // 1. Home
                                    val homeSelected = currentRoute == "home"
                                    NavigationBarItem(
                                        selected = homeSelected,
                                        alwaysShowLabel = true,
                                        onClick = { 
                                            navController.navigate("home") { 
                                                popUpTo("home") { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true 
                                            } 
                                        },
                                        icon = { 
                                            Icon(
                                                imageVector = if (homeSelected) Icons.Filled.Home else Icons.Outlined.Home,
                                                contentDescription = "Home"
                                            ) 
                                        },
                                        label = { Text("Home", style = MaterialTheme.typography.labelSmall) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            unselectedIconColor = Color(0xFF6B6F78),
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            unselectedTextColor = Color(0xFF6B6F78),
                                            indicatorColor = Color.Transparent // Evita la píldora genérica
                                        )
                                    )
                                    // 2. My Lists
                                    val listsSelected = currentRoute == "lists"
                                    NavigationBarItem(
                                        selected = listsSelected,
                                        alwaysShowLabel = true,
                                        onClick = { 
                                            navController.navigate("lists") { 
                                                popUpTo("home") { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true 
                                            } 
                                        },
                                        icon = { 
                                            Icon(
                                                imageVector = if (listsSelected) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                                contentDescription = "My Lists"
                                            ) 
                                        },
                                        label = { Text("My Lists", style = MaterialTheme.typography.labelSmall) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            unselectedIconColor = Color(0xFF6B6F78),
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            unselectedTextColor = Color(0xFF6B6F78),
                                            indicatorColor = Color.Transparent
                                        )
                                    )
                                    // 3. Browse
                                    val browseSelected = currentRoute == "browse"
                                    NavigationBarItem(
                                        selected = browseSelected,
                                        alwaysShowLabel = true,
                                        onClick = { 
                                            navController.navigate("browse") { 
                                                popUpTo("home") { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true 
                                            } 
                                        },
                                        icon = { 
                                            Icon(
                                                imageVector = if (browseSelected) Icons.Filled.Search else Icons.Outlined.Search,
                                                contentDescription = "Browse"
                                            ) 
                                        },
                                        label = { Text("Browse", style = MaterialTheme.typography.labelSmall) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            unselectedIconColor = Color(0xFF6B6F78),
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            unselectedTextColor = Color(0xFF6B6F78),
                                            indicatorColor = Color.Transparent
                                        )
                                    )
                                    // 4. Simulcasts (Calendario)
                                    val simulcastsSelected = currentRoute == "simulcasts"
                                    NavigationBarItem(
                                        selected = simulcastsSelected,
                                        alwaysShowLabel = true,
                                        onClick = { 
                                            navController.navigate("simulcasts") { 
                                                popUpTo("home") { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true 
                                            } 
                                        },
                                        icon = { 
                                            Icon(
                                                imageVector = if (simulcastsSelected) Icons.Filled.DateRange else Icons.Outlined.DateRange,
                                                contentDescription = "Simulcasts"
                                            ) 
                                        },
                                        label = { Text("Simulcasts", style = MaterialTheme.typography.labelSmall) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            unselectedIconColor = Color(0xFF6B6F78),
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            unselectedTextColor = Color(0xFF6B6F78),
                                            indicatorColor = Color.Transparent
                                        )
                                    )
                                    // 5. Account (Perfil)
                                    val accountSelected = currentRoute == "account"
                                    NavigationBarItem(
                                        selected = accountSelected,
                                        alwaysShowLabel = true,
                                        onClick = { 
                                            navController.navigate("account") { 
                                                popUpTo("home") { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true 
                                            } 
                                        },
                                        icon = { 
                                            Icon(
                                                imageVector = if (accountSelected) Icons.Filled.Person else Icons.Outlined.Person,
                                                contentDescription = "Account"
                                            ) 
                                        },
                                        label = { Text("Account", style = MaterialTheme.typography.labelSmall) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            unselectedIconColor = Color(0xFF6B6F78),
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            unselectedTextColor = Color(0xFF6B6F78),
                                            indicatorColor = Color.Transparent
                                        )
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(bottom = innerPadding.calculateBottomPadding())
                    ) {
                        AniRDNavHost(navController = navController)
                    }
                }
            }
        }
    }
}
