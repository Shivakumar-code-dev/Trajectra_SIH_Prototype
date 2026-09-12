package com.yit.indoornav.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// ── Brand Colors ────────────────────────────────────────────────
val IndigoPrimary    = Color(0xFF4F46E5)
val IndigoVariant    = Color(0xFF7C3AED)
val CyanAccent       = Color(0xFF06B6D4)
val EmeraldGreen     = Color(0xFF10B981)
val SurfaceDark      = Color(0xFF16162A)
val BackgroundDark   = Color(0xFF0F0F1A)
val CardDark         = Color(0xFF22223A)
val TextPrimary      = Color(0xFFF0F0FF)
val TextSecondary    = Color(0xFFA0A0C8)
val TextMuted        = Color(0xFF6B6B8A)

private val DarkColorScheme = darkColorScheme(
    primary          = IndigoPrimary,
    onPrimary        = Color.White,
    primaryContainer = Color(0xFF1E1E5A),
    secondary        = IndigoVariant,
    onSecondary      = Color.White,
    tertiary         = CyanAccent,
    background       = BackgroundDark,
    surface          = SurfaceDark,
    onBackground     = TextPrimary,
    onSurface        = TextPrimary,
    surfaceVariant   = CardDark,
    error            = Color(0xFFEF4444),
    onError          = Color.White,
)

@Composable
fun YITIndoorNavTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography  = Typography(),
        content     = content,
    )
}
