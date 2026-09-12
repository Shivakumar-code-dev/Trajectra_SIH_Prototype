"""User management routes (admin only)."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone

user_bp = Blueprint('users', __name__)

def _db():
    from firebase_init import get_firestore
    return get_firestore()


@user_bp.route('/', methods=['GET'])
@verify_admin
def get_users():
    db = _db()
    docs = db.collection('users').limit(100).stream()
    return jsonify({'users': [{'id': d.id, **d.to_dict()} for d in docs]})


@user_bp.route('/<user_id>/role', methods=['PUT'])
@verify_admin
def update_role(user_id):
    data = request.get_json()
    new_role = data.get('role', 'USER')
    if new_role not in ('USER', 'ADMIN', 'SUPER_ADMIN'):
        return jsonify({'error': 'Invalid role'}), 400
    _db().collection('users').document(user_id).update({
        'role': new_role,
        'updatedAt': datetime.now(timezone.utc).isoformat(),
        'updatedBy': g.uid,
    })
    return jsonify({'success': True, 'role': new_role})


@user_bp.route('/<user_id>', methods=['DELETE'])
@verify_admin
def disable_user(user_id):
    _db().collection('users').document(user_id).update({'isActive': False})
    try:
        from firebase_admin import auth
        auth.update_user(user_id, disabled=True)
    except Exception:
        pass
    return jsonify({'success': True})
