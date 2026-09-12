"""Door, destination, node, edge, model, navigation, QR, analytics, publish, user routes."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_token, verify_admin
from datetime import datetime, timezone
import uuid, os

# ─── DOORS ────────────────────────────────────────────────────────────────────
door_bp = Blueprint('doors', __name__)

def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@door_bp.route('/', methods=['GET'])
def get_doors():
    floor_id = request.args.get('floor')
    db = _db()
    q = db.collection('buildings').document(_bid()).collection('doors')
    if floor_id:
        q = q.where('floorId', '==', floor_id)
    docs = q.stream()
    return jsonify({'doors': [{'id': d.id, **d.to_dict()} for d in docs]})

@door_bp.route('/', methods=['POST'])
@verify_admin
def create_door():
    data = request.get_json()
    door_id = data.get('id', f"door-{uuid.uuid4().hex[:8]}")
    door_data = {
        'name': data.get('name', ''),
        'floorId': data.get('floorId', ''),
        'roomId': data.get('roomId', ''),
        'nodeId': data.get('nodeId', ''),
        'coordinates': data.get('coordinates', {'x': 0, 'y': 0, 'z': 0}),
        'isAccessible': data.get('isAccessible', True),
        'isActive': True,
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'createdBy': g.uid,
    }
    _db().collection('buildings').document(_bid()).collection('doors').document(door_id).set(door_data)
    return jsonify({'id': door_id, 'door': door_data}), 201

@door_bp.route('/<door_id>', methods=['PUT'])
@verify_admin
def update_door(door_id):
    data = request.get_json()
    allowed = {'name', 'floorId', 'roomId', 'nodeId', 'coordinates', 'isAccessible', 'isActive'}
    update = {k: v for k, v in data.items() if k in allowed}
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()
    _db().collection('buildings').document(_bid()).collection('doors').document(door_id).update(update)
    return jsonify({'success': True})

@door_bp.route('/<door_id>', methods=['DELETE'])
@verify_admin
def delete_door(door_id):
    _db().collection('buildings').document(_bid()).collection('doors').document(door_id).update({'isActive': False})
    return jsonify({'success': True})
