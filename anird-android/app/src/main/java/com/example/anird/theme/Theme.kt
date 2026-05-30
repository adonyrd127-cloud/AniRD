package com.example.anird.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val AniRDColorScheme = darkColorScheme(
    primary = AniRDPrimary,
    onPrimary = AniRDOnPrimary,
    primaryContainer = AniRDPrimaryContainer,
    secondary = AniRDSecondary,
    background = AniRDBackground,
    surface = AniRDSurface,
    surfaceVariant = AniRDSurfaceVariant,
    onSurface = AniRDOnSurface,
    onSurfaceVariant = AniRDOnSurfaceVariant,
    outline = AniRDOutline,
    outlineVariant = AniRDOutlineVariant,
    error = AniRDError,
    tertiary = AniRDTertiary
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
