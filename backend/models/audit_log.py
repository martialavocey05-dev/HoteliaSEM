"""Audit Log Model for HoteliaSEM - Complete traceability"""
from datetime import datetime
from database import db


class AuditLog(db.Model):
    """Comprehensive audit trail for all system actions"""
    
    __tablename__ = 'audit_log'
    
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    action = db.Column(db.String(50), nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer)
    old_values = db.Column(db.Text)
    new_values = db.Column(db.Text)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    __table_args__ = (
        db.Index('ix_audit_entity', 'entity_type', 'entity_id'),
    )
    
    @staticmethod
    def log_action(user_id, action, entity_type, entity_id=None, old_values=None, new_values=None, ip_address=None, user_agent=None):
        """Create audit log entry"""
        log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            new_values=new_values,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(log)
        db.session.commit()
        return log
    
    def to_dict(self):
        """Convert audit log to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<AuditLog {self.action} on {self.entity_type}>'
