package com.yit.indoornav.ui.screens

import androidx.compose.animation.*
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
import com.yit.indoornav.data.model.*
import com.yit.indoornav.data.repository.NavigationRepository
import com.yit.indoornav.navigation.AStarEngine
import com.yit.indoornav.ui.navigation.Screen
import com.yit.indoornav.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun NavigationScreen(
    startNodeId: String,
    endNodeId: String,
    destName: String,
    navController: NavHostController,
    repo: NavigationRepository,
) {
    val scope = rememberCoroutineScope()
    var route by remember { mutableStateOf<RouteResult?>(null) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf("") }
    var currentStep by remember { mutableStateOf(0) }
    var arrived by remember { mutableStateOf(false) }
    var showMap by remember { mutableStateOf(true) }
    var floors by remember { mutableStateOf<List<Floor>>(emptyList()) }

    LaunchedEffect(startNodeId, endNodeId) {
        scope.launch {
            floors = repo.getFloors().getOrElse { emptyList() }
            val (nodes, edges) = repo.getNavigationGraph().getOrElse { Pair(emptyList(), emptyList()) }
            val path = AStarEngine.findPath(nodes, edges, startNodeId, endNodeId)
            if (path == null) {
                error = "No route found. Make sure the navigation graph is connected."
                loading = false
            } else {
                route = AStarEngine.buildRoute(path, nodes, edges, floors)
                loading = false
            }
        }
    }

    Box(Modifier.fillMaxSize().background(BackgroundDark)) {
        if (loading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(color = IndigoPrimary)
                    Spacer(Modifier.height(16.dp))
                    Text("Calculating best route…", color = TextSecondary)
                    Text("A* algorithm running", color = TextMuted, fontSize = 12.sp)
                }
            }
        } else if (error.isNotEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                    Text("🚫", fontSize = 48.sp)
                    Spacer(Modifier.height(12.dp))
                    Text("Route Not Found", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 18.sp)
                    Spacer(Modifier.height(8.dp))
                    Text(error, color = TextSecondary, fontSize = 13.sp)
                    Spacer(Modifier.height(20.dp))
                    Button(onClick = { navController.popBackStack() },
                           colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)) {
                        Text("Go Back")
                    }
                }
            }
        } else if (arrived) {
            ArrivedScreen(destName, route?.summary) {
                navController.navigate(Screen.Home.route) { popUpTo(Screen.Home.route) { inclusive = true } }
            }
        } else {
            val r = route ?: return@Box
            val instructions = r.instructions
            val currentInstr = instructions.getOrNull(currentStep)

            Column(Modifier.fillMaxSize()) {
                // ── Top destination bar ────────────────────────────────
                Surface(color = Color(0xFF1A1A3A)) {
                    Column(Modifier.fillMaxWidth().padding(16.dp)) {
                        Row(
                            Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Navigating to", fontSize = 12.sp, color = CyanAccent)
                                Text(destName, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            }
                            IconButton(onClick = { navController.popBackStack() }) {
                                Icon(Icons.Default.Close, null, tint = TextSecondary)
                            }
                        }
                        Spacer(Modifier.height(8.dp))
                        // Progress bar
                        val progress = (currentStep.toFloat() / instructions.size.coerceAtLeast(1))
                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)),
                            color = IndigoPrimary,
                            trackColor = Color(0xFF2A2A48),
                        )
                        Spacer(Modifier.height(4.dp))
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("${(progress * 100).toInt()}% complete", fontSize = 11.sp, color = TextMuted)
                            Text("${r.summary.totalDistance.toInt()}m · ${r.summary.estimatedMinutes.toInt()} min", fontSize = 11.sp, color = TextMuted)
                        }
                    }
                }

                // ── Map / Camera toggle ───────────────────────────────
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    FilterChip(selected = showMap, onClick = { showMap = true },
                               label = { Text("3D Map") }, leadingIcon = { Text("🗺") })
                    FilterChip(selected = !showMap, onClick = { showMap = false },
                               label = { Text("Camera AR") }, leadingIcon = { Text("📷") })
                }

                // ── Main view area ────────────────────────────────────
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(horizontal = 16.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF1A1A3A)),
                    contentAlignment = Alignment.Center,
                ) {
                    if (showMap) {
                        // 3D Map placeholder (WebView with Three.js in production)
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("🗺️", fontSize = 48.sp)
                            Spacer(Modifier.height(12.dp))
                            Text("Campus Map", color = TextPrimary, fontWeight = FontWeight.SemiBold)
                            Text("Floor: ${floors.find { it.id == currentInstr?.floorId }?.name ?: ""}",
                                 color = CyanAccent, fontSize = 13.sp)
                            Spacer(Modifier.height(8.dp))
                            Text("Route: ${r.path.size} waypoints", color = TextMuted, fontSize = 12.sp)
                        }
                    } else {
                        // Camera-Assisted Navigation UI
                        CameraNavigationOverlay(currentInstr)
                    }
                }

                // ── Current instruction card ──────────────────────────
                Surface(
                    color = CardDark,
                    shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
                ) {
                    Column(Modifier.fillMaxWidth().padding(20.dp)) {
                        if (currentInstr != null) {
                            InstructionCard(currentInstr)
                        }

                        Spacer(Modifier.height(16.dp))

                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            // Previous step
                            OutlinedButton(
                                onClick = { if (currentStep > 0) currentStep-- },
                                enabled = currentStep > 0,
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp),
                                border = BorderStroke(1.dp, Color(0xFF2A2A50)),
                            ) {
                                Text("← Prev", color = TextSecondary)
                            }

                            // Next step / arrive
                            Button(
                                onClick = {
                                    if (currentStep >= instructions.size - 1) arrived = true
                                    else currentStep++
                                },
                                modifier = Modifier.weight(2f),
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                            ) {
                                Text(if (currentStep >= instructions.size - 1) "I've Arrived ✓" else "Next Step →",
                                     fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(Modifier.height(8.dp))
                        Text("Step ${currentStep + 1} of ${instructions.size}", color = TextMuted, fontSize = 12.sp,
                             modifier = Modifier.align(Alignment.CenterHorizontally))
                    }
                }
            }
        }
    }
}

