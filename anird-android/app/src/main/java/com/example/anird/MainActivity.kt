package com.example.anird

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.DateRange
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.fragment.app.FragmentActivity
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.anird.presentation.navigation.AniRDNavHost
import com.example.anird.theme.AniRDGlassHeavy
import com.example.anird.theme.AniRDBorder
import com.example.anird.theme.AniRDPrimary
import com.example.anird.theme.AniRDTextTertiary
import com.example.anird.theme.AniRDTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        requestWindowFeature(android.view.Window.FEATURE_NO_TITLE)
        actionBar?.hide()

        enableEdgeToEdge()

        super.onCreate(savedInstanceState)

        setContent {
            AniRDTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: "home"

                val isBottomBarVisible = currentRoute in listOf(
                    "home", "lists", "browse", "simulcasts", "account"
                )

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (isBottomBarVisible) {
                            PremiumBottomBar(
                                currentRoute = currentRoute,
                                onNavigate = { route ->
                                    navController.navigate(route) {
                                        popUpTo("home") { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            )
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

@Composable
private fun PremiumBottomBar(
    currentRoute: String,
    onNavigate: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(AniRDGlassHeavy)
            .navigationBarsPadding()
    ) {
        // Gradient divider line: transparent → border → transparent
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(
                    brush = Brush.horizontalGradient(
                        colors = listOf(
                            Color.Transparent,
                            AniRDBorder,
                            Color.Transparent,
                        )
                    )
                )
        )

        NavigationBar(
            containerColor = Color.Transparent,
            tonalElevation = 0.dp,
            modifier = Modifier.height(72.dp),
        ) {
            PremiumNavItem(
                selected = currentRoute == "home",
                onClick = { onNavigate("home") },
                selectedIcon = Icons.Filled.Home,
                unselectedIcon = Icons.Outlined.Home,
                label = "Home",
            )
            PremiumNavItem(
                selected = currentRoute == "lists",
                onClick = { onNavigate("lists") },
                selectedIcon = Icons.Filled.Favorite,
                unselectedIcon = Icons.Outlined.FavoriteBorder,
                label = "Lists",
            )
            PremiumNavItem(
                selected = currentRoute == "browse",
                onClick = { onNavigate("browse") },
                selectedIcon = Icons.Filled.Search,
                unselectedIcon = Icons.Outlined.Search,
                label = "Browse",
            )
            PremiumNavItem(
                selected = currentRoute == "simulcasts",
                onClick = { onNavigate("simulcasts") },
                selectedIcon = Icons.Filled.DateRange,
                unselectedIcon = Icons.Outlined.DateRange,
                label = "Simulcasts",
            )
            PremiumNavItem(
                selected = currentRoute == "account",
                onClick = { onNavigate("account") },
                selectedIcon = Icons.Filled.Person,
                unselectedIcon = Icons.Outlined.Person,
                label = "Account",
            )
        }
    }
}

@Composable
private fun RowScope.PremiumNavItem(
    selected: Boolean,
    onClick: () -> Unit,
    selectedIcon: androidx.compose.ui.graphics.vector.ImageVector,
    unselectedIcon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
) {
    val iconColor by animateColorAsState(
        targetValue = if (selected) AniRDPrimary else AniRDTextTertiary,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "navIconColor",
    )
    val labelColor by animateColorAsState(
        targetValue = if (selected) AniRDPrimary else AniRDTextTertiary,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "navLabelColor",
    )
    val dotScale by animateFloatAsState(
        targetValue = if (selected) 1f else 0f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "navDotScale",
    )

    NavigationBarItem(
        selected = selected,
        alwaysShowLabel = true,
        onClick = onClick,
        icon = {
            Icon(
                imageVector = if (selected) selectedIcon else unselectedIcon,
                contentDescription = label,
                tint = iconColor,
            )
        },
        label = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
            ) {
                Text(
                    text = label,
                    color = labelColor,
                )
                // Dot indicator below label
                Spacer(modifier = Modifier.height(2.dp))
                Box(
                    modifier = Modifier
                        .size(height = 3.dp, width = 3.dp)
                        .clip(androidx.compose.foundation.shape.CircleShape)
                        .background(
                            color = AniRDPrimary.copy(alpha = dotScale),
                        )
                )
            }
        },
        colors = NavigationBarItemDefaults.colors(
            selectedIconColor = Color.Transparent,
            unselectedIconColor = Color.Transparent,
            selectedTextColor = Color.Transparent,
            unselectedTextColor = Color.Transparent,
            indicatorColor = Color.Transparent,
        ),
    )
}