package com.yit.indoornav.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.yit.indoornav.ui.screens.*
import com.yit.indoornav.data.repository.NavigationRepository

sealed class Screen(val route: String) {
    object Splash       : Screen("splash")
    object Login        : Screen("login")
    object Register     : Screen("register")
    object ForgotPass   : Screen("forgot_password")
    object Home         : Screen("home")
    object Search       : Screen("search")
    object DestDetail   : Screen("destination/{destId}") {
        fun createRoute(id: String) = "destination/$id"
    }
    object Map3D        : Screen("map_3d")
    object Navigation   : Screen("navigation/{startNodeId}/{endNodeId}/{destName}") {
        fun createRoute(start: String, end: String, name: String) = "navigation/$start/$end/${java.net.URLEncoder.encode(name,"UTF-8")}"
    }
    object QRScan       : Screen("qr_scan")
    object Profile      : Screen("profile")
    object Settings     : Screen("settings")
}

@Composable
fun YITNavGraph() {
    val navController: NavHostController = rememberNavController()
    val repo = NavigationRepository()

    NavHost(navController = navController, startDestination = Screen.Splash.route) {

        composable(Screen.Splash.route) {
            SplashScreen(navController = navController, repo = repo)
        }

        composable(Screen.Login.route) {
            LoginScreen(navController = navController, repo = repo)
        }

        composable(Screen.Register.route) {
            RegisterScreen(navController = navController, repo = repo)
        }

        composable(Screen.ForgotPass.route) {
            ForgotPasswordScreen(navController = navController, repo = repo)
        }

        composable(Screen.Home.route) {
            HomeScreen(navController = navController, repo = repo)
        }

        composable(Screen.Search.route) {
            SearchScreen(navController = navController, repo = repo)
        }

        composable(Screen.DestDetail.route) { backStack ->
            val destId = backStack.arguments?.getString("destId") ?: ""
            DestinationDetailScreen(destId = destId, navController = navController, repo = repo)
        }

        composable(Screen.Map3D.route) {
            Map3DScreen(navController = navController, repo = repo)
        }

        composable(Screen.Navigation.route) { backStack ->
            val startNodeId = backStack.arguments?.getString("startNodeId") ?: ""
            val endNodeId   = backStack.arguments?.getString("endNodeId") ?: ""
            val destName    = backStack.arguments?.getString("destName")?.let {
                java.net.URLDecoder.decode(it, "UTF-8")
            } ?: ""
            NavigationScreen(
                startNodeId = startNodeId,
                endNodeId   = endNodeId,
                destName    = destName,
                navController = navController,
                repo = repo,
            )
        }

        composable(Screen.QRScan.route) {
            QRScanScreen(navController = navController, repo = repo)
        }

        composable(Screen.Profile.route) {
            ProfileScreen(navController = navController, repo = repo)
        }

        composable(Screen.Settings.route) {
            SettingsScreen(navController = navController)
        }
    }
}
