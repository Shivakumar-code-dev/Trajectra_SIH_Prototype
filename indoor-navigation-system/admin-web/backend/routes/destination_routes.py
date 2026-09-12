"""Destinations — searchable named locations users navigate to."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone
import uuid, os

destination_bp = Blueprint('destinations', __name__)

def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@destination_bp.route('/', methods=['GET'])
def get_destinations():
    floor_id = request.args.get('floor')
    category = request.args.get('category')
    db = _db()
    q = db.collection('buildings').document(_bid()).collection('destinations')
    if floor_id:
        q = q.where('floorId', '==', floor_id)
    if category:
        q = q.where('category', '==', category)
    docs = q.stream()
    return jsonify({'destinations': [{'id': d.id, **d.to_dict()} for d in docs]})


@destination_bp.route('/search', methods=['GET'])
def search_destinations():
    q_str = request.args.get('q', '').lower()
    db = _db()
    docs = db.collection('buildings').document(_bid()).collection('destinations').stream()
    results = []
    for d in docs:
        data = d.to_dict()
        if not data.get('isActive', True):
            continue
        searchable = ' '.join([
            data.get('name', ''),
            data.get('category', ''),
            data.get('department', ''),
            data.get('description', ''),
            data.get('roomNumber', ''),
        ]).lower()
        if q_str in searchable:
            results.append({'id': d.id, **data})
    return jsonify({'results': results, 'count': len(results)})


@destination_bp.route('/popular', methods=['GET'])
def get_popular():
    limit = int(request.args.get('limit', 8))
    db = _db()
    docs = db.collection('buildings').document(_bid()).collection('destinations')\
             .where('isActive', '==', True).order_by('visitCount', direction='DESCENDING')\
             .limit(limit).stream()
    return jsonify({'destinations': [{'id': d.id, **d.to_dict()} for d in docs]})


@destination_bp.route('/<dest_id>', methods=['GET'])
def get_destination(dest_id):
    db = _db()
    doc = db.collection('buildings').document(_bid()).collection('destinations').document(dest_id).get()
    if not doc.exists:
        return jsonify({'error': 'Destination not found'}), 404
    return jsonify({'destination': {'id': doc.id, **doc.to_dict()}})


@destination_bp.route('/', methods=['POST'])
@verify_admin
def create_destination():
    data = request.get_json()
    required = ['name', 'floorId']
    if not all(k in data for k in required):
        return jsonify({'error': f'Required: {required}'}), 400

    dest_id = data.get('id', f"dest-{uuid.uuid4().hex[:8]}")
    dest_data = {
        'name':        data['name'],
        'floorId':     data['floorId'],
        'roomId':      data.get('roomId', ''),
        'nodeId':      data.get('nodeId', ''),
        'category':    data.get('category', 'ROOM'),
        'department':  data.get('department', ''),
        'roomNumber':  data.get('roomNumber', ''),
        'description': data.get('description', ''),
        'coordinates': data.get('coordinates', {'x': 0, 'y': 0, 'z': 0}),
        'imageUrl':    data.get('imageUrl', ''),
        'isAccessible': data.get('isAccessible', True),
        'isActive':    True,
        'visitCount':  0,
        'createdAt':   datetime.now(timezone.utc).isoformat(),
        'createdBy':   g.uid,
    }
    _db().collection('buildings').document(_bid()).collection('destinations').document(dest_id).set(dest_data)
    return jsonify({'id': dest_id, 'destination': dest_data}), 201


@destination_bp.route('/<dest_id>', methods=['PUT'])
@verify_admin
def update_destination(dest_id):
    data = request.get_json()
    allowed = {'name', 'floorId', 'roomId', 'nodeId', 'category', 'department',
               'roomNumber', 'description', 'coordinates', 'imageUrl', 'isAccessible', 'isActive'}
    update = {k: v for k, v in data.items() if k in allowed}
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()
    _db().collection('buildings').document(_bid()).collection('destinations').document(dest_id).update(update)
    return jsonify({'success': True})


@destination_bp.route('/<dest_id>', methods=['DELETE'])
@verify_admin
def delete_destination(dest_id):
    _db().collection('buildings').document(_bid()).collection('destinations').document(dest_id).update({'isActive': False})
    return jsonify({'success': True})