@Composable
fun InstructionCard(instr: RouteInstruction) {
    val typeIcon = mapOf(
        "START" to "🚶", "WALK" to "→", "STAIR" to "🪜",
        "ELEVATOR" to "🛗", "DESTINATION_NEAR" to "📍", "ARRIVED" to "✅",
        "TURN" to "↩", "WAYPOINT" to "·",
    )
    val typeColor = mapOf(
        "START" to IndigoPrimary, "WALK" to CyanAccent, "STAIR" to Color(0xFFFBBF24),
        "ELEVATOR" to Color(0xFFA78BFA), "DESTINATION_NEAR" to EmeraldGreen,
        "ARRIVED" to EmeraldGreen, "TURN" to Color(0xFFF97316),
    )

    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier.size(52.dp).clip(CircleShape)
                .background(typeColor[instr.type]?.copy(alpha = 0.15f) ?: Color(0x1F4F46E5)),
            contentAlignment = Alignment.Center,
        ) {
            Text(typeIcon[instr.type] ?: "→", fontSize = 24.sp)
        }
        Spacer(Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                instr.text,
                fontSize = 17.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary,
                lineHeight = 24.sp,
            )
            if (instr.distance > 0) {
                Text("${instr.distance.toInt()} m", fontSize = 13.sp, color = TextMuted)
            }
            if (instr.toFloorName.isNotEmpty()) {
                Surface(color = Color(0x1FFBBF24), shape = RoundedCornerShape(6.dp)) {
                    Text("Floor: ${instr.toFloorName}", fontSize = 11.sp, color = Color(0xFFFBBF24),
                         fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                }
            }
        }
    }
}

@Composable
fun CameraNavigationOverlay(instr: RouteInstruction?) {
    // Camera-assisted navigation UI overlay
    // Production: Replace Box background with CameraX PreviewView via AndroidView
    Box(
        Modifier.fillMaxSize()
            .background(Color(0xFF050510)),
        contentAlignment = Alignment.Center,
    ) {
        // Simulated camera feed background
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("📷", fontSize = 36.sp)
            Text("Camera View", color = Color(0x80FFFFFF), fontSize = 13.sp)
            Text("(Point camera to navigate)", color = Color(0x50FFFFFF), fontSize = 11.sp)
        }

        // Direction overlay
        if (instr != null) {
            Column(
                modifier = Modifier.align(Alignment.TopCenter).padding(top = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                // Big direction arrow
                Surface(
                    color = IndigoPrimary.copy(alpha = 0.85f),
                    shape = CircleShape,
                ) {
                    Text(
                        when (instr.type) {
                            "WALK" -> "↑"
                            "STAIR" -> "🪜"
                            "ELEVATOR" -> "🛗"
                            "ARRIVED" -> "✅"
                            else -> "↑"
                        },
                        fontSize = 40.sp,
                        modifier = Modifier.padding(20.dp),
                    )
                }
                Spacer(Modifier.height(8.dp))
                Surface(color = Color(0xCC000000), shape = RoundedCornerShape(12.dp)) {
                    Text(
                        instr.text,
                        color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    )
                }
                if (instr.distance > 0) {
                    Spacer(Modifier.height(4.dp))
                    Surface(color = Color(0x99000000), shape = RoundedCornerShape(8.dp)) {
                        Text(
                            "${instr.distance.toInt()} m",
                            color = CyanAccent, fontWeight = FontWeight.Bold, fontSize = 20.sp,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ArrivedScreen(destName: String, summary: RouteSummary?, onDone: () -> Unit) {
    Box(
        Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFF0A1A0F), BackgroundDark))),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Text("✅", fontSize = 72.sp)
            Spacer(Modifier.height(20.dp))
            Text("Destination Reached!", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = EmeraldGreen)
            Spacer(Modifier.height(8.dp))
            Text(destName, fontSize = 20.sp, color = TextPrimary, fontWeight = FontWeight.Medium)

            if (summary != null) {
                Spacer(Modifier.height(28.dp))
                Surface(color = CardDark, shape = RoundedCornerShape(18.dp)) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        horizontalArrangement = Arrangement.spacedBy(24.dp),
                    ) {
                        SummaryItem("${summary.totalDistance.toInt()}m", "Distance")
                        SummaryItem("${summary.estimatedMinutes.toInt()} min", "Time")
                        SummaryItem("${summary.floorCount}", "Floors")
                    }
                }
            }

            Spacer(Modifier.height(32.dp))
            Button(
                onClick = onDone,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen),
            ) {
                Text("Navigate Again", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
            }
        }
    }
}

@Composable
fun SummaryItem(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text(label, fontSize = 12.sp, color = TextMuted)
    }
}
