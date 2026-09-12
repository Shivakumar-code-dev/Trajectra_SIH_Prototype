"""Navigation routes — route calculation, graph retrieval."""
from flask import Blueprint, request, jsonify
import os
import sys

navigation_bp = Blueprint('navigation', __name__)

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'navigation'))
from astar import NavGraph, astar, build_route_result


def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


def _load_graph(accessible_only: bool = False) -> tuple:
    """Load navigation graph from Firestore."""
    db = _db()
    bid = _bid()

    # Load nodes
    nodes_docs = db.collection('buildings').document(bid).collection('nodes').stream()
    nodes_data = [{'id': d.id, **d.to_dict()} for d in nodes_docs]

    # Load edges
    edges_docs = db.collection('buildings').document(bid).collection('edges').stream()
    edges_data = [{'id': d.id, **d.to_dict()} for d in edges_docs]

    # Load floors for name lookup
    floors_docs = db.collection('buildings').document(bid).collection('floors').stream()
    floors_data = {d.id: d.to_dict() for d in floors_docs}

    graph = NavGraph()
    graph.load_from_firestore_data(nodes_data, edges_data)

    return graph, floors_data


@navigation_bp.route('/graph', methods=['GET'])
def get_graph():
    """Return the full navigation graph (nodes + edges)."""
    db = _db()
    bid = _bid()
    nodes = [{'id': d.id, **d.to_dict()}
             for d in db.collection('buildings').document(bid).collection('nodes').stream()]
    edges = [{'id': d.id, **d.to_dict()}
             for d in db.collection('buildings').document(bid).collection('edges').stream()]
    return jsonify({'nodes': nodes, 'edges': edges})


@navigation_bp.route('/route', methods=['POST'])
def calculate_route():
    """
    Calculate A* route.
    Body: { startNodeId, endNodeId, accessibleOnly? }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body required'}), 400

    start_id = data.get('startNodeId')
    end_id = data.get('endNodeId')
    accessible_only = data.get('accessibleOnly', False)

    if not start_id or not end_id:
        return jsonify({'error': 'startNodeId and endNodeId required'}), 400

    try:
        graph, floors_data = _load_graph(accessible_only)
    except Exception as e:
        return jsonify({'error': 'Failed to load navigation graph', 'detail': str(e)}), 500

    if start_id not in graph.nodes:
        return jsonify({'error': f'Start node not found: {start_id}'}), 404
    if end_id not in graph.nodes:
        return jsonify({'error': f'End node not found: {end_id}'}), 404

    path = astar(graph, start_id, end_id, accessible_only)

    if path is None:
        return jsonify({'error': 'No route found between these locations'}), 404

    result = build_route_result(graph, path, floors_data)
    return jsonify(result)


@navigation_bp.route('/route/by-destination', methods=['POST'])
def route_by_destination():
    """
    Calculate route using destination IDs (looks up nodeId from destination doc).
    Body: { startDestinationId, endDestinationId, accessibleOnly? }
    or:   { startNodeId, endDestinationId, accessibleOnly? }
    """
    data = request.get_json()
    db = _db()
    bid = _bid()

    start_node_id = data.get('startNodeId')
    end_node_id = data.get('endNodeId')

    # Resolve start destination -> node
    if not start_node_id and data.get('startDestinationId'):
        doc = db.collection('buildings').document(bid).collection('destinations')\
                .document(data['startDestinationId']).get()
        if doc.exists:
            start_node_id = doc.to_dict().get('nodeId', '')

    # Resolve end destination -> node
    if not end_node_id and data.get('endDestinationId'):
        doc = db.collection('buildings').document(bid).collection('destinations')\
                .document(data['endDestinationId']).get()
        if doc.exists:
            end_node_id = doc.to_dict().get('nodeId', '')

    if not start_node_id or not end_node_id:
        return jsonify({'error': 'Could not resolve node IDs from destinations'}), 400

    try:
        graph, floors_data = _load_graph()
    except Exception as e:
        return jsonify({'error': 'Failed to load graph', 'detail': str(e)}), 500

    path = astar(graph, start_node_id, end_node_id, data.get('accessibleOnly', False))
    if path is None:
        return jsonify({'error': 'No route found'}), 404

    result = build_route_result(graph, path, floors_data)
    return jsonify(result)
