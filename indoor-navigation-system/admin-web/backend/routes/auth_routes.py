"""Auth routes — login verification, password reset, profile."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/verify', methods=['POST'])
@verify_token
def verify():
    """Verify a Firebase ID token and return user profile."""
    try:
        from firebase_init import get_firestore
        db = get_firestore()
        user_doc = db.collection('users').document(g.uid).get()
        if user_doc.exists:
            return jsonify({'user': user_doc.to_dict(), 'verified': True})
        return jsonify({'verified': True, 'user': {'uid': g.uid, 'email': g.email}})
    except Exception as e:
        return jsonify({'verified': True, 'user': {'uid': g.uid, 'email': g.email}})


@auth_bp.route('/profile', methods=['GET'])
@verify_token
def get_profile():
    from firebase_init import get_firestore
    db = get_firestore()
    doc = db.collection('users').document(g.uid).get()
    if doc.exists:
        return jsonify({'profile': doc.to_dict()})
    return jsonify({'error': 'Profile not found'}), 404


@auth_bp.route('/profile', methods=['PUT'])
@verify_token
def update_profile():
    data = request.get_json()
    allowed = {'name', 'phone', 'avatarUrl'}
    update = {k: v for k, v in data.items() if k in allowed}
    from firebase_init import get_firestore
    from datetime import datetime, timezone
    update['updatedAt'] = datetime.now(timezone.utc).isoformat()
    db = get_firestore()
    db.collection('users').document(g.uid).update(update)
    return jsonify({'success': True})
