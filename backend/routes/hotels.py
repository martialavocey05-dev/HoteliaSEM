"""
Hotel management routes for HoteliaSEM
Role-based access control implemented:
- Admin: Full access to all hotels
- Hotelier: Manage their own hotels
- Client: View approved hotels only
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import or_

from database import db
from models.hotel import Hotel
from models.user import User
from middleware import (
    role_required,
    admin_required,
    hotelier_required,
    can_manage_hotel,
    can_view_hotel,
    require_permission,
    PermissionDenied
)
from utils.auth_helpers import get_current_user, log_user_action

hotels_bp = Blueprint('hotels', __name__, url_prefix='/api/hotels')


@hotels_bp.route('', methods=['GET'])
def get_hotels():
    """
    Get list of hotels (public endpoint with filtering)
    
    Query params:
    - city: Filter by city
    - status: Filter by status (admin/hotelier only)
    - owner_id: Filter by owner (admin only)
    """
    try:
        # Get current user if authenticated
        user = get_current_user()
        
        query = Hotel.query
        
        # Apply filters based on user role
        if not user or user.is_client():
            # Public/client view: only approved hotels
            query = query.filter_by(status='approved')
        elif user.is_hotelier():
            # Hotelier: own hotels + approved hotels
            query = query.filter(or_(
                Hotel.owner_id == user.id,
                Hotel.status == 'approved'
            ))
        # Admin: see all hotels
        
        # Apply query parameters
        city = request.args.get('city')
        if city:
            query = query.filter(Hotel.city.ilike(f'%{city}%'))
        
        status = request.args.get('status')
        if status and user and (user.is_admin() or user.is_hotelier()):
            query = query.filter_by(status=status)
        
        owner_id = request.args.get('owner_id')
        if owner_id and user and user.is_admin():
            query = query.filter_by(owner_id=int(owner_id))
        
        # Execute query
        hotels = query.order_by(Hotel.rating.desc()).all()
        
        return jsonify({
            'hotels': [hotel.to_dict() for hotel in hotels],
            'count': len(hotels)
        }), 200
        
    except Exception as e:
        print(f"[v0] Get hotels error: {str(e)}")
        return jsonify({'error': 'Failed to fetch hotels'}), 500


@hotels_bp.route('/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    """Get single hotel details"""
    try:
        hotel = Hotel.query.get(hotel_id)
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        # Check view permissions
        user = get_current_user()
        if user and not can_view_hotel(user, hotel_id):
            return jsonify({'error': 'You cannot view this hotel'}), 403
        elif not user and hotel.status != 'approved':
            return jsonify({'error': 'Hotel not found'}), 404
        
        return jsonify(hotel.to_dict()), 200
        
    except Exception as e:
        print(f"[v0] Get hotel error: {str(e)}")
        return jsonify({'error': 'Failed to fetch hotel'}), 500


@hotels_bp.route('', methods=['POST'])
@role_required('hotelier', 'admin')
def create_hotel():
    """
    Create new hotel (hotelier or admin only)
    
    Required: name, address, city
    """
    try:
        user = get_current_user()
        data = request.get_json()
        
        # Validate required fields
        required = ['name', 'address', 'city']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create hotel
        hotel = Hotel(
            name=data['name'],
            description=data.get('description'),
            address=data['address'],
            city=data['city'],
            country=data.get('country', 'Cameroun'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            phone=data.get('phone'),
            email=data.get('email'),
            website=data.get('website'),
            owner_id=user.id,
            subscription_type=data.get('subscription_type', 'standard'),
            status='pending' if user.is_hotelier() else 'approved'
        )
        
        db.session.add(hotel)
        db.session.commit()
        
        # Log creation
        log_user_action(
            user_id=user.id,
            action='create',
            entity_type='hotel',
            entity_id=hotel.id,
            new_values={'name': hotel.name, 'city': hotel.city}
        )
        
        return jsonify({
            'message': 'Hotel created successfully',
            'hotel': hotel.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Create hotel error: {str(e)}")
        return jsonify({'error': 'Failed to create hotel'}), 500


@hotels_bp.route('/<int:hotel_id>', methods=['PUT'])
@jwt_required()
def update_hotel(hotel_id):
    """Update hotel (owner or admin only)"""
    try:
        user = get_current_user()
        hotel = Hotel.query.get(hotel_id)
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        # Check permissions
        if not can_manage_hotel(user, hotel_id):
            return jsonify({'error': 'You cannot modify this hotel'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        updateable = ['name', 'description', 'address', 'city', 'country', 
                     'latitude', 'longitude', 'phone', 'email', 'website']
        
        for field in updateable:
            if field in data:
                setattr(hotel, field, data[field])
        
        db.session.commit()
        
        # Log update
        log_user_action(
            user_id=user.id,
            action='update',
            entity_type='hotel',
            entity_id=hotel.id
        )
        
        return jsonify({
            'message': 'Hotel updated successfully',
            'hotel': hotel.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Update hotel error: {str(e)}")
        return jsonify({'error': 'Failed to update hotel'}), 500


@hotels_bp.route('/<int:hotel_id>', methods=['DELETE'])
@jwt_required()
def delete_hotel(hotel_id):
    """Delete hotel (owner or admin only)"""
    try:
        user = get_current_user()
        hotel = Hotel.query.get(hotel_id)
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        # Check permissions
        if not can_manage_hotel(user, hotel_id):
            return jsonify({'error': 'You cannot delete this hotel'}), 403
        
        # Log deletion before removing
        log_user_action(
            user_id=user.id,
            action='delete',
            entity_type='hotel',
            entity_id=hotel.id,
            old_values={'name': hotel.name}
        )
        
        db.session.delete(hotel)
        db.session.commit()
        
        return jsonify({'message': 'Hotel deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Delete hotel error: {str(e)}")
        return jsonify({'error': 'Failed to delete hotel'}), 500


@hotels_bp.route('/<int:hotel_id>/approve', methods=['POST'])
@admin_required
def approve_hotel(hotel_id):
    """Approve hotel (admin only)"""
    try:
        user = get_current_user()
        hotel = Hotel.query.get(hotel_id)
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        data = request.get_json()
        status = data.get('status', 'approved')
        
        if status not in ['approved', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400
        
        hotel.status = status
        db.session.commit()
        
        # Log approval
        log_user_action(
            user_id=user.id,
            action='approve' if status == 'approved' else 'reject',
            entity_type='hotel',
            entity_id=hotel.id,
            new_values={'status': status}
        )
        
        return jsonify({
            'message': f'Hotel {status} successfully',
            'hotel': hotel.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Approve hotel error: {str(e)}")
        return jsonify({'error': 'Failed to approve hotel'}), 500


@hotels_bp.route('/my-hotels', methods=['GET'])
@hotelier_required
def get_my_hotels():
    """Get hotels owned by current hotelier"""
    try:
        user = get_current_user()
        hotels = Hotel.query.filter_by(owner_id=user.id).order_by(Hotel.created_at.desc()).all()
        
        return jsonify({
            'hotels': [hotel.to_dict() for hotel in hotels],
            'count': len(hotels)
        }), 200
        
    except Exception as e:
        print(f"[v0] Get my hotels error: {str(e)}")
        return jsonify({'error': 'Failed to fetch hotels'}), 500
