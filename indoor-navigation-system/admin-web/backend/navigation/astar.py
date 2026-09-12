"""
A* Indoor Navigation Engine
============================
Implements A* pathfinding on the YIT navigation graph.

Supports:
- Single-floor navigation
- Multi-floor navigation (via staircase / elevator nodes)
- Accessible-only routing
- Distance and time estimation
- Turn-by-turn instruction generation
"""

import math
import heapq
from typing import List, Dict, Optional, Tuple


# ─── Data Structures ─────────────────────────────────────────────────────────

class NavNode:
    def __init__(self, node_id: str, floor_id: str, x: float, y: float, z: float,
                 node_type: str = 'CORRIDOR', label: str = '', is_accessible: bool = True):
        self.id = node_id
        self.floor_id = floor_id
        self.x = x
        self.y = y
        self.z = z
        self.type = node_type
        self.label = label
        self.is_accessible = is_accessible

    def distance_to(self, other: 'NavNode') -> float:
        return math.sqrt((self.x - other.x)**2 + (self.y - other.y)**2 + (self.z - other.z)**2)


class NavEdge:
    def __init__(self, edge_id: str, start_id: str, end_id: str, distance: float,
                 is_walkable: bool = True, is_accessible: bool = True,
                 is_floor_transition: bool = False, transition_type: str = ''):
        self.id = edge_id
        self.start_id = start_id
        self.end_id = end_id
        self.distance = distance
        self.is_walkable = is_walkable
        self.is_accessible = is_accessible
        self.is_floor_transition = is_floor_transition
        self.transition_type = transition_type  # STAIR | ELEVATOR


class NavGraph:
    """Graph of navigation nodes and edges."""

    def __init__(self):
        self.nodes: Dict[str, NavNode] = {}
        self.adjacency: Dict[str, List[Tuple[str, float, NavEdge]]] = {}

    def add_node(self, node: NavNode):
        self.nodes[node.id] = node
        if node.id not in self.adjacency:
            self.adjacency[node.id] = []

    def add_edge(self, edge: NavEdge):
        if not edge.is_walkable:
            return
        if edge.start_id not in self.adjacency:
            self.adjacency[edge.start_id] = []
        if edge.end_id not in self.adjacency:
            self.adjacency[edge.end_id] = []

        self.adjacency[edge.start_id].append((edge.end_id, edge.distance, edge))
        # Bidirectional
        self.adjacency[edge.end_id].append((edge.start_id, edge.distance, edge))

    def load_from_firestore_data(self, nodes_data: list, edges_data: list):
        """Populate graph from Firestore documents."""
        for n in nodes_data:
            if not n.get('isActive', True):
                continue
            node = NavNode(
                node_id=n['id'],
                floor_id=n.get('floorId', ''),
                x=float(n.get('x', 0)),
                y=float(n.get('y', 0)),
                z=float(n.get('z', 0)),
                node_type=n.get('type', 'CORRIDOR'),
                label=n.get('label', ''),
                is_accessible=n.get('isAccessible', True),
            )
            self.add_node(node)

        for e in edges_data:
            edge = NavEdge(
                edge_id=e['id'],
                start_id=e['startNodeId'],
                end_id=e['endNodeId'],
                distance=float(e.get('distance', 1.0)),
                is_walkable=e.get('isWalkable', True),
                is_accessible=e.get('isAccessible', True),
                is_floor_transition=e.get('isFloorTransition', False),
                transition_type=e.get('transitionType', ''),
            )
            self.add_edge(edge)


# ─── A* Algorithm ─────────────────────────────────────────────────────────────

def heuristic(a: NavNode, b: NavNode) -> float:
    """3D Euclidean distance heuristic for A*."""
    return a.distance_to(b)


def astar(graph: NavGraph, start_id: str, goal_id: str,
          accessible_only: bool = False) -> Optional[List[str]]:
    """
    A* pathfinding algorithm.
    Returns ordered list of node IDs from start to goal, or None if no path.
    """
    if start_id not in graph.nodes or goal_id not in graph.nodes:
        return None
    if start_id == goal_id:
        return [start_id]

    start = graph.nodes[start_id]
    goal = graph.nodes[goal_id]

    # Priority queue: (f_score, node_id)
    open_set = [(0.0 + heuristic(start, goal), start_id)]
    came_from: Dict[str, str] = {}
    g_score: Dict[str, float] = {start_id: 0.0}
    f_score: Dict[str, float] = {start_id: heuristic(start, goal)}
    closed_set = set()

    while open_set:
        _, current_id = heapq.heappop(open_set)

        if current_id in closed_set:
            continue
        closed_set.add(current_id)

        if current_id == goal_id:
            # Reconstruct path
            path = []
            node = current_id
            while node in came_from:
                path.append(node)
                node = came_from[node]
            path.append(start_id)
            return list(reversed(path))

        for neighbor_id, edge_distance, edge in graph.adjacency.get(current_id, []):
            if neighbor_id in closed_set:
                continue
            if accessible_only and not edge.is_accessible:
                continue

            tentative_g = g_score[current_id] + edge_distance

            if tentative_g < g_score.get(neighbor_id, float('inf')):
                came_from[neighbor_id] = current_id
                g_score[neighbor_id] = tentative_g
                if neighbor_id in graph.nodes:
                    f = tentative_g + heuristic(graph.nodes[neighbor_id], goal)
                else:
                    f = tentative_g
                f_score[neighbor_id] = f
                heapq.heappush(open_set, (f, neighbor_id))

    return None  # No path found


# ─── Route Builder ────────────────────────────────────────────────────────────

WALKING_SPEED = 1.2   # m/s average walking
STAIR_SPEED = 0.5     # m/s stair traversal


