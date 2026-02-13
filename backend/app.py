"""
HoteliaSEM Flask Application
Main application entry point with authentication and RBAC
"""
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config_dict
import os

# Initialize extensions
jwt = JWTManager()


def create_app(config_name=None):
    """Application factory pattern"""
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app.config.from_object(config_dict[config_name])
    
    # Initialize extensions
    jwt.init_app(app)
    
    # Configure CORS
    CORS(app, 
         origins=app.config['CORS_ORIGINS'],
         supports_credentials=app.config['CORS_SUPPORTS_CREDENTIALS'],
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Initialize database
    from database import init_db
    init_db(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.hotels import hotels_bp
    from routes.bookings import bookings_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(hotels_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(admin_bp)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error': 'Token has expired',
            'message': 'Please log in again'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'error': 'Invalid token',
            'message': 'Authentication token is invalid'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'error': 'Authorization required',
            'message': 'Please provide a valid authentication token'
        }), 401
    
    # Root endpoint
    @app.route('/')
    def index():
        return jsonify({
            'name': 'HoteliaSEM API',
            'version': '1.0.0',
            'description': 'Hotel booking platform with role-based access control',
            'endpoints': {
                'auth': '/api/auth',
                'hotels': '/api/hotels',
                'bookings': '/api/bookings',
                'admin': '/api/admin'
            },
            'roles': ['client', 'hotelier', 'admin']
        }), 200
    
    # Health check endpoint
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'}), 200
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    print(f"[v0] HoteliaSEM API initialized in {config_name} mode")
    
    return app


# Create application instance
app = create_app()


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )
