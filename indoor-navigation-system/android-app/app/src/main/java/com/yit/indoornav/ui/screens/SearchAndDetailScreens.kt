package com.yit.indoornav.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
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
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun SearchScreen(navController: NavHostController, repo: NavigationRepository) {
    val scope = rememberCoroutineScope()
    var query by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<Destination>>(emptyList()) }
    var floors by remember { mutableStateOf<List<Floor>>(emptyList()) }
    var loading by remember { mutableStateOf(false) }
    var searchJob: Job? by remember { mutableStateOf(null) }
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(Unit) {
        floors = repo.getFloors().getOrElse { emptyList() }
        results = repo.getDestinations().getOrElse { emptyList() }
        focusRequester.requestFocus()
    }

    LaunchedEffect(query) {
        searchJob?.cancel()
        if (query.isBlank()) {
            results = repo.getDestinations().getOrElse { emptyList() }
            return@LaunchedEffect
        }
        searchJob = scope.launch {
            delay(250)
            loading = true
            results = repo.searchDestinations(query).getOrElse { emptyList() }
            loading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
    ) {
        // Search bar
        Surface(color = CardDark) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Default.ArrowBack, null, tint = TextSecondary)
                }
                OutlinedTextField(
                    value = query, onValueChange = { query = it },
                    placeholder = { Text("Search destinations…", color = TextMuted) },
                    modifier = Modifier.weight(1f).focusRequester(focusRequester),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Color(0xFF2A2A48),
                        focusedContainerColor = Color(0xFF1E1E35),
                        unfocusedContainerColor = Color(0xFF1E1E35),
                        cursorColor = IndigoPrimary,
                    ),
                    leadingIcon = { Icon(Icons.Default.Search, null, tint = IndigoPrimary) },
                    trailingIcon = {
                        if (query.isNotEmpty()) {
                            IconButton(onClick = { query = "" }) {
                                Icon(Icons.Default.Clear, null, tint = TextMuted)
                            }
                        }
                    },
                    singleLine = true,
                )
            }
        }

        // Results count
        if (query.isNotEmpty()) {
            Text(
                "${results.size} result(s) for \"$query\"",
                fontSize = 12.sp, color = TextMuted,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp),
            )
        } else {
            Text(
                "All destinations",
                fontSize = 14.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
            )
        }

        if (loading) {
            Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = IndigoPrimary)
            }
        } else if (results.isEmpty() && query.isNotEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🔍", fontSize = 48.sp)
                    Spacer(Modifier.height(12.dp))
                    Text("No results for \"$query\"", color = TextSecondary, fontSize = 16.sp)
                    Text("Try a different search term.", color = TextMuted, fontSize = 13.sp)
                }
            }
        } else {
            LazyColumn(contentPadding = PaddingValues(bottom = 16.dp)) {
                items(results) { dest ->
                    DestinationListItem(dest, floors) {
                        navController.navigate(Screen.DestDetail.createRoute(dest.id))
                    }
                }
            }
        }
    }
}

// ─── DESTINATION DETAIL ───────────────────────────────────────────────────────

