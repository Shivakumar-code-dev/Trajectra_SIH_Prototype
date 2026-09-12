package com.yit.indoornav.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.yit.indoornav.data.model.*
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

/**
 * Main data repository — single source of truth for the app.
 * Uses Firestore as primary source with local cache fallback.
 */
class NavigationRepository {

    private val auth: FirebaseAuth = Firebase.auth
    private val db: FirebaseFirestore = Firebase.firestore
    private val BUILDING_ID = "yit-moodbidri-main"

    // ── Auth ──────────────────────────────────────────────────────
    suspend fun registerUser(name: String, email: String, password: String): Result<YITUser> {
        return try {
            val cred = auth.createUserWithEmailAndPassword(email, password).await()
            val uid  = cred.user!!.uid
            val user = YITUser(uid=uid, name=name, email=email, role="USER", createdAt=System.currentTimeMillis().toString())
            db.collection("users").document(uid).set(user).await()
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loginUser(email: String, password: String): Result<YITUser> {
        return try {
            val cred = auth.signInWithEmailAndPassword(email, password).await()
            val uid  = cred.user!!.uid
            val snap = db.collection("users").document(uid).get().await()
            val user = snap.toObject(YITUser::class.java) ?: YITUser(uid=uid, email=email)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun resetPassword(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun logout() = auth.signOut()

    fun getCurrentUser() = auth.currentUser

    suspend fun getUserProfile(uid: String): Result<YITUser> {
        return try {
            val snap = db.collection("users").document(uid).get().await()
            val user = snap.toObject(YITUser::class.java) ?: YITUser(uid=uid)
            Result.success(user)
        } catch (e: Exception) { Result.failure(e) }
    }

    // ── Published Map ─────────────────────────────────────────────
    suspend fun getPublishedMap(): Result<PublishedMap> {
        return try {
            val buildingSnap = db.collection("buildings").document(BUILDING_ID).get().await()
            val version = (buildingSnap.get("publishedVersion") as? Long)?.toInt() ?: 0
            if (version == 0) return Result.failure(Exception("Map not yet published"))

            val snap = db.collection("published_versions")
                .document("$BUILDING_ID-v$version").get().await()

            if (!snap.exists()) return Result.failure(Exception("Published snapshot not found"))

            // Parse manually due to nested generics
            val map = PublishedMap(
                version = version,
                publishedAt = snap.getString("publishedAt") ?: "",
                floors = parseFloors(snap.get("floors")),
                destinations = parseDestinations(snap.get("destinations")),
                nodes = parseNodes(snap.get("nodes")),
                edges = parseEdges(snap.get("edges")),
                qrCheckpoints = parseQRCheckpoints(snap.get("qr_checkpoints")),
            )
            Result.success(map)
        } catch (e: Exception) { Result.failure(e) }
    }

    // ── Live Firestore queries ─────────────────────────────────────
    suspend fun getFloors(): Result<List<Floor>> {
        return try {
            val snap = db.collection("buildings").document(BUILDING_ID)
                .collection("floors").orderBy("number").get().await()
            val floors = snap.documents.mapNotNull { it.toObject(Floor::class.java)?.copy(id=it.id) }
            Result.success(floors)
        } catch (e: Exception) { Result.failure(e) }
    }

    suspend fun getDestinations(): Result<List<Destination>> {
        return try {
            val snap = db.collection("buildings").document(BUILDING_ID)
                .collection("destinations")
                .whereEqualTo("isActive", true).get().await()
            val dests = snap.documents.mapNotNull { it.toObject(Destination::class.java)?.copy(id=it.id) }
            Result.success(dests)
        } catch (e: Exception) { Result.failure(e) }
    }

    suspend fun searchDestinations(query: String): Result<List<Destination>> {
        return try {
            val all = getDestinations().getOrThrow()
            val q = query.lowercase()
            val results = all.filter { d ->
                d.name.lowercase().contains(q) ||
                d.department.lowercase().contains(q) ||
                d.category.lowercase().contains(q) ||
                d.roomNumber.lowercase().contains(q) ||
                d.description.lowercase().contains(q)
            }
            Result.success(results)
        } catch (e: Exception) { Result.failure(e) }
    }

    suspend fun getPopularDestinations(limit: Int = 8): Result<List<Destination>> {
        return try {
            val snap = db.collection("buildings").document(BUILDING_ID)
                .collection("destinations")
                .whereEqualTo("isActive", true)
                .orderBy("visitCount", com.google.firebase.firestore.Query.Direction.DESCENDING)
                .limit(limit.toLong()).get().await()
            val dests = snap.documents.mapNotNull { it.toObject(Destination::class.java)?.copy(id=it.id) }
            Result.success(dests)
        } catch (e: Exception) { Result.failure(e) }
    }

    suspend fun getDestination(id: String): Result<Destination> {
        return try {
            val snap = db.collection("buildings").document(BUILDING_ID)
                .collection("destinations").document(id).get().await()
            val dest = snap.toObject(Destination::class.java)?.copy(id=snap.id)
                ?: return Result.failure(Exception("Destination not found"))
            // Increment visit count
            db.collection("buildings").document(BUILDING_ID)
                .collection("destinations").document(id)
                .update("visitCount", com.google.firebase.firestore.FieldValue.increment(1))
            Result.success(dest)
        } catch (e: Exception) { Result.failure(e) }
    }

    // ── Navigation Graph ──────────────────────────────────────────
    suspend fun getNavigationGraph(): Result<Pair<List<NavNode>, List<NavEdge>>> {
        return try {
            val nodesSnap = db.collection("buildings").document(BUILDING_ID)
                .collection("nodes").whereEqualTo("isActive", true).get().await()
            val nodes = nodesSnap.documents.mapNotNull { it.toObject(NavNode::class.java)?.copy(id=it.id) }

            val edgesSnap = db.collection("buildings").document(BUILDING_ID)
                .collection("edges").get().await()
            val edges = edgesSnap.documents.mapNotNull { it.toObject(NavEdge::class.java)?.copy(id=it.id) }

            Result.success(Pair(nodes, edges))
        } catch (e: Exception) { Result.failure(e) }
    }

    // ── QR Checkpoints ────────────────────────────────────────────
    suspend fun getQRCheckpoint(checkpointId: String): Result<QRCheckpoint> {
        return try {
            val snap = db.collection("buildings").document(BUILDING_ID)
                .collection("qr_checkpoints").document(checkpointId).get().await()
            if (!snap.exists()) return Result.failure(Exception("QR checkpoint not found"))
            val cp = snap.toObject(QRCheckpoint::class.java)?.copy(id=snap.id)
                ?: return Result.failure(Exception("Invalid QR data"))
            // Increment scan count
            db.collection("buildings").document(BUILDING_ID)
                .collection("qr_checkpoints").document(checkpointId)
                .update("scanCount", com.google.firebase.firestore.FieldValue.increment(1))
            Result.success(cp)
        } catch (e: Exception) { Result.failure(e) }
    }

    // ── Analytics ─────────────────────────────────────────────────
    suspend fun logNavigationSession(
        startDestId: String, endDestId: String,
        startFloor: String, endFloor: String,
        distance: Double, duration: Long, completed: Boolean,
    ) {
        try {
            val uid = auth.currentUser?.uid ?: "anonymous"
            val session = hashMapOf(
                "userId" to uid,
                "startDestId" to startDestId,
                "endDestId" to endDestId,
                "startFloor" to startFloor,
                "endFloor" to endFloor,
                "distance" to distance,
                "duration" to duration,
                "completed" to completed,
                "startedAt" to com.google.firebase.Timestamp.now(),
                "buildingId" to BUILDING_ID,
            )
            db.collection("navigation_sessions").add(session).await()
        } catch (_: Exception) { /* Non-critical, silently fail */ }
    }

    // ── Parse helpers ─────────────────────────────────────────────
    @Suppress("UNCHECKED_CAST")
    private fun parseFloors(raw: Any?): List<Floor> {
        val list = raw as? List<Map<String, Any>> ?: return emptyList()
        return list.map { m ->
            Floor(
                id = m["id"] as? String ?: "",
                name = m["name"] as? String ?: "",
                number = (m["number"] as? Long)?.toInt() ?: 0,
                elevation = (m["elevation"] as? Double) ?: 0.0,
                description = m["description"] as? String ?: "",
                isActive = m["isActive"] as? Boolean ?: true,
            )
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun parseDestinations(raw: Any?): List<Destination> {
        val list = raw as? List<Map<String, Any>> ?: return emptyList()
        return list.map { m ->
            Destination(
                id = m["id"] as? String ?: "",
                name = m["name"] as? String ?: "",
                floorId = m["floorId"] as? String ?: "",
                category = m["category"] as? String ?: "",
                department = m["department"] as? String ?: "",
                roomNumber = m["roomNumber"] as? String ?: "",
                description = m["description"] as? String ?: "",
                nodeId = m["nodeId"] as? String ?: "",
                visitCount = (m["visitCount"] as? Long)?.toInt() ?: 0,
                isActive = m["isActive"] as? Boolean ?: true,
            )
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun parseNodes(raw: Any?): List<NavNode> {
        val list = raw as? List<Map<String, Any>> ?: return emptyList()
        return list.map { m ->
            NavNode(
                id = m["id"] as? String ?: "",
                floorId = m["floorId"] as? String ?: "",
                x = (m["x"] as? Double) ?: 0.0,
                y = (m["y"] as? Double) ?: 0.0,
                z = (m["z"] as? Double) ?: 0.0,
                type = m["type"] as? String ?: "CORRIDOR",
                label = m["label"] as? String ?: "",
                isAccessible = m["isAccessible"] as? Boolean ?: true,
            )
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun parseEdges(raw: Any?): List<NavEdge> {
        val list = raw as? List<Map<String, Any>> ?: return emptyList()
        return list.map { m ->
            NavEdge(
                id = m["id"] as? String ?: "",
                startNodeId = m["startNodeId"] as? String ?: "",
                endNodeId = m["endNodeId"] as? String ?: "",
                distance = (m["distance"] as? Double) ?: 1.0,
                isWalkable = m["isWalkable"] as? Boolean ?: true,
                isFloorTransition = m["isFloorTransition"] as? Boolean ?: false,
                transitionType = m["transitionType"] as? String ?: "",
            )
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun parseQRCheckpoints(raw: Any?): List<QRCheckpoint> {
        val list = raw as? List<Map<String, Any>> ?: return emptyList()
        return list.map { m ->
            QRCheckpoint(
                id = m["id"] as? String ?: "",
                label = m["label"] as? String ?: "",
                floorId = m["floorId"] as? String ?: "",
                nodeId = m["nodeId"] as? String ?: "",
                qrData = m["qrData"] as? String ?: "",
                isActive = m["isActive"] as? Boolean ?: true,
            )
        }
    }
}
