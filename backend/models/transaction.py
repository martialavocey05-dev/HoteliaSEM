"""Transaction Model for HoteliaSEM"""
from datetime import datetime
from database import db
from sqlalchemy import CheckConstraint, Numeric


class Transaction(db.Model):
    """Payment transaction with commission tracking"""
    
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_ref = db.Column(db.String(30), unique=True, nullable=False, index=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False, index=True)
    
    # Financial amounts
    amount = db.Column(Numeric(18, 2), nullable=False)
    commission_amount = db.Column(Numeric(18, 2), nullable=False)
    net_amount = db.Column(Numeric(18, 2), nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='XAF')
    
    # Payment provider
    payment_method = db.Column(db.String(50), nullable=False, default='stripe')
    stripe_payment_intent = db.Column(db.String(200))
    stripe_charge_id = db.Column(db.String(200))
    
    status = db.Column(db.String(20), nullable=False, default='pending', index=True)
    paid_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("status IN ('pending', 'completed', 'failed', 'refunded')", name='ck_trans_stat'),
        CheckConstraint("net_amount = amount - commission_amount", name='ck_trans_amounts'),
        CheckConstraint("amount > 0 AND commission_amount >= 0", name='ck_trans_pos'),
    )
    
    def to_dict(self):
        """Convert transaction to dictionary"""
        return {
            'id': self.id,
            'transaction_ref': self.transaction_ref,
            'booking_id': self.booking_id,
            'amount': float(self.amount),
            'commission_amount': float(self.commission_amount),
            'net_amount': float(self.net_amount),
            'currency': self.currency,
            'payment_method': self.payment_method,
            'status': self.status,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'created_at': self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<Transaction {self.transaction_ref}>'
