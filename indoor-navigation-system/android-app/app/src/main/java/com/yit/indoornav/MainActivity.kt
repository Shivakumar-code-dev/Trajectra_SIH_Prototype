package com.yit.indoornav

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.yit.indoornav.ui.theme.YITIndoorNavTheme
import com.yit.indoornav.ui.navigation.YITNavGraph

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            YITIndoorNavTheme {
                YITNavGraph()
            }
        }
    }
}
