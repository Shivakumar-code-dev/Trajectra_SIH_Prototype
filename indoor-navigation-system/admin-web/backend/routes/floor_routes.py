"""Floor routes — CRUD for building floors."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_token, verify_admin
from datetime import datetime, timezone
import uuid

floor_bp = Blueprint('floors', __name__)


def _db():
    from firebase_init import get_firestore
    return get_firestore()


def _building_id():
    import os
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@floor_bp.route('/', methods=['GET'])
def get_floors():
    """Public: Get all published floors."""
    db = _db()
    docs = db.collection('buildings').document(_building_id()).collection('floors')\
             .order_by('number').stream()
    floors = [{'id': d.id, **d.to_dict()} for d in docs]
    return jsonify({'floors': floors})


@floor_bp.route('/<floor_id>', methods=['GET'])
def get_floor(floor_id):
    db = _db()
    doc = db.collection('buildings').document(_building_id()).collection('floors').document(floor_id).get()
    if not doc.exists:
        return jsonify({'error': 'Floor not found'}), 404
    return jsonify({'floor': {'id': doc.id, **doc.to_dict()}})


@floor_bp.route('/', methods=['POST'])
@verify_admin
def create_floor():
    data = request.get_json()
    required = ['name', 'number']
    if not all(k in data for k in required):
        return jsonify({'error': f'Required fields: {required}'}), 400

    floor_id = data.get('id', f"floor-{data['number']}")
    floor_data = {
        'name':       data['name'],
        'number':     data['number'],
        'elevation':  data.get('elevation', data['number'] * 3.5),  # 3.5m per floor
        'description': data.get('description', ''),
        'isActive':   data.get('isActive', True),
        'modelUrl':   data.get('modelUrl', ''),
        'createdAt':  datetime.now(timezone.utc).isoformat(),
        'updatedAt':  datetime.now(timezone.utc).isoformat(),
        'createdBy':  g.uid,
    }

    db = _db()
    db.collection('buildings').document(_building_id()).collection('floors')\
      .document(floor_id).set(floor_data)

    return jsonify({'id': floor_id, 'floor': floor_data}), 201


@floor_bp.route('/<floor_id>', methods=['PUT'])
@verify_admin
def update_floor(floor_id):
    data = request.get_json()
    allowed = {'name', 'number', 'elevation', 'description', 'isActive', 'modelUrl'}
    update = {k: v for k, v in data.items() if k in allowed}
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()

    db = _db()
    db.collection('buildings').document(_building_id()).collection('floors')\
      .document(floor_id).update(update)
    return jsonify({'success': True, 'id': floor_id})


@floor_bp.route('/<floor_id>', methods=['DELETE'])
@verify_admin
def delete_floor(floor_id):
    db = _db()
    db.collection('buildings').document(_building_id()).collection('floors')\
      .document(floor_id).update({'isActive': False, 'deletedAt': datetime.now(timezone.utc).isoformat()})
    return jsonify({'success': True})
