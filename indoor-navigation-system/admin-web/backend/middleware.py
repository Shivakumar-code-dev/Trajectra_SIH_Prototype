"""
Authentication middleware and utilities.
Verifies Firebase ID tokens for protected routes.
"""
from functools import wraps
from flask import request, jsonify, g
import os


def verify_token(f):
    """Decorator: verify Firebase ID token from Authorization header."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]

        if not token:
            return jsonify({'error': 'Authorization token required'}), 401

        try:
            from firebase_admin import auth
            decoded = auth.verify_id_token(token)
            g.uid = decoded['uid']
            g.email = decoded.get('email', '')
            g.user = decoded
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token', 'detail': str(e)}), 401

        return f(*args, **kwargs)
    return decorated_function


def verify_admin(f):
    """Decorator: verify Firebase ID token AND check admin role in Firestore."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]

        if not token:
            return jsonify({'error': 'Authorization token required'}), 401

        try:
            from firebase_admin import auth
            decoded = auth.verify_id_token(token)
            uid = decoded['uid']
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token'}), 401

        # Verify admin role in Firestore (never trust client claims)
        try:
            from firebase_init import get_firestore
            db = get_firestore()
            user_doc = db.collection('users').document(uid).get()
            if not user_doc.exists:
                return jsonify({'error': 'User not found'}), 403
            user_data = user_doc.to_dict()
            if user_data.get('role') not in ('ADMIN', 'SUPER_ADMIN'):
                return jsonify({'error': 'Admin access required'}), 403
        except Exception as e:
            # Demo mode: allow if Firebase not configured
            if os.getenv('FIREBASE_PROJECT_ID', '') == '':
                pass
            else:
                return jsonify({'error': 'Authorization check failed', 'detail': str(e)}), 500

        g.uid = decoded['uid']
        g.email = decoded.get('email', '')
        g.user = decoded
        return f(*args, **kwargs)
    return decorated_function