@Composable
fun DestinationDetailScreen(destId: String, navController: NavHostController, repo: NavigationRepository) {
    val scope = rememberCoroutineScope()
    var dest by remember { mutableStateOf<Destination?>(null) }
    var floors by remember { mutableStateOf<List<Floor>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var showLocationPicker by remember { mutableStateOf(false) }

    LaunchedEffect(destId) {
        scope.launch {
            dest = repo.getDestination(destId).getOrNull()
            floors = repo.getFloors().getOrElse { emptyList() }
            loading = false
        }
    }

    Box(Modifier.fillMaxSize().background(BackgroundDark)) {
        if (loading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = IndigoPrimary)
            }
        } else if (dest == null) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Destination not found.", color = TextSecondary)
            }
        } else {
            val d = dest!!
            val floorName = floors.find { it.id == d.floorId }?.name ?: d.floorId
            val catIcon = mapOf("LAB" to "🔬","CLASSROOM" to "📚","OFFICE" to "🏢","LIBRARY" to "📖",
                                "CANTEEN" to "🍽️","FACILITY" to "🏛️","OTHER" to "📍")

            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
                // Hero header
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .background(Brush.verticalGradient(listOf(Color(0xFF1E1E5A), Color(0xFF0F0F2A))))
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(20.dp),
                        verticalArrangement = Arrangement.SpaceBetween,
                    ) {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Icon(Icons.Default.ArrowBack, null, tint = Color.White)
                        }
                        Column {
                            Text(catIcon[d.category] ?: "📍", fontSize = 40.sp)
                            Spacer(Modifier.height(8.dp))
                            Text(d.name, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text("$floorName · ${d.category}", fontSize = 13.sp, color = CyanAccent)
                        }
                    }
                }

                Column(Modifier.padding(20.dp)) {
                    // Info cards
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        InfoChip("Room", d.roomNumber.ifEmpty { "—" }, Icons.Default.Room, Modifier.weight(1f))
                        InfoChip("Floor", floorName, Icons.Default.Layers, Modifier.weight(1f))
                    }
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        InfoChip("Department", d.department.ifEmpty { "—" }, Icons.Default.Business, Modifier.weight(1f))
                        InfoChip("Access", if (d.isAccessible) "♿ Yes" else "No", Icons.Default.Accessible, Modifier.weight(1f))
                    }

                    if (d.description.isNotEmpty()) {
                        Spacer(Modifier.height(16.dp))
                        Surface(color = CardDark, shape = RoundedCornerShape(14.dp)) {
                            Column(Modifier.padding(16.dp)) {
                                Text("About", fontWeight = FontWeight.SemiBold, color = TextPrimary, fontSize = 14.sp)
                                Spacer(Modifier.height(6.dp))
                                Text(d.description, color = TextSecondary, fontSize = 13.sp, lineHeight = 20.sp)
                            }
                        }
                    }

                    Spacer(Modifier.height(24.dp))

                    // Navigation CTA
                    if (d.nodeId.isNotEmpty()) {
                        Button(
                            onClick = { showLocationPicker = true },
                            modifier = Modifier.fillMaxWidth().height(56.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                            contentPadding = PaddingValues(0.dp),
                        ) {
                            Box(
                                Modifier.fillMaxSize()
                                    .background(Brush.horizontalGradient(listOf(IndigoPrimary, IndigoVariant))),
                                contentAlignment = Alignment.Center,
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Icon(Icons.Default.Navigation, null, tint = Color.White)
                                    Text("Start Navigation", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                }
                            }
                        }

                        Spacer(Modifier.height(10.dp))
                        OutlinedButton(
                            onClick = { navController.navigate(Screen.QRScan.route) },
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            shape = RoundedCornerShape(14.dp),
                            border = BorderStroke(1.dp, IndigoPrimary),
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Icon(Icons.Default.QrCode, null, tint = IndigoPrimary)
                                Text("Scan QR to Set My Location", color = IndigoPrimary, fontSize = 14.sp)
                            }
                        }
                    } else {
                        Surface(color = Color(0x1FF59E0B), shape = RoundedCornerShape(12.dp)) {
                            Text("⚠ Navigation not yet configured for this destination.", color = Color(0xFFF59E0B),
                                 fontSize = 13.sp, modifier = Modifier.padding(14.dp))
                        }
                    }
                }
            }
        }

        // Location Picker Dialog
        if (showLocationPicker) {
            val d = dest
            AlertDialog(
                onDismissRequest = { showLocationPicker = false },
                containerColor = CardDark,
                title = { Text("How do you want to set your location?", color = TextPrimary, fontSize = 16.sp) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Option 1: Scan a QR checkpoint near you.", color = TextSecondary, fontSize = 13.sp)
                        Text("Option 2: Start from the Main Entrance (default).", color = TextSecondary, fontSize = 13.sp)
                    }
                },
                confirmButton = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(onClick = {
                            showLocationPicker = false
                            if (d != null) {
                                navController.navigate(Screen.Navigation.createRoute("n-entrance", d.nodeId, d.name))
                            }
                        }, colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)) {
                            Text("Start from Entrance")
                        }
                        OutlinedButton(onClick = {
                            showLocationPicker = false
                            navController.navigate(Screen.QRScan.route)
                        }, border = BorderStroke(1.dp, CyanAccent)) {
                            Text("Scan QR First", color = CyanAccent)
                        }
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showLocationPicker = false }) {
                        Text("Cancel", color = TextMuted)
                    }
                }
            )
        }
    }
}

@Composable
fun InfoChip(label: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier = Modifier) {
    Surface(color = CardDark, shape = RoundedCornerShape(12.dp), modifier = modifier) {
        Column(Modifier.padding(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, null, tint = IndigoPrimary, modifier = Modifier.size(14.dp))
                Spacer(Modifier.width(4.dp))
                Text(label, fontSize = 10.sp, color = TextMuted, fontWeight = FontWeight.Medium)
            }
            Spacer(Modifier.height(4.dp))
            Text(value, fontSize = 13.sp, color = TextPrimary, fontWeight = FontWeight.SemiBold)
        }
    }
}
