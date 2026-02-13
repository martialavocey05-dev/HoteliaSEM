"""Booking Model for HoteliaSEM"""
from datetime import datetime, date
from database import db
from sqlalchemy import CheckConstraint, Numeric, Date, func


class Booking(db.Model):
    """Hotel room booking"""
    
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_ref = db.Column(db.String(20), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False, index=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False, index=True)
    
    # Dates
    check_in_date = db.Column(Date, nullable=False)
    check_out_date = db.Column(Date, nullable=False)
    # Computed column: num_nights calculated automatically
    num_nights = db.Column(db.Integer, db.Computed("DATEDIFF(DAY, check_in_date, check_out_date)"))
    
    # Guest details
    num_adults = db.Column(db.Integer, nullable=False, default=1)
    num_children = db.Column(db.Integer, nullable=False, default=0)
    
    # Payment
    total_price = db.Column(Numeric(18, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='confirmed', index=True)
    
    special_requests = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("check_out_date > check_in_date", name='ck_booking_dates'),
        CheckConstraint("status IN ('confirmed', 'cancelled', 'completed', 'no-show')", name='ck_booking_stat'),
        CheckConstraint("num_adults >= 1", name='ck_booking_guests'),
        db.Index('ix_bookings_avail', 'room_id', 'check_in_date', 'check_out_date'),
    )
    
    def to_dict(self):
        """Convert booking to dictionary"""
        return {
            'id': self.id,
            'booking_ref': self.booking_ref,
            'user_id': self.user_id,
            'hotel_id': self.hotel_id,
            'room_id': self.room_id,
            'check_in_date': self.check_in_date.isoformat() if self.check_in_date else None,
            'check_out_date': self.check_out_date.isoformat() if self.check_out_date else None,
            'num_nights': self.num_nights,
            'num_adults': self.num_adults,
            'num_children': self.num_children,
            'total_price': float(self.total_price),
            'status': self.status,
            'special_requests': self.special_requests,
            'created_at': self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<Booking {self.booking_ref}>'
