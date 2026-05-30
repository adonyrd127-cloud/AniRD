package com.example.anird.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import androidx.navigation.navDeepLink
import com.example.anird.presentation.screens.*

@Composable
fun AniRDNavHost(
    navController: NavHostController,
    startDestination: String = "home"
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // Bottom Nav destinations
        composable("home") {
            HomeScreen(
                onNavigateToDetail = { malId ->
                    navController.navigate("detail/$malId")
                }
            )
        }
        composable("lists") {
            MyListsScreen(
                onNavigateToDetail = { malId ->
                    navController.navigate("detail/$malId")
                }
            )
        }
        composable("browse") {
            SearchScreen(
                onNavigateToDetail = { malId ->
                    navController.navigate("detail/$malId")
                }
            )
        }
        composable("simulcasts") {
            SimulcastsScreen(
                onNavigateToDetail = { malId ->
                    navController.navigate("detail/$malId")
                }
            )
        }
        composable("account") {
            ProfileScreen()
        }
        
        // Detail
        composable(
            "detail/{malId}",
            arguments = listOf(
                navArgument("malId") { type = NavType.IntType }
            )
        ) { backStackEntry ->
            val malId = backStackEntry.arguments?.getInt("malId") ?: 0
            DetailScreen(
                malId = malId,
                onNavigateToPlayer = { animeId, epNum ->
                    navController.navigate("player/$animeId/$epNum")
                },
                onBackClick = {
                    navController.popBackStack()
                }
            )
        }
        
        // Player
        composable(
            "player/{malId}/{episode}",
            arguments = listOf(
                navArgument("malId") { type = NavType.IntType },
                navArgument("episode") { type = NavType.IntType }
            )
        ) { backStackEntry ->
            val malId = backStackEntry.arguments?.getInt("malId") ?: 0
            val episode = backStackEntry.arguments?.getInt("episode") ?: 1
            PlayerScreen(
                malId = malId,
                episode = episode,
                onBackClick = {
                    navController.popBackStack()
                }
            )
        }
        
        // Deep Links
        composable(
            "favorites",
            deepLinks = listOf(
                navDeepLink { uriPattern = "anird://favorites" }
            )
        ) {
            MyListsScreen(
                initialTab = "favorites",
                onNavigateToDetail = { malId ->
                    navController.navigate("detail/$malId")
                }
            )
        }
        composable(
            "deeplink_search",
            deepLinks = listOf(
                navDeepLink { uriPattern = "anird://search" }
            )
        ) {
            SearchScreen(
                onNavigateToDetail = { malId ->
                    navController.navigate("detail/$malId")
                }
            )
        }
    }
}
