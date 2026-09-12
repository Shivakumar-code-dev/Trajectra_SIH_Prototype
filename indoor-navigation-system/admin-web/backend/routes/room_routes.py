"""Room routes — CRUD for rooms."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_token, verify_admin
from datetime import datetime, timezone
import uuid

room_bp = Blueprint('rooms', __name__)


def _db():
    from firebase_init import get_firestore
    return get_firestore()


def _building_id():
    import os
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@room_bp.route('/', methods=['GET'])
def get_rooms():
    """Get all rooms (optionally filtered by floor)."""
    floor_id = request.args.get('floor')
    db = _db()
    query = db.collection('buildings').document(_building_id()).collection('rooms')
    if floor_id:
        query = query.where('floorId', '==', floor_id)
    docs = query.stream()
    rooms = [{'id': d.id, **d.to_dict()} for d in docs]
    return jsonify({'rooms': rooms})


@room_bp.route('/search', methods=['GET'])
def search_rooms():
    """Text search across rooms and destinations."""
    q = request.args.get('q', '').lower()
    db = _db()
    docs = db.collection('buildings').document(_building_id()).collection('rooms').stream()
    results = []
    for d in docs:
        data = d.to_dict()
        name = data.get('name', '').lower()
        dept = data.get('department', '').lower()
        category = data.get('category', '').lower()
        if q in name or q in dept or q in category:
            results.append({'id': d.id, **data})
    return jsonify({'results': results, 'count': len(results)})


@room_bp.route('/<room_id>', methods=['GET'])
def get_room(room_id):
    db = _db()
    doc = db.collection('buildings').document(_building_id()).collection('rooms').document(room_id).get()
    if not doc.exists:
        return jsonify({'error': 'Room not found'}), 404
    return jsonify({'room': {'id': doc.id, **doc.to_dict()}})


@room_bp.route('/', methods=['POST'])
@verify_admin
def create_room():
    data = request.get_json()
    required = ['name', 'floorId']
    if not all(k in data for k in required):
        return jsonify({'error': f'Required fields: {required}'}), 400

    room_id = data.get('id', f"room-{uuid.uuid4().hex[:8]}")
    room_data = {
        'name':         data['name'],
        'floorId':      data['floorId'],
        'roomNumber':   data.get('roomNumber', ''),
        'department':   data.get('department', ''),
        'category':     data.get('category', 'CLASSROOM'),
        'description':  data.get('description', ''),
        'coordinates':  data.get('coordinates', {'x': 0, 'y': 0, 'z': 0}),
        'isAccessible': data.get('isAccessible', True),
        'isActive':     True,
        'imageUrl':     data.get('imageUrl', ''),
        'nodeId':       data.get('nodeId', ''),  # linked navigation node
        'createdAt':    datetime.now(timezone.utc).isoformat(),
        'updatedAt':    datetime.now(timezone.utc).isoformat(),
        'createdBy':    g.uid,
    }

    db = _db()
    db.collection('buildings').document(_building_id()).collection('rooms')\
      .document(room_id).set(room_data)
    return jsonify({'id': room_id, 'room': room_data}), 201


@room_bp.route('/<room_id>', methods=['PUT'])
@verify_admin
def update_room(room_id):
    data = request.get_json()
    allowed = {'name', 'roomNumber', 'department', 'category', 'description',
               'coordinates', 'isAccessible', 'isActive', 'imageUrl', 'nodeId', 'floorId'}
    update = {k: v for k, v in data.items() if k in allowed}
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()
    db = _db()
    db.collection('buildings').document(_building_id()).collection('rooms')\
      .document(room_id).update(update)
    return jsonify({'success': True})


@room_bp.route('/<room_id>', methods=['DELETE'])
@verify_admin
def delete_room(room_id):
    db = _db()
    db.collection('buildings').document(_building_id()).collection('rooms')\
      .document(room_id).update({'isActive': False})
    return jsonify({'success': True})
