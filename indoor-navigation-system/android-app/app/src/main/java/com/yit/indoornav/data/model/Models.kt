package com.yit.indoornav.data.model

import com.google.gson.annotations.SerializedName

// ── Navigation Node ──────────────────────────────────────────────
data class NavNode(
    val id: String = "",
    val floorId: String = "",
    val x: Double = 0.0,
    val y: Double = 0.0,
    val z: Double = 0.0,
    val type: String = "CORRIDOR",   // CORRIDOR|DOOR|ROOM|STAIRCASE|ELEVATOR|ENTRANCE|EXIT|DESTINATION
    val label: String = "",
    val isAccessible: Boolean = true,
    val isActive: Boolean = true,
)

// ── Navigation Edge ──────────────────────────────────────────────
data class NavEdge(
    val id: String = "",
    val startNodeId: String = "",
    val endNodeId: String = "",
    val distance: Double = 1.0,
    val isWalkable: Boolean = true,
    val isAccessible: Boolean = true,
    val isFloorTransition: Boolean = false,
    val transitionType: String = "",  // STAIR | ELEVATOR
    val floorId: String = "",
)

// ── Floor ────────────────────────────────────────────────────────
data class Floor(
    val id: String = "",
    val name: String = "",
    val number: Int = 0,
    val elevation: Double = 0.0,
    val description: String = "",
    val isActive: Boolean = true,
)

// ── Destination ──────────────────────────────────────────────────
data class Destination(
    val id: String = "",
    val name: String = "",
    val floorId: String = "",
    val category: String = "",
    val department: String = "",
    val roomNumber: String = "",
    val description: String = "",
    val nodeId: String = "",
    val imageUrl: String = "",
    val isAccessible: Boolean = true,
    val isActive: Boolean = true,
    val visitCount: Int = 0,
    val coordinates: Coordinates = Coordinates(),
)

data class Coordinates(
    val x: Double = 0.0,
    val y: Double = 0.0,
    val z: Double = 0.0,
)

// ── QR Checkpoint ────────────────────────────────────────────────
data class QRCheckpoint(
    val id: String = "",
    val label: String = "",
    val floorId: String = "",
    val nodeId: String = "",
    val coordinates: Coordinates = Coordinates(),
    val qrData: String = "",
    val isActive: Boolean = true,
)

// ── Route Instruction ────────────────────────────────────────────
data class RouteInstruction(
    val text: String = "",
    val type: String = "WALK",   // START|WALK|TURN|STAIR|ELEVATOR|DESTINATION_NEAR|ARRIVED
    val distance: Double = 0.0,
    val nodeId: String = "",
    val floorId: String = "",
    val toFloor: String = "",
    val toFloorName: String = "",
)

// ── Route Result ─────────────────────────────────────────────────
data class RouteResult(
    val path: List<String> = emptyList(),
    val instructions: List<RouteInstruction> = emptyList(),
    val summary: RouteSummary = RouteSummary(),
    val error: String? = null,
)

data class RouteSummary(
    val totalDistance: Double = 0.0,
    val estimatedSeconds: Int = 0,
    val estimatedMinutes: Double = 0.0,
    val floorCount: Int = 1,
    val floors: List<String> = emptyList(),
    val nodeCount: Int = 0,
    val startNode: String = "",
    val endNode: String = "",
)

// ── User ─────────────────────────────────────────────────────────
data class YITUser(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val role: String = "USER",
    val phone: String = "",
    val avatarUrl: String = "",
    val createdAt: String = "",
)

// ── Published Map ────────────────────────────────────────────────
data class PublishedMap(
    val version: Int = 0,
    val publishedAt: String = "",
    val floors: List<Floor> = emptyList(),
    val destinations: List<Destination> = emptyList(),
    val nodes: List<NavNode> = emptyList(),
    val edges: List<NavEdge> = emptyList(),
    @SerializedName("qr_checkpoints") val qrCheckpoints: List<QRCheckpoint> = emptyList(),
)
