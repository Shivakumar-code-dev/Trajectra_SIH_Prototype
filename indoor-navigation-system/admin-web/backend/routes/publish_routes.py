"""Publish workflow — draft → published versioning."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone
import os

publish_bp = Blueprint('publish', __name__)

def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@publish_bp.route('/status', methods=['GET'])
def get_publish_status():
    db = _db()
    doc = db.collection('buildings').document(_bid()).get()
    if not doc.exists:
        return jsonify({'published': False, 'version': 0})
    data = doc.to_dict()
    return jsonify({
        'published': True,
        'version': data.get('publishedVersion', 0),
        'publishedAt': data.get('publishedAt', ''),
        'publishedBy': data.get('publishedBy', ''),
        'draftVersion': data.get('draftVersion', 0),
    })


@publish_bp.route('/publish', methods=['POST'])
@verify_admin
def publish_map():
    """
    Publish current draft map data.
    Snapshots current floors/rooms/destinations/nodes/edges into
    a 'published' sub-collection and increments version number.
    """
    db = _db()
    bid = _bid()
    building_ref = db.collection('buildings').document(bid)

    building_doc = building_ref.get()
    current_version = 0
    if building_doc.exists:
        current_version = building_doc.to_dict().get('publishedVersion', 0)

    new_version = current_version + 1
    now = datetime.now(timezone.utc).isoformat()

    # Snapshot key collections into published_versions
    snapshot = {
        'version': new_version,
        'publishedAt': now,
        'publishedBy': g.uid,
        'floors': [{'id': d.id, **d.to_dict()}
                   for d in building_ref.collection('floors').stream()],
        'rooms': [{'id': d.id, **d.to_dict()}
                  for d in building_ref.collection('rooms').where('isActive', '==', True).stream()],
        'destinations': [{'id': d.id, **d.to_dict()}
                         for d in building_ref.collection('destinations').where('isActive', '==', True).stream()],
        'nodes': [{'id': d.id, **d.to_dict()}
                  for d in building_ref.collection('nodes').where('isActive', '==', True).stream()],
        'edges': [{'id': d.id, **d.to_dict()}
                  for d in building_ref.collection('edges').stream()],
        'qr_checkpoints': [{'id': d.id, **d.to_dict()}
                           for d in building_ref.collection('qr_checkpoints').where('isActive', '==', True).stream()],
    }

    # Save snapshot
    db.collection('published_versions').document(f"{bid}-v{new_version}").set(snapshot)

    # Update building metadata
    building_ref.set({
        'id': bid,
        'name': 'Yenepoya Institute of Technology',
        'location': 'Moodbidri, Karnataka',
        'publishedVersion': new_version,
        'publishedAt': now,
        'publishedBy': g.uid,
        'draftVersion': new_version,
        'updatedAt': now,
    }, merge=True)

    return jsonify({
        'success': True,
        'version': new_version,
        'publishedAt': now,
        'message': f'Map version {new_version} published successfully.'
    })


@publish_bp.route('/latest', methods=['GET'])
def get_latest_published():
    """Mobile app fetches the latest published map data."""
    db = _db()
    building_doc = db.collection('buildings').document(_bid()).get()
    if not building_doc.exists:
        return jsonify({'error': 'No published map found'}), 404

    building_data = building_doc.to_dict()
    version = building_data.get('publishedVersion', 0)
    if version == 0:
        return jsonify({'error': 'Map not yet published'}), 404

    snapshot_doc = db.collection('published_versions').document(f"{_bid()}-v{version}").get()
    if not snapshot_doc.exists:
        return jsonify({'error': 'Published snapshot not found'}), 404

    return jsonify({'data': snapshot_doc.to_dict()})
