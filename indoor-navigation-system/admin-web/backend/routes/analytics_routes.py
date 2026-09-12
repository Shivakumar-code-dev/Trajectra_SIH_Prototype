"""Analytics routes."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone
import os

analytics_bp = Blueprint('analytics', __name__)

def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


@analytics_bp.route('/summary', methods=['GET'])
@verify_admin
def get_summary():
    """Return dashboard summary counts."""
    db = _db()
    bid = _bid()
    building_ref = db.collection('buildings').document(bid)

    floors = sum(1 for _ in building_ref.collection('floors').stream())
    rooms = sum(1 for _ in building_ref.collection('rooms').where('isActive', '==', True).stream())
    destinations = sum(1 for _ in building_ref.collection('destinations').where('isActive', '==', True).stream())
    nodes = sum(1 for _ in building_ref.collection('nodes').where('isActive', '==', True).stream())
    edges = sum(1 for _ in building_ref.collection('edges').stream())
    users = sum(1 for _ in db.collection('users').stream())
    sessions = sum(1 for _ in db.collection('navigation_sessions').stream())

    # Active model
    active_models = list(db.collection('models').where('isActive', '==', True).limit(1).stream())
    model_status = active_models[0].to_dict().get('status', 'NONE') if active_models else 'NONE'

    return jsonify({
        'floors': floors,
        'rooms': rooms,
        'destinations': destinations,
        'nodes': nodes,
        'edges': edges,
        'users': users,
        'sessions': sessions,
        'modelStatus': model_status,
    })


@analytics_bp.route('/sessions', methods=['GET'])
@verify_admin
def get_sessions():
    db = _db()
    limit = int(request.args.get('limit', 50))
    docs = list(db.collection('navigation_sessions').order_by('startedAt', direction='DESCENDING').limit(limit).stream())
    return jsonify({'sessions': [{'id': d.id, **d.to_dict()} for d in docs]})


@analytics_bp.route('/sessions', methods=['POST'])
def log_session():
    """Mobile app logs navigation sessions here."""
    data = request.get_json()
    session_data = {
        'userId':          data.get('userId', 'anonymous'),
        'startDestId':     data.get('startDestId', ''),
        'endDestId':       data.get('endDestId', ''),
        'startFloor':      data.get('startFloor', ''),
        'endFloor':        data.get('endFloor', ''),
        'distance':        data.get('distance', 0),
        'duration':        data.get('duration', 0),
        'completed':       data.get('completed', False),
        'startedAt':       data.get('startedAt', datetime.now(timezone.utc).isoformat()),
        'buildingId':      _bid(),
    }
    ref = _db().collection('navigation_sessions').add(session_data)
    return jsonify({'id': ref[1].id}), 201


@analytics_bp.route('/popular-destinations', methods=['GET'])
@verify_admin
def popular_destinations():
    db = _db()
    bid = _bid()
    docs = db.collection('buildings').document(bid).collection('destinations')\
             .where('isActive', '==', True)\
             .order_by('visitCount', direction='DESCENDING')\
             .limit(10).stream()
    return jsonify({'destinations': [{'id': d.id, **d.to_dict()} for d in docs]})
