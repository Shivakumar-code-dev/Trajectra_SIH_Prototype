"""
Firebase Admin SDK Initialization
"""
import os
import json
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

load_dotenv()

_firebase_initialized = False


def initialize_firebase():
    global _firebase_initialized
    if _firebase_initialized:
        return

    # Check for service account JSON file first
    service_account_path = os.path.join(os.path.dirname(__file__), 'service-account.json')

    if os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
    else:
        # Build credentials from environment variables
        service_account_info = {
            "type": os.getenv("FIREBASE_TYPE", "service_account"),
            "project_id": os.getenv("FIREBASE_PROJECT_ID", ""),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
            "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
        }

        if not service_account_info["project_id"]:
            print("⚠️  WARNING: Firebase not configured. Using demo mode.")
            print("   Copy service-account.json to admin-web/backend/ OR set FIREBASE_* env vars.")
            _firebase_initialized = True  # Mark as initialized in demo mode
            return

        cred = credentials.Certificate(service_account_info)

    storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "")

    firebase_admin.initialize_app(cred, {
        'storageBucket': storage_bucket
    })

    _firebase_initialized = True
    print(f"✅ Firebase initialized: {os.getenv('FIREBASE_PROJECT_ID', 'demo')}")


def get_firestore():
    """Return Firestore client."""
    from firebase_admin import firestore
    return firestore.client()


def get_storage():
    """Return Firebase Storage bucket."""
    from firebase_admin import storage
    return storage.bucket()


def get_auth():
    """Return Firebase Auth client."""
    from firebase_admin import auth
    return auth
