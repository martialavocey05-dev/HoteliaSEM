"""Hotel Model for HoteliaSEM"""
from datetime import datetime
from database import db
from sqlalchemy import CheckConstraint, Numeric


class Hotel(db.Model):
    """Hotel managed by hotelier users"""
    
    __tablename__ = 'hotels'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    address = db.Column(db.String(300), nullable=False)
    city = db.Column(db.String(100), nullable=False, index=True)
    country = db.Column(db.String(100), nullable=False, default='Cameroun')
    
    # Geolocation
    latitude = db.Column(Numeric(10, 7))
    longitude = db.Column(Numeric(11, 7))
    
    # Contact
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    website = db.Column(db.String(200))
    
    # Ratings
    rating = db.Column(Numeric(3, 2), nullable=False, default=0, index=True)
    total_reviews = db.Column(db.Integer, nullable=False, default=0)
    
    # Owner and subscription
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    subscription_type = db.Column(db.String(20), nullable=False, default='standard')
    status = db.Column(db.String(20), nullable=False, default='pending', index=True)
    
    # Geocoding metadata
    is_manually_geocoded = db.Column(db.Boolean, nullable=False, default=False)
    geocoding_notes = db.Column(db.String(500))
    
    # Commission
    commission_rate = db.Column(Numeric(5, 4), nullable=False, default=0.1500)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    rooms = db.relationship('Room', backref='hotel', lazy='dynamic', cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='hotel', lazy='dynamic')
    
    __table_args__ = (
        CheckConstraint("subscription_type IN ('standard', 'premium')", name='ck_hotel_sub'),
        CheckConstraint("status IN ('pending', 'approved', 'rejected')", name='ck_hotel_stat'),
        CheckConstraint("rating BETWEEN 0 AND 5", name='ck_hotel_rate'),
        CheckConstraint("commission_rate BETWEEN 0 AND 1", name='ck_hotel_comm'),
    )
    
    def to_dict(self):
        """Convert hotel to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'phone': self.phone,
            'email': self.email,
            'website': self.website,
            'rating': float(self.rating) if self.rating else 0,
            'total_reviews': self.total_reviews,
            'subscription_type': self.subscription_type,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<Hotel {self.name} ({self.city})>'
