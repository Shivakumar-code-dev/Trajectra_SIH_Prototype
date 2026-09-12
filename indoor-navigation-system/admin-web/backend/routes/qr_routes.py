"""QR Checkpoint routes."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone
import uuid, os

qr_bp = Blueprint('qr', __name__)

def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@qr_bp.route('/', methods=['GET'])
def get_checkpoints():
    db = _db()
    docs = db.collection('buildings').document(_bid()).collection('qr_checkpoints').stream()
    return jsonify({'checkpoints': [{'id': d.id, **d.to_dict()} for d in docs]})


@qr_bp.route('/<checkpoint_id>', methods=['GET'])
def get_checkpoint(checkpoint_id):
    """Scan a QR code — returns location info for positioning."""
    db = _db()
    doc = db.collection('buildings').document(_bid()).collection('qr_checkpoints').document(checkpoint_id).get()
    if not doc.exists:
        return jsonify({'error': 'QR checkpoint not found'}), 404
    data = doc.to_dict()
    return jsonify({
        'checkpoint': {'id': doc.id, **data},
        'location': {
            'nodeId': data.get('nodeId', ''),
            'floorId': data.get('floorId', ''),
            'coordinates': data.get('coordinates', {}),
            'label': data.get('label', ''),
        }
    })


@qr_bp.route('/', methods=['POST'])
@verify_admin
def create_checkpoint():
    data = request.get_json()
    cp_id = data.get('id', f"qr-{uuid.uuid4().hex[:8]}")
    cp_data = {
        'label':       data.get('label', ''),
        'floorId':     data.get('floorId', ''),
        'nodeId':      data.get('nodeId', ''),
        'coordinates': data.get('coordinates', {'x': 0, 'y': 0, 'z': 0}),
        'description': data.get('description', ''),
        'isActive':    True,
        'scanCount':   0,
        'createdAt':   datetime.now(timezone.utc).isoformat(),
        'createdBy':   g.uid,
        'qrData':      f"yit-nav://checkpoint/{cp_id}",
    }
    _db().collection('buildings').document(_bid()).collection('qr_checkpoints').document(cp_id).set(cp_data)
    return jsonify({'id': cp_id, 'checkpoint': cp_data}), 201


@qr_bp.route('/<checkpoint_id>', methods=['PUT'])
@verify_admin
def update_checkpoint(checkpoint_id):
    data = request.get_json()
    allowed = {'label', 'floorId', 'nodeId', 'coordinates', 'description', 'isActive'}
    update = {k: v for k, v in data.items() if k in allowed}
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()
    _db().collection('buildings').document(_bid()).collection('qr_checkpoints').document(checkpoint_id).update(update)
    return jsonify({'success': True})


@qr_bp.route('/<checkpoint_id>', methods=['DELETE'])
@verify_admin
def delete_checkpoint(checkpoint_id):
    _db().collection('buildings').document(_bid()).collection('qr_checkpoints').document(checkpoint_id).update({'isActive': False})
    return jsonify({'success': True})
