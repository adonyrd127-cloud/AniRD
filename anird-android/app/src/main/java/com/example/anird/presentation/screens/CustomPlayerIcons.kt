package com.example.anird.presentation.screens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp

val IconsDefaultPause: ImageVector
    get() = ImageVector.Builder(
        name = "Pause",
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).apply {
        path(fill = SolidColor(Color.White)) {
            moveTo(6f, 19f)
            horizontalLineTo(10f)
            verticalLineTo(5f)
            horizontalLineTo(6f)
            verticalLineTo(19f)
            close()
            moveTo(14f, 5f)
            verticalLineTo(19f)
            horizontalLineTo(18f)
            verticalLineTo(5f)
            horizontalLineTo(14f)
            close()
        }
    }.build()

val IconsDefaultFastForward: ImageVector
    get() = ImageVector.Builder(
        name = "FastForward",
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).apply {
        path(fill = SolidColor(Color.White)) {
            moveTo(4f, 18f)
            lineTo(12.5f, 12f)
            lineTo(4f, 6f)
            close()
            moveTo(13f, 6f)
            lineTo(13f, 18f)
            lineTo(21.5f, 12f)
            close()
        }
    }.build()

val IconsDefaultFastRewind: ImageVector
    get() = ImageVector.Builder(
        name = "FastRewind",
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).apply {
        path(fill = SolidColor(Color.White)) {
            moveTo(11f, 18f)
            lineTo(11f, 6f)
            lineTo(2.5f, 12f)
            close()
            moveTo(20f, 18f)
            lineTo(20f, 6f)
            lineTo(11.5f, 12f)
            close()
        }
    }.build()
