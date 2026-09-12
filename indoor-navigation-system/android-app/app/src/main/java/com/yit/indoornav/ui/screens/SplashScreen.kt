package com.yit.indoornav.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.yit.indoornav.data.repository.NavigationRepository
import com.yit.indoornav.ui.navigation.Screen
import com.yit.indoornav.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(navController: NavHostController, repo: NavigationRepository) {
    val scale by rememberInfiniteTransition(label = "pulse").animateFloat(
        initialValue = 0.92f, targetValue = 1.08f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "scale"
    )

    LaunchedEffect(Unit) {
        delay(2000)
        if (repo.getCurrentUser() != null) {
            navController.navigate(Screen.Home.route) { popUpTo(Screen.Splash.route) { inclusive=true } }
        } else {
            navController.navigate(Screen.Login.route) { popUpTo(Screen.Splash.route) { inclusive=true } }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BackgroundDark, Color(0xFF1A1A3A)))),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .scale(scale)
                    .background(
                        Brush.linearGradient(listOf(IndigoPrimary, IndigoVariant, CyanAccent)),
                        CircleShape
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Text("🧭", fontSize = 48.sp)
            }

            Spacer(Modifier.height(28.dp))

            Text(
                "YIT IndoorNav",
                fontSize = 32.sp, fontWeight = FontWeight.Bold,
                color = TextPrimary,
            )
            Spacer(Modifier.height(6.dp))
            Text(
                "Yenepoya Institute of Technology",
                fontSize = 14.sp, color = TextSecondary,
            )
            Spacer(Modifier.height(4.dp))
            Text("Moodbidri, Karnataka", fontSize = 12.sp, color = TextMuted)

            Spacer(Modifier.height(48.dp))
            CircularProgressIndicator(color = IndigoPrimary, modifier = Modifier.size(28.dp))
        }
    }
}