def build_route_result(graph: NavGraph, path: List[str],
                       floors_data: Dict[str, dict]) -> dict:
    """Convert A* path to full route result with instructions."""
    if not path:
        return {'error': 'No path found'}

    nodes = [graph.nodes[nid] for nid in path]
    segments = []
    total_distance = 0.0
    floor_changes = []
    instructions = []

    for i in range(len(nodes) - 1):
        a = nodes[i]
        b = nodes[i + 1]

        # Find edge between them
        edge = None
        for neighbor_id, dist, e in graph.adjacency.get(a.id, []):
            if neighbor_id == b.id:
                edge = e
                break

        dist = a.distance_to(b) if edge is None else edge.distance
        total_distance += dist
        segments.append({
            'from': a.id,
            'to': b.id,
            'fromLabel': a.label or a.type,
            'toLabel': b.label or b.type,
            'fromFloor': a.floor_id,
            'toFloor': b.floor_id,
            'distance': round(dist, 2),
            'type': b.type,
            'isFloorTransition': (edge.is_floor_transition if edge else (a.floor_id != b.floor_id)),
            'transitionType': edge.transition_type if edge else '',
        })

    # Generate turn-by-turn instructions
    instructions = generate_instructions(nodes, segments, floors_data)

    # Calculate time
    stair_distance = sum(s['distance'] for s in segments if s.get('isFloorTransition'))
    walk_distance = total_distance - stair_distance
    estimated_seconds = (walk_distance / WALKING_SPEED) + (stair_distance / STAIR_SPEED)

    # Count floor changes
    visited_floors = []
    for n in nodes:
        if not visited_floors or visited_floors[-1] != n.floor_id:
            visited_floors.append(n.floor_id)

    return {
        'path': path,
        'segments': segments,
        'instructions': instructions,
        'summary': {
            'totalDistance': round(total_distance, 1),
            'estimatedSeconds': int(estimated_seconds),
            'estimatedMinutes': round(estimated_seconds / 60, 1),
            'floorCount': len(visited_floors),
            'floors': visited_floors,
            'nodeCount': len(path),
            'startNode': path[0],
            'endNode': path[-1],
        }
    }


def generate_instructions(nodes: List[NavNode], segments: list,
                           floors_data: Dict[str, dict]) -> List[dict]:
    """Generate human-readable turn-by-turn instructions."""
    instructions = []

    def floor_name(floor_id: str) -> str:
        f = floors_data.get(floor_id, {})
        return f.get('name', floor_id)

    if not segments:
        return [{'text': 'You are already at your destination.', 'type': 'ARRIVED'}]

    # Start instruction
    start = nodes[0]
    instructions.append({
        'text': f'Start from {start.label or start.type}.',
        'type': 'START',
        'nodeId': start.id,
        'floorId': start.floor_id,
        'distance': 0,
    })

    # Group consecutive corridor segments to give "walk straight for X m" instructions
    accumulated = []
    last_type = None

    for i, seg in enumerate(segments):
        node = nodes[i + 1]

        if seg.get('isFloorTransition'):
            # Flush accumulated walking first
            if accumulated:
                dist = sum(s['distance'] for s in accumulated)
                instructions.append({
                    'text': f'Walk straight for {round(dist)} m.',
                    'type': 'WALK',
                    'distance': round(dist, 1),
                    'floorId': accumulated[0]['fromFloor'],
                })
                accumulated = []

            # Transition instruction
            tt = seg.get('transitionType', 'STAIR').upper()
            dest_floor = floor_name(seg['toFloor'])
            if tt == 'ELEVATOR':
                instructions.append({
                    'text': f'Take the elevator to {dest_floor}.',
                    'type': 'ELEVATOR',
                    'toFloor': seg['toFloor'],
                    'toFloorName': dest_floor,
                    'distance': round(seg['distance'], 1),
                })
            else:
                instructions.append({
                    'text': f'Take the staircase to {dest_floor}.',
                    'type': 'STAIR',
                    'toFloor': seg['toFloor'],
                    'toFloorName': dest_floor,
                    'distance': round(seg['distance'], 1),
                })
        elif node.type in ('DOOR', 'ROOM', 'DESTINATION', 'LANDMARK'):
            if accumulated:
                dist = sum(s['distance'] for s in accumulated)
                instructions.append({
                    'text': f'Walk straight for {round(dist)} m.',
                    'type': 'WALK',
                    'distance': round(dist, 1),
                    'floorId': seg['fromFloor'],
                })
                accumulated = []

            label = node.label or node.type.title()
            if node.type == 'DESTINATION':
                instructions.append({
                    'text': f'Your destination, {label}, is on your right.',
                    'type': 'DESTINATION_NEAR',
                    'nodeId': node.id,
                    'floorId': node.floor_id,
                    'distance': round(seg['distance'], 1),
                })
            else:
                instructions.append({
                    'text': f'Pass through {label}.',
                    'type': 'WAYPOINT',
                    'nodeId': node.id,
                    'distance': round(seg['distance'], 1),
                })
        else:
            accumulated.append(seg)

    # Flush any remaining walk segments
    if accumulated:
        dist = sum(s['distance'] for s in accumulated)
        instructions.append({
            'text': f'Walk straight for {round(dist)} m.',
            'type': 'WALK',
            'distance': round(dist, 1),
            'floorId': accumulated[0]['fromFloor'],
        })

    # Arrival
    end = nodes[-1]
    instructions.append({
        'text': f'You have reached your destination: {end.label or end.type}.',
        'type': 'ARRIVED',
        'nodeId': end.id,
        'floorId': end.floor_id,
        'distance': 0,
    })

    return instructions
