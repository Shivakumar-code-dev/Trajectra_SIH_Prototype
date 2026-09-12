package com.yit.indoornav.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.yit.indoornav.data.model.Destination
import com.yit.indoornav.data.model.Floor
import com.yit.indoornav.data.repository.NavigationRepository
import com.yit.indoornav.ui.navigation.Screen
import com.yit.indoornav.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(navController: NavHostController, repo: NavigationRepository) {
    val scope = rememberCoroutineScope()
    var destinations by remember { mutableStateOf<List<Destination>>(emptyList()) }
    var floors by remember { mutableStateOf<List<Floor>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    val user = repo.getCurrentUser()

    LaunchedEffect(Unit) {
        scope.launch {
            destinations = repo.getPopularDestinations(8).getOrElse { emptyList() }
            floors = repo.getFloors().getOrElse { emptyList() }
            loading = false
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // ── Top bar ────────────────────────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Brush.verticalGradient(listOf(Color(0xFF1A1A3A), BackgroundDark)))
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column {
                            Text("YIT Campus", fontSize = 12.sp, color = CyanAccent, fontWeight = FontWeight.SemiBold)
                            Text("Where to go?", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            IconButton(onClick = { navController.navigate(Screen.QRScan.route) }) {
                                Icon(Icons.Default.QrCodeScanner, "Scan QR", tint = TextSecondary)
                            }
                            IconButton(onClick = { navController.navigate(Screen.Profile.route) }) {
                                Box(
                                    Modifier.size(36.dp)
                                        .clip(CircleShape)
                                        .background(Brush.linearGradient(listOf(IndigoPrimary,IndigoVariant))),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Text(
                                        (user?.email?.firstOrNull() ?: 'U').uppercaseChar().toString(),
                                        color = Color.White, fontWeight = FontWeight.Bold,
                                    )
                                }
                            }
                        }
                    }

                    Spacer(Modifier.height(16.dp))

                    // Search bar
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { navController.navigate(Screen.Search.route) },
                        shape = RoundedCornerShape(14.dp),
                        color = CardDark,
                        tonalElevation = 2.dp,
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal=16.dp, vertical=14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Icon(Icons.Default.Search, null, tint = IndigoPrimary, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(10.dp))
                            Text("Search rooms, labs, offices…", color = TextMuted, fontSize = 15.sp)
                        }
                    }
                }
            }

            // ── Content ────────────────────────────────────────────
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 20.dp),
            ) {
                // Quick action chips
                item {
                    Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                        Text("Quick Navigation", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                        Spacer(Modifier.height(12.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(
                                listOf("CS Lab 1" to "🔬", "Library" to "📖",
                                       "Canteen" to "🍽️", "Auditorium" to "🎭",
                                       "HOD CSE" to "🏢", "Seminar Hall" to "📢")
                            ) { (label, icon) ->
                                QuickChip(label, icon) {
                                    navController.navigate(Screen.Search.route)
                                }
                            }
                        }
                    }
                }

                // 3D Map Preview card
                item {
                    Spacer(Modifier.height(4.dp))
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp)
                            .clickable { navController.navigate(Screen.Map3D.route) },
                        shape = RoundedCornerShape(18.dp),
                        color = Color(0xFF1A1A3A),
                        border = BorderStroke(1.dp, Color(0xFF2A2A50)),
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(150.dp)
                                .background(Brush.linearGradient(
                                    listOf(Color(0xFF1E1E5A), Color(0xFF0F0F3A), Color(0xFF161630))
                                )),
                        ) {
                            Column(
                                modifier = Modifier.padding(20.dp).fillMaxSize(),
                                verticalArrangement = Arrangement.SpaceBetween,
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Map, null, tint = CyanAccent)
                                    Spacer(Modifier.width(8.dp))
                                    Text("3D Campus Map", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 16.sp)
                                }
                                Text("YIT — 4 Floors · 18 Rooms · Interactive", color = TextSecondary, fontSize = 12.sp)
                                Surface(color = IndigoPrimary, shape = RoundedCornerShape(8.dp)) {
                                    Text("Open Map →", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold,
                                         modifier = Modifier.padding(horizontal=12.dp, vertical=6.dp))
                                }
                            }
                            // Decorative grid lines
                            Box(modifier = Modifier.fillMaxSize()) {
                                (0..4).forEach { i ->
                                    Divider(
                                        modifier = Modifier.width(1.dp).fillMaxHeight()
                                            .align(Alignment.CenterStart).offset(x = (i * 40 + 100).dp),
                                        color = Color(0x10FFFFFF)
                                    )
                                }
                            }
                        }
                    }
                }

                // Popular destinations
                item {
                    Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Text("Popular Places", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                            TextButton(onClick = { navController.navigate(Screen.Search.route) }) {
                                Text("See all →", color = CyanAccent, fontSize = 13.sp)
                            }
                        }
                    }
                }

                if (loading) {
                    item {
                        Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = IndigoPrimary)
                        }
                    }
                } else {
                    items(destinations) { dest ->
                        DestinationListItem(dest, floors) {
                            navController.navigate(Screen.DestDetail.createRoute(dest.id))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun QuickChip(label: String, icon: String, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        color = CardDark,
        border = BorderStroke(1.dp, Color(0xFF2A2A50)),
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(icon, fontSize = 22.sp)
            Spacer(Modifier.height(4.dp))
            Text(label, fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun DestinationListItem(dest: Destination, floors: List<Floor>, onClick: () -> Unit) {
    val catIcon = mapOf("LAB" to "🔬","CLASSROOM" to "📚","OFFICE" to "🏢","LIBRARY" to "📖",
                        "CANTEEN" to "🍽️","FACILITY" to "🏛️","OTHER" to "📍")
    val floorName = floors.find { it.id == dest.floorId }?.name ?: dest.floorId

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 4.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(14.dp),
        color = CardDark,
        border = BorderStroke(1.dp, Color(0xFF1E1E3A)),
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier.size(46.dp).clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF1E1E5A)),
                contentAlignment = Alignment.Center,
            ) { Text(catIcon[dest.category] ?: "📍", fontSize = 22.sp) }

            Spacer(Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(dest.name, fontWeight = FontWeight.SemiBold, color = TextPrimary, fontSize = 15.sp)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(floorName, fontSize = 12.sp, color = TextSecondary)
                    Text(" · ", fontSize = 12.sp, color = TextMuted)
                    Text(dest.category, fontSize = 12.sp, color = CyanAccent)
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Icon(Icons.Default.ChevronRight, null, tint = TextMuted, modifier = Modifier.size(20.dp))
                if (dest.visitCount > 0) {
                    Text("${dest.visitCount} visits", fontSize = 10.sp, color = TextMuted)
                }
            }
        }
    }
}
