"""Navigation Graph — Node and Edge routes."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone
import uuid, os

node_bp = Blueprint('nodes', __name__)
edge_bp = Blueprint('edges', __name__)


def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


# ─── NODES ────────────────────────────────────────────────────────────────────

@node_bp.route('/', methods=['GET'])
def get_nodes():
    floor_id = request.args.get('floor')
    db = _db()
    q = db.collection('buildings').document(_bid()).collection('nodes')
    if floor_id:
        q = q.where('floorId', '==', floor_id)
    docs = q.stream()
    return jsonify({'nodes': [{'id': d.id, **d.to_dict()} for d in docs]})


@node_bp.route('/', methods=['POST'])
@verify_admin
def create_node():
    data = request.get_json()
    required = ['floorId', 'x', 'y', 'z']
    if not all(k in data for k in required):
        return jsonify({'error': f'Required: {required}'}), 400

    node_id = data.get('id', f"node-{uuid.uuid4().hex[:8]}")
    node_data = {
        'floorId':      data['floorId'],
        'x':            float(data['x']),
        'y':            float(data['y']),
        'z':            float(data['z']),
        'type':         data.get('type', 'CORRIDOR'),   # CORRIDOR|DOOR|ROOM|STAIRCASE|ELEVATOR|ENTRANCE|EXIT|DESTINATION|LANDMARK
        'label':        data.get('label', ''),
        'isAccessible': data.get('isAccessible', True),
        'isActive':     True,
        'createdAt':    datetime.now(timezone.utc).isoformat(),
        'createdBy':    g.uid,
    }
    _db().collection('buildings').document(_bid()).collection('nodes').document(node_id).set(node_data)
    return jsonify({'id': node_id, 'node': node_data}), 201


@node_bp.route('/batch', methods=['POST'])
@verify_admin
def create_nodes_batch():
    """Create multiple nodes at once (graph editor bulk save)."""
    data = request.get_json()
    nodes = data.get('nodes', [])
    db = _db()
    created = []
    batch = db.batch()
    for n in nodes:
        node_id = n.get('id', f"node-{uuid.uuid4().hex[:8]}")
        node_data = {
            'floorId': n['floorId'], 'x': float(n['x']), 'y': float(n['y']), 'z': float(n['z']),
            'type': n.get('type', 'CORRIDOR'), 'label': n.get('label', ''),
            'isAccessible': n.get('isAccessible', True), 'isActive': True,
            'createdAt': datetime.now(timezone.utc).isoformat(), 'createdBy': g.uid,
        }
        ref = _db().collection('buildings').document(_bid()).collection('nodes').document(node_id)
        batch.set(ref, node_data)
        created.append({'id': node_id, **node_data})
    batch.commit()
    return jsonify({'created': created, 'count': len(created)}), 201


@node_bp.route('/<node_id>', methods=['PUT'])
@verify_admin
def update_node(node_id):
    data = request.get_json()
    allowed = {'floorId', 'x', 'y', 'z', 'type', 'label', 'isAccessible', 'isActive'}
    update = {k: v for k, v in data.items() if k in allowed}
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()
    _db().collection('buildings').document(_bid()).collection('nodes').document(node_id).update(update)
    return jsonify({'success': True})


@node_bp.route('/<node_id>', methods=['DELETE'])
@verify_admin
def delete_node(node_id):
    _db().collection('buildings').document(_bid()).collection('nodes').document(node_id).update({'isActive': False})
    return jsonify({'success': True})


# ─── EDGES ────────────────────────────────────────────────────────────────────

@edge_bp.route('/', methods=['GET'])
def get_edges():
    floor_id = request.args.get('floor')
    db = _db()
    q = db.collection('buildings').document(_bid()).collection('edges')
    if floor_id:
        q = q.where('floorId', '==', floor_id)
    docs = q.stream()
    return jsonify({'edges': [{'id': d.id, **d.to_dict()} for d in docs]})


@edge_bp.route('/', methods=['POST'])
@verify_admin
def create_edge():
    data = request.get_json()
    required = ['startNodeId', 'endNodeId']
    if not all(k in data for k in required):
        return jsonify({'error': f'Required: {required}'}), 400

    edge_id = data.get('id', f"edge-{uuid.uuid4().hex[:8]}")
    edge_data = {
        'startNodeId':    data['startNodeId'],
        'endNodeId':      data['endNodeId'],
        'distance':       float(data.get('distance', 1.0)),
        'isWalkable':     data.get('isWalkable', True),
        'isAccessible':   data.get('isAccessible', True),
        'isFloorTransition': data.get('isFloorTransition', False),
        'transitionType': data.get('transitionType', ''),    # STAIR|ELEVATOR
        'floorId':        data.get('floorId', ''),
        'createdAt':      datetime.now(timezone.utc).isoformat(),
        'createdBy':      g.uid,
    }
    _db().collection('buildings').document(_bid()).collection('edges').document(edge_id).set(edge_data)
    return jsonify({'id': edge_id, 'edge': edge_data}), 201


@edge_bp.route('/batch', methods=['POST'])
@verify_admin
def create_edges_batch():
    data = request.get_json()
    edges = data.get('edges', [])
    db = _db()
    batch = db.batch()
    created = []
    for e in edges:
        edge_id = e.get('id', f"edge-{uuid.uuid4().hex[:8]}")
        edge_data = {
            'startNodeId': e['startNodeId'], 'endNodeId': e['endNodeId'],
            'distance': float(e.get('distance', 1.0)),
            'isWalkable': e.get('isWalkable', True),
            'isAccessible': e.get('isAccessible', True),
            'isFloorTransition': e.get('isFloorTransition', False),
            'transitionType': e.get('transitionType', ''),
            'floorId': e.get('floorId', ''),
            'createdAt': datetime.now(timezone.utc).isoformat(),
            'createdBy': g.uid,
        }
        ref = _db().collection('buildings').document(_bid()).collection('edges').document(edge_id)
        batch.set(ref, edge_data)
        created.append({'id': edge_id, **edge_data})
    batch.commit()
    return jsonify({'created': created, 'count': len(created)}), 201


@edge_bp.route('/<edge_id>', methods=['DELETE'])
@verify_admin
def delete_edge(edge_id):
    _db().collection('buildings').document(_bid()).collection('edges').document(edge_id).delete()
    return jsonify({'success': True})
