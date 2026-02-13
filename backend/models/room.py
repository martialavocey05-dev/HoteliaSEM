"""Room Model for HoteliaSEM"""
from datetime import datetime
from database import db
from sqlalchemy import CheckConstraint, Numeric


class Room(db.Model):
    """Hotel room inventory"""
    
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id', ondelete='CASCADE'), nullable=False, index=True)
    room_number = db.Column(db.String(20), nullable=False)
    room_type = db.Column(db.String(50), nullable=False, default='standard')
    price_per_night = db.Column(Numeric(18, 2), nullable=False, index=True)
    currency = db.Column(db.String(3), nullable=False, default='XAF')
    max_guests = db.Column(db.Integer, nullable=False, default=2)
    is_available = db.Column(db.Boolean, nullable=False, default=True, index=True)
    floor_number = db.Column(db.Integer)
    area_sqm = db.Column(Numeric(6, 2))
    features = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("price_per_night > 0", name='ck_room_price'),
        CheckConstraint("max_guests BETWEEN 1 AND 20", name='ck_room_guests'),
        db.UniqueConstraint('hotel_id', 'room_number', name='uq_room_hotel'),
    )
    
    def to_dict(self):
        """Convert room to dictionary"""
        return {
            'id': self.id,
            'hotel_id': self.hotel_id,
            'room_number': self.room_number,
            'room_type': self.room_type,
            'price_per_night': float(self.price_per_night),
            'currency': self.currency,
            'max_guests': self.max_guests,
            'is_available': self.is_available,
            'floor_number': self.floor_number,
            'area_sqm': float(self.area_sqm) if self.area_sqm else None,
            'features': self.features,
        }
    
    def __repr__(self):
        return f'<Room {self.room_number} at Hotel {self.hotel_id}>'
