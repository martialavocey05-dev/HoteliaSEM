"""
HoteliaSEM Database Configuration and Initialization
SQLAlchemy setup with SQL Server support
"""
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# Initialize extensions (will be bound to app in app.py)
db = SQLAlchemy()
bcrypt = Bcrypt()


def init_db(app):
    """Initialize database with the Flask app"""
    db.init_app(app)
    bcrypt.init_app(app)
    
    with app.app_context():
        # Import all models to register them with SQLAlchemy
        from models.user import User
        from models.hotel import Hotel
        from models.room import Room
        from models.booking import Booking
        from models.transaction import Transaction
        from models.audit_log import AuditLog
        
        # Create tables if they don't exist (in development only)
        # In production, use proper migrations with Alembic
        if app.config['ENV'] == 'development':
            db.create_all()
            print("[v0] Database tables created/verified successfully")
