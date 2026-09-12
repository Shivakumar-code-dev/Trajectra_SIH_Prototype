package com.yit.indoornav.navigation

import com.yit.indoornav.data.model.NavEdge
import com.yit.indoornav.data.model.NavNode
import com.yit.indoornav.data.model.RouteInstruction
import com.yit.indoornav.data.model.RouteResult
import com.yit.indoornav.data.model.RouteSummary
import kotlin.math.sqrt

/**
 * A* Indoor Navigation Engine (Kotlin)
 * =====================================
 * Mirror of the Python A* implementation for offline/client-side route calculation.
 * The app can use either this (offline) or the Flask API (online).
 */
object AStarEngine {

    private const val WALKING_SPEED = 1.2  // m/s
    private const val STAIR_SPEED   = 0.5  // m/s

    data class GraphNode(val id: String, val x: Double, val y: Double, val z: Double,
                         val floorId: String, val type: String, val label: String)

    data class GraphEdge(val from: String, val to: String, val distance: Double,
                         val isFloorTransition: Boolean, val transitionType: String,
                         val isAccessible: Boolean)

    /** Build adjacency map from node/edge lists. */
    fun buildGraph(nodes: List<NavNode>, edges: List<NavEdge>): Map<String, GraphNode> {
        return nodes.associate { n ->
            n.id to GraphNode(n.id, n.x, n.y, n.z, n.floorId, n.type, n.label)
        }
    }

    private fun buildAdjacency(edges: List<NavEdge>, accessibleOnly: Boolean): Map<String, List<GraphEdge>> {
        val adj = mutableMapOf<String, MutableList<GraphEdge>>()
        for (e in edges) {
            if (!e.isWalkable) continue
            if (accessibleOnly && !e.isAccessible) continue
            val ge = GraphEdge(e.startNodeId, e.endNodeId, e.distance, e.isFloorTransition, e.transitionType, e.isAccessible)
            adj.getOrPut(e.startNodeId) { mutableListOf() }.add(ge)
            adj.getOrPut(e.endNodeId)   { mutableListOf() }.add(ge.copy(from=e.endNodeId, to=e.startNodeId))
        }
        return adj
    }

    private fun heuristic(a: GraphNode, b: GraphNode): Double {
        val dx = a.x - b.x; val dy = a.y - b.y; val dz = a.z - b.z
        return sqrt(dx*dx + dy*dy + dz*dz)
    }

    /** A* pathfinding. Returns ordered list of node IDs, or null if no path. */
    fun findPath(
        nodes: List<NavNode>, edges: List<NavEdge>,
        startId: String, goalId: String, accessibleOnly: Boolean = false,
    ): List<String>? {
        val nodeMap = buildGraph(nodes, edges)
        val adj     = buildAdjacency(edges, accessibleOnly)

        val start = nodeMap[startId] ?: return null
        val goal  = nodeMap[goalId]  ?: return null
        if (startId == goalId) return listOf(startId)

        data class State(val f: Double, val id: String) : Comparable<State> {
            override fun compareTo(other: State) = compareValuesBy(this, other, { it.f }, { it.id })
        }

        val openSet   = sortedSetOf(State(heuristic(start, goal), startId))
        val cameFrom  = mutableMapOf<String, String>()
        val gScore    = mutableMapOf(startId to 0.0)
        val closed    = mutableSetOf<String>()

        while (openSet.isNotEmpty()) {
            val current = openSet.first(); openSet.remove(current)
            val cid = current.id
            if (cid in closed) continue
            closed.add(cid)

            if (cid == goalId) {
                val path = mutableListOf<String>()
                var n = goalId
                while (n in cameFrom) { path.add(n); n = cameFrom[n]!! }
                path.add(startId)
                return path.reversed()
            }

            for (e in (adj[cid] ?: emptyList())) {
                if (e.to in closed) continue
                val tg = (gScore[cid] ?: Double.MAX_VALUE) + e.distance
                if (tg < (gScore[e.to] ?: Double.MAX_VALUE)) {
                    cameFrom[e.to] = cid
                    gScore[e.to]   = tg
                    val f = tg + (nodeMap[e.to]?.let { heuristic(it, goal) } ?: 0.0)
                    openSet.add(State(f, e.to))
                }
            }
        }
        return null
    }

