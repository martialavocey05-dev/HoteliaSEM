"""Authentication helper utilities"""
import secrets
import string
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models.user import User
from models.audit_log import AuditLog
import json


def generate_booking_reference():
    """Generate unique booking reference (e.g., HSEM-ABC123)"""
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    return f"HSEM-{random_part}"


def generate_transaction_reference():
    """Generate unique transaction reference"""
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    random_part = ''.join(secrets.choice(string.digits) for _ in range(4))
    return f"TXN-{timestamp}-{random_part}"


def get_client_ip():
    """Get client IP address from request"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr


def get_user_agent():
    """Get user agent from request"""
    return request.headers.get('User-Agent', 'Unknown')


def log_user_action(user_id, action, entity_type, entity_id=None, old_values=None, new_values=None):
    """
    Log user action to audit trail
    
    Args:
        user_id: ID of user performing action
        action: Action name (e.g., 'login', 'create', 'update', 'delete')
        entity_type: Type of entity affected (e.g., 'user', 'hotel', 'booking')
        entity_id: ID of affected entity
        old_values: Dict of old values (for updates)
        new_values: Dict of new values (for creates/updates)
    """
    try:
        AuditLog.log_action(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=json.dumps(old_values) if old_values else None,
            new_values=json.dumps(new_values) if new_values else None,
            ip_address=get_client_ip(),
            user_agent=get_user_agent()
        )
    except Exception as e:
        # Don't fail the request if audit logging fails
        print(f"[v0] Audit log error: {str(e)}")


def get_current_user():
    """Get current authenticated user from JWT token"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        return user
    except Exception as e:
        print(f"[v0] Error getting current user: {str(e)}")
        return None


def create_token_response(user, access_token, refresh_token=None):
    """Create standardized token response"""
    response_data = {
        'access_token': access_token,
        'user': user.to_dict(),
        'token_type': 'Bearer'
    }
    
    if refresh_token:
        response_data['refresh_token'] = refresh_token
    
    return response_data


def calculate_nights(check_in, check_out):
    """Calculate number of nights between dates"""
    if isinstance(check_in, str):
        check_in = datetime.fromisoformat(check_in).date()
    if isinstance(check_out, str):
        check_out = datetime.fromisoformat(check_out).date()
    
    return (check_out - check_in).days


def calculate_commission(amount, rate=0.15):
    """Calculate commission amount"""
    from decimal import Decimal
    return Decimal(str(amount)) * Decimal(str(rate))
