"""
Application Configuration
"""
import os


class Config:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-change-in-production')
    DEBUG = False
    TESTING = False
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500 MB max upload

    # Firebase
    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID', '')
    FIREBASE_STORAGE_BUCKET = os.getenv('FIREBASE_STORAGE_BUCKET', '')

    # Upload folder (local temp before Firebase Storage)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_MODEL_EXTENSIONS = {'glb', 'gltf', 'obj', 'fbx', 'skp', 'dae', '3ds'}
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'svg'}

    # Walking speed for time estimation (m/s)
    WALKING_SPEED_MS = 1.2   # average walking speed
    STAIR_SPEED_MS = 0.5     # stair traversal speed

    # Building config
    DEFAULT_BUILDING_ID = os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    DEBUG = True
