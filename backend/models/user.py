"""
User Model for HoteliaSEM
Supports three role types: client, hotelier, admin
"""
from datetime import datetime
from database import db, bcrypt
from sqlalchemy import CheckConstraint


class User(db.Model):
    """User account with role-based access control"""
    
    __tablename__ = 'users'
    
    # Primary fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    avatar_url = db.Column(db.String(500))
    
    # Role and status
    user_type = db.Column(db.String(20), nullable=False, default='client', index=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)
    
    # Timestamps
    last_login_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    hotels = db.relationship('Hotel', backref='owner', lazy='dynamic', cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    audit_logs = db.relationship('AuditLog', backref='user', lazy='dynamic')
    
    # Table constraints
    __table_args__ = (
        CheckConstraint("user_type IN ('client', 'hotelier', 'admin')", name='ck_user_type'),
    )
    
    def __init__(self, email, password, full_name, user_type='client', phone=None):
        """Initialize user with hashed password"""
        self.email = email.lower().strip()
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self.full_name = full_name
        self.user_type = user_type
        self.phone = phone
    
    def check_password(self, password):
        """Verify password against hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login_at = datetime.utcnow()
        db.session.commit()
    
    def has_role(self, *roles):
        """Check if user has any of the specified roles"""
        return self.user_type in roles
    
    def is_admin(self):
        """Check if user is admin"""
        return self.user_type == 'admin'
    
    def is_hotelier(self):
        """Check if user is hotelier"""
        return self.user_type == 'hotelier'
    
    def is_client(self):
        """Check if user is client"""
        return self.user_type == 'client'
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary (exclude password by default)"""
        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'avatar_url': self.avatar_url,
            'user_type': self.user_type,
            'is_active': self.is_active,
            'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        if include_sensitive:
            data['updated_at'] = self.updated_at.isoformat() if self.updated_at else None
        
        return data
    
    def __repr__(self):
        return f'<User {self.email} ({self.user_type})>'
