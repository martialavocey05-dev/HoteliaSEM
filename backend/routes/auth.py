"""
Authentication routes for HoteliaSEM
Handles user registration, login, logout, and token refresh
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from database import db
from models.user import User
from utils.validators import (
    validate_email_address,
    validate_password,
    validate_user_type,
    validate_phone,
    validate_full_name,
    ValidationError
)
from utils.auth_helpers import (
    get_current_user,
    create_token_response,
    log_user_action
)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Required fields: email, password, full_name
    Optional fields: phone, user_type (defaults to 'client')
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        phone = data.get('phone')
        user_type = data.get('user_type', 'client')
        
        if not email or not password or not full_name:
            return jsonify({'error': 'Email, password, and full name are required'}), 400
        
        # Validate inputs
        try:
            email = validate_email_address(email)
            validate_password(password)
            full_name = validate_full_name(full_name)
            user_type = validate_user_type(user_type)
            if phone:
                phone = validate_phone(phone)
        except ValidationError as e:
            return jsonify({'error': str(e)}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(
            email=email,
            password=password,
            full_name=full_name,
            phone=phone,
            user_type=user_type
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Log registration
        log_user_action(
            user_id=user.id,
            action='register',
            entity_type='user',
            entity_id=user.id,
            new_values={'email': email, 'user_type': user_type}
        )
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            **create_token_response(user, access_token, refresh_token)
        }), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'User already exists'}), 409
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate user and return JWT tokens
    
    Required fields: email, password
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Normalize email
        email = email.lower().strip()
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check if account is active
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Update last login
        user.update_last_login()
        
        # Log login
        log_user_action(
            user_id=user.id,
            action='login',
            entity_type='user',
            entity_id=user.id
        )
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            **create_token_response(user, access_token, refresh_token)
        }), 200
        
    except Exception as e:
        print(f"[v0] Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user (client should delete tokens)
    In a production system, you would add token to blacklist
    """
    try:
        user_id = get_jwt_identity()
        
        # Log logout
        log_user_action(
            user_id=user_id,
            action='logout',
            entity_type='user',
            entity_id=user_id
        )
        
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        print(f"[v0] Logout error: {str(e)}")
        return jsonify({'error': 'Logout failed'}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Invalid user'}), 401
        
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'access_token': access_token,
            'token_type': 'Bearer'
        }), 200
        
    except Exception as e:
        print(f"[v0] Token refresh error: {str(e)}")
        return jsonify({'error': 'Token refresh failed'}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user_info():
    """Get current authenticated user information"""
    try:
        user = get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        print(f"[v0] Get user info error: {str(e)}")
        return jsonify({'error': 'Failed to get user info'}), 500


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    """Update current user profile"""
    try:
        user = get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Store old values for audit
        old_values = {
            'full_name': user.full_name,
            'phone': user.phone,
            'avatar_url': user.avatar_url
        }
        
        # Update allowed fields
        if 'full_name' in data:
            user.full_name = validate_full_name(data['full_name'])
        
        if 'phone' in data:
            user.phone = validate_phone(data['phone'])
        
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log update
        log_user_action(
            user_id=user.id,
            action='update',
            entity_type='user',
            entity_id=user.id,
            old_values=old_values,
            new_values={
                'full_name': user.full_name,
                'phone': user.phone,
                'avatar_url': user.avatar_url
            }
        )
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Update user error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user = get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        
        if not old_password or not new_password:
            return jsonify({'error': 'Old and new passwords are required'}), 400
        
        # Verify old password
        if not user.check_password(old_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        try:
            validate_password(new_password)
        except ValidationError as e:
            return jsonify({'error': str(e)}), 400
        
        # Update password
        from database import bcrypt
        user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log password change
        log_user_action(
            user_id=user.id,
            action='change_password',
            entity_type='user',
            entity_id=user.id
        )
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Change password error: {str(e)}")
        return jsonify({'error': 'Failed to change password'}), 500
