"""
Admin-only routes for HoteliaSEM
User management, statistics, and system administration
"""
from flask import Blueprint, request, jsonify
from sqlalchemy import func

from database import db
from models.user import User
from models.hotel import Hotel
from models.booking import Booking
from models.transaction import Transaction
from models.audit_log import AuditLog
from middleware import admin_required
from utils.auth_helpers import get_current_user, log_user_action

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_system_stats():
    """Get system-wide statistics (admin only)"""
    try:
        stats = {
            'users': {
                'total': User.query.count(),
                'clients': User.query.filter_by(user_type='client').count(),
                'hoteliers': User.query.filter_by(user_type='hotelier').count(),
                'admins': User.query.filter_by(user_type='admin').count(),
                'active': User.query.filter_by(is_active=True).count(),
            },
            'hotels': {
                'total': Hotel.query.count(),
                'pending': Hotel.query.filter_by(status='pending').count(),
                'approved': Hotel.query.filter_by(status='approved').count(),
                'rejected': Hotel.query.filter_by(status='rejected').count(),
            },
            'bookings': {
                'total': Booking.query.count(),
                'confirmed': Booking.query.filter_by(status='confirmed').count(),
                'cancelled': Booking.query.filter_by(status='cancelled').count(),
                'completed': Booking.query.filter_by(status='completed').count(),
            },
            'transactions': {
                'total': Transaction.query.count(),
                'pending': Transaction.query.filter_by(status='pending').count(),
                'completed': Transaction.query.filter_by(status='completed').count(),
                'total_revenue': db.session.query(func.sum(Transaction.commission_amount))
                    .filter_by(status='completed').scalar() or 0
            }
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"[v0] Get stats error: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get all users with filtering (admin only)"""
    try:
        # Query parameters
        user_type = request.args.get('user_type')
        is_active = request.args.get('is_active')
        
        query = User.query
        
        if user_type:
            query = query.filter_by(user_type=user_type)
        
        if is_active is not None:
            active_bool = is_active.lower() == 'true'
            query = query.filter_by(is_active=active_bool)
        
        users = query.order_by(User.created_at.desc()).all()
        
        return jsonify({
            'users': [user.to_dict(include_sensitive=True) for user in users],
            'count': len(users)
        }), 200
        
    except Exception as e:
        print(f"[v0] Get all users error: {str(e)}")
        return jsonify({'error': 'Failed to fetch users'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    """Get user details (admin only)"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict(include_sensitive=True)), 200
        
    except Exception as e:
        print(f"[v0] Get user error: {str(e)}")
        return jsonify({'error': 'Failed to fetch user'}), 500


@admin_bp.route('/users/<int:user_id>/deactivate', methods=['POST'])
@admin_required
def deactivate_user(user_id):
    """Deactivate user account (admin only)"""
    try:
        current_user = get_current_user()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.id == current_user.id:
            return jsonify({'error': 'You cannot deactivate your own account'}), 400
        
        user.is_active = False
        db.session.commit()
        
        # Log deactivation
        log_user_action(
            user_id=current_user.id,
            action='deactivate',
            entity_type='user',
            entity_id=user.id,
            new_values={'is_active': False}
        )
        
        return jsonify({
            'message': 'User deactivated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Deactivate user error: {str(e)}")
        return jsonify({'error': 'Failed to deactivate user'}), 500


@admin_bp.route('/users/<int:user_id>/activate', methods=['POST'])
@admin_required
def activate_user(user_id):
    """Activate user account (admin only)"""
    try:
        current_user = get_current_user()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.is_active = True
        db.session.commit()
        
        # Log activation
        log_user_action(
            user_id=current_user.id,
            action='activate',
            entity_type='user',
            entity_id=user.id,
            new_values={'is_active': True}
        )
        
        return jsonify({
            'message': 'User activated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Activate user error: {str(e)}")
        return jsonify({'error': 'Failed to activate user'}), 500


@admin_bp.route('/users/<int:user_id>/change-role', methods=['POST'])
@admin_required
def change_user_role(user_id):
    """Change user role (admin only)"""
    try:
        current_user = get_current_user()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.id == current_user.id:
            return jsonify({'error': 'You cannot change your own role'}), 400
        
        data = request.get_json()
        new_role = data.get('user_type')
        
        if new_role not in ['client', 'hotelier', 'admin']:
            return jsonify({'error': 'Invalid role'}), 400
        
        old_role = user.user_type
        user.user_type = new_role
        db.session.commit()
        
        # Log role change
        log_user_action(
            user_id=current_user.id,
            action='change_role',
            entity_type='user',
            entity_id=user.id,
            old_values={'user_type': old_role},
            new_values={'user_type': new_role}
        )
        
        return jsonify({
            'message': f'User role changed from {old_role} to {new_role}',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Change role error: {str(e)}")
        return jsonify({'error': 'Failed to change user role'}), 500


@admin_bp.route('/audit-logs', methods=['GET'])
@admin_required
def get_audit_logs():
    """Get audit logs (admin only)"""
    try:
        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        # Filters
        user_id = request.args.get('user_id', type=int)
        action = request.args.get('action')
        entity_type = request.args.get('entity_type')
        
        query = AuditLog.query
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        if action:
            query = query.filter_by(action=action)
        if entity_type:
            query = query.filter_by(entity_type=entity_type)
        
        pagination = query.order_by(AuditLog.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'logs': [log.to_dict() for log in pagination.items],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        print(f"[v0] Get audit logs error: {str(e)}")
        return jsonify({'error': 'Failed to fetch audit logs'}), 500
