"""
Role-Based Access Control (RBAC) Decorators for HoteliaSEM

These decorators enforce role-based permissions on Flask routes.

Usage:
    @role_required('admin')
    def admin_only_route():
        ...
    
    @role_required('admin', 'hotelier')
    def admin_or_hotelier_route():
        ...
    
    @role_required('client', 'hotelier', 'admin')
    def all_authenticated_route():
        ...
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.user import User


def role_required(*allowed_roles):
    """
    Decorator to restrict access to specific user roles
    
    Args:
        *allowed_roles: Variable number of role strings ('client', 'hotelier', 'admin')
    
    Returns:
        Decorator function that checks if user has one of the allowed roles
    
    Example:
        @role_required('admin')
        def admin_dashboard():
            return jsonify({'data': 'admin only'})
        
        @role_required('admin', 'hotelier')
        def partner_dashboard():
            return jsonify({'data': 'admin or hotelier'})
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Verify JWT token is present and valid
            try:
                verify_jwt_in_request()
            except Exception as e:
                return jsonify({
                    'error': 'Authentication required',
                    'message': 'Please log in to access this resource'
                }), 401
            
            # Get current user
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({
                    'error': 'User not found',
                    'message': 'Invalid authentication token'
                }), 401
            
            # Check if user account is active
            if not user.is_active:
                return jsonify({
                    'error': 'Account deactivated',
                    'message': 'Your account has been deactivated'
                }), 403
            
            # Check if user has one of the allowed roles
            if not user.has_role(*allowed_roles):
                return jsonify({
                    'error': 'Insufficient permissions',
                    'message': f'This resource requires one of the following roles: {", ".join(allowed_roles)}',
                    'required_roles': list(allowed_roles),
                    'your_role': user.user_type
                }), 403
            
            # User is authenticated and authorized
            return fn(*args, **kwargs)
        
        return wrapper
    return decorator


def admin_required(fn):
    """
    Decorator shorthand for admin-only routes
    
    Usage:
        @admin_required
        def admin_only_route():
            ...
    """
    return role_required('admin')(fn)


def hotelier_required(fn):
    """
    Decorator for hotelier-only routes
    
    Usage:
        @hotelier_required
        def hotelier_dashboard():
            ...
    """
    return role_required('hotelier')(fn)


def client_required(fn):
    """
    Decorator for client-only routes
    
    Usage:
        @client_required
        def client_bookings():
            ...
    """
    return role_required('client')(fn)


def authenticated_required(fn):
    """
    Decorator for routes that require any authenticated user (any role)
    
    Usage:
        @authenticated_required
        def profile():
            ...
    """
    return role_required('client', 'hotelier', 'admin')(fn)


def owner_or_admin_required(resource_user_field='user_id'):
    """
    Decorator that allows access to resource owner or admin
    
    Args:
        resource_user_field: The field name in kwargs that contains the user_id to check
    
    Usage:
        @owner_or_admin_required('user_id')
        def get_booking(booking_id):
            # user can access their own booking or admin can access any
            ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return jsonify({'error': 'Authentication required'}), 401
            
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user or not user.is_active:
                return jsonify({'error': 'Invalid user'}), 401
            
            # Admin has full access
            if user.is_admin():
                return fn(*args, **kwargs)
            
            # Check if user is the owner of the resource
            resource_owner_id = kwargs.get(resource_user_field)
            
            if resource_owner_id and int(resource_owner_id) == user_id:
                return fn(*args, **kwargs)
            
            return jsonify({
                'error': 'Insufficient permissions',
                'message': 'You can only access your own resources'
            }), 403
        
        return wrapper
    return decorator