    /** Build a full RouteResult from a node path. */
    fun buildRoute(
        path: List<String>,
        nodes: List<NavNode>, edges: List<NavEdge>,
        floors: List<com.yit.indoornav.data.model.Floor>,
    ): RouteResult {
        val nodeMap  = nodes.associateBy { it.id }
        val floorMap = floors.associateBy { it.id }

        if (path.size < 2) {
            return RouteResult(path=path, error="Path too short")
        }

        val pathNodes = path.mapNotNull { nodeMap[it] }
        val instructions = mutableListOf<RouteInstruction>()
        var totalDist = 0.0
        val visitedFloors = mutableListOf<String>()

        instructions.add(RouteInstruction(
            text = "Start from ${pathNodes.first().label.ifEmpty { pathNodes.first().type }}.",
            type = "START",
        ))

        var accumulatedDist = 0.0

        for (i in 0 until pathNodes.size - 1) {
            val a = pathNodes[i]; val b = pathNodes[i + 1]
            val edge = edges.find {
                (it.startNodeId == a.id && it.endNodeId == b.id) ||
                (it.endNodeId == a.id && it.startNodeId == b.id)
            }
            val dist = edge?.distance ?: heuristic(
                GraphNode(a.id,a.x,a.y,a.z,a.floorId,a.type,a.label),
                GraphNode(b.id,b.x,b.y,b.z,b.floorId,b.type,b.label)
            )
            totalDist += dist

            if (!visitedFloors.contains(a.floorId)) visitedFloors.add(a.floorId)

            if (edge?.isFloorTransition == true) {
                if (accumulatedDist > 0) {
                    instructions.add(RouteInstruction(text="Walk straight for ${accumulatedDist.toInt()} m.", type="WALK", distance=accumulatedDist))
                    accumulatedDist = 0.0
                }
                val destFloorName = floorMap[b.floorId]?.name ?: b.floorId
                val tt = edge.transitionType.uppercase()
                instructions.add(RouteInstruction(
                    text = if (tt == "ELEVATOR") "Take the elevator to $destFloorName."
                           else "Take the staircase to $destFloorName.",
                    type = if (tt == "ELEVATOR") "ELEVATOR" else "STAIR",
                    distance = dist,
                    toFloor = b.floorId,
                    toFloorName = destFloorName,
                ))
            } else if (b.type in listOf("DESTINATION","ROOM","LANDMARK")) {
                if (accumulatedDist > 0) {
                    instructions.add(RouteInstruction(text="Walk straight for ${accumulatedDist.toInt()} m.", type="WALK", distance=accumulatedDist))
                    accumulatedDist = 0.0
                }
                val label = b.label.ifEmpty { b.type }
                instructions.add(RouteInstruction(
                    text = "Your destination, $label, is ahead.",
                    type = "DESTINATION_NEAR",
                    distance = dist,
                    nodeId = b.id,
                ))
            } else {
                accumulatedDist += dist
            }
        }

        if (accumulatedDist > 0) {
            instructions.add(RouteInstruction(text="Walk straight for ${accumulatedDist.toInt()} m.", type="WALK", distance=accumulatedDist))
        }

        if (!visitedFloors.contains(pathNodes.last().floorId)) visitedFloors.add(pathNodes.last().floorId)

        val label = pathNodes.last().label.ifEmpty { pathNodes.last().type }
        instructions.add(RouteInstruction(text="You have arrived at $label.", type="ARRIVED"))

        val stairDist = edges.filter { e -> e.isFloorTransition && path.contains(e.startNodeId) }
                              .sumOf { it.distance }
        val walkDist  = totalDist - stairDist
        val estSecs   = (walkDist / WALKING_SPEED + stairDist / STAIR_SPEED).toInt()

        return RouteResult(
            path = path,
            instructions = instructions,
            summary = RouteSummary(
                totalDistance = totalDist,
                estimatedSeconds = estSecs,
                estimatedMinutes = estSecs / 60.0,
                floorCount = visitedFloors.size,
                floors = visitedFloors,
                nodeCount = path.size,
                startNode = path.first(),
                endNode = path.last(),
            ),
        )
    }
}
