package com.example.anird.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val AniRDColorScheme = darkColorScheme(
    primary = AniRDPrimary,
    onPrimary = AniRDOnPrimary,
    primaryContainer = AniRDPrimaryDim,
    onPrimaryContainer = AniRDTextPrimary,
    secondary = AniRDSurfaceVariant,
    onSecondary = AniRDTextPrimary,
    secondaryContainer = AniRDSurfaceVariant,
    onSecondaryContainer = AniRDTextSecondary,
    tertiary = AniRDAccent,
    onTertiary = AniRDBackground,
    tertiaryContainer = AniRDAccentDim,
    onTertiaryContainer = AniRDBackground,
    background = AniRDBackground,
    onBackground = AniRDTextPrimary,
    surface = AniRDSurface,
    onSurface = AniRDTextPrimary,
    surfaceVariant = AniRDSurfaceVariant,
    onSurfaceVariant = AniRDTextSecondary,
    outline = AniRDBorder,
    outlineVariant = AniRDBorderActive,
    error = AniRDError,
    onError = AniRDBackground,
    errorContainer = Color(0x1AFF3B3B),
    onErrorContainer = AniRDTextPrimary,
    inverseSurface = AniRDSurfaceBright,
    inverseOnSurface = AniRDBackground,
    inversePrimary = AniRDPrimaryDim,
    surfaceTint = AniRDPrimary,
)

@Composable
fun AniRDTheme(
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = AniRDColorScheme,
        typography = Typography,
        content = content
    )
}