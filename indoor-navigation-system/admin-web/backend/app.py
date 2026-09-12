"""
Smart Indoor Navigation System — Flask Application Entry Point
Yenepoya Institute of Technology, Moodbidri
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from config import Config
from firebase_init import initialize_firebase
from routes.auth_routes import auth_bp
from routes.floor_routes import floor_bp
from routes.room_routes import room_bp
from routes.door_routes import door_bp
from routes.destination_routes import destination_bp
from routes.node_routes import node_bp
from routes.edge_routes import edge_bp
from routes.model_routes import model_bp
from routes.navigation_routes import navigation_bp
from routes.qr_routes import qr_bp
from routes.analytics_routes import analytics_bp
from routes.publish_routes import publish_bp
from routes.user_routes import user_bp

# Load environment variables
load_dotenv()

def create_app(config_class=Config):
    app = Flask(__name__,
                static_folder='../frontend',
                template_folder='../frontend')

    app.config.from_object(config_class)

    # CORS — allow admin web frontend
    CORS(app, origins=["http://localhost:5000", "http://127.0.0.1:5000",
                        "http://localhost:3000", "http://localhost:8080"],
         supports_credentials=True)

    # Initialize Firebase Admin SDK
    initialize_firebase()

    # Register blueprints
    app.register_blueprint(auth_bp,        url_prefix='/api/auth')
    app.register_blueprint(floor_bp,       url_prefix='/api/floors')
    app.register_blueprint(room_bp,        url_prefix='/api/rooms')
    app.register_blueprint(door_bp,        url_prefix='/api/doors')
    app.register_blueprint(destination_bp, url_prefix='/api/destinations')
    app.register_blueprint(node_bp,        url_prefix='/api/nodes')
    app.register_blueprint(edge_bp,        url_prefix='/api/edges')
    app.register_blueprint(model_bp,       url_prefix='/api/models')
    app.register_blueprint(navigation_bp,  url_prefix='/api/navigation')
    app.register_blueprint(qr_bp,          url_prefix='/api/qr')
    app.register_blueprint(analytics_bp,   url_prefix='/api/analytics')
    app.register_blueprint(publish_bp,     url_prefix='/api/publish')
    app.register_blueprint(user_bp,        url_prefix='/api/users')

    # Health check
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'ok',
            'service': 'YIT Indoor Navigation API',
            'version': '1.0.0'
        })

    # Serve admin frontend
    @app.route('/')
    @app.route('/<path:path>')
    def serve_frontend(path='index.html'):
        from flask import send_from_directory
        frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend')
        if path and os.path.exists(os.path.join(frontend_dir, path)):
            return send_from_directory(frontend_dir, path)
        return send_from_directory(frontend_dir, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    print(f"🚀 YIT Indoor Navigation API running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
