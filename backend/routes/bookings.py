"""
Booking management routes for HoteliaSEM
Role-based access control:
- Client: Create and manage their own bookings
- Hotelier: View bookings for their hotels
- Admin: Full access to all bookings
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, date

from database import db
from models.booking import Booking
from models.room import Room
from models.hotel import Hotel
from middleware import (
    role_required,
    admin_required,
    client_required,
    can_manage_booking
)
from utils.auth_helpers import (
    get_current_user,
    log_user_action,
    generate_booking_reference
)

bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')


@bookings_bp.route('', methods=['GET'])
@role_required('client', 'hotelier', 'admin')
def get_bookings():
    """
    Get bookings based on user role
    
    - Client: their own bookings
    - Hotelier: bookings for their hotels
    - Admin: all bookings
    """
    try:
        user = get_current_user()
        
        if user.is_client():
            # Client sees only their bookings
            bookings = Booking.query.filter_by(user_id=user.id).order_by(Booking.created_at.desc()).all()
        
        elif user.is_hotelier():
            # Hotelier sees bookings for their hotels
            hotel_ids = [h.id for h in Hotel.query.filter_by(owner_id=user.id).all()]
            bookings = Booking.query.filter(Booking.hotel_id.in_(hotel_ids)).order_by(Booking.created_at.desc()).all()
        
        else:  # Admin
            # Admin sees all bookings
            bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings],
            'count': len(bookings)
        }), 200
        
    except Exception as e:
        print(f"[v0] Get bookings error: {str(e)}")
        return jsonify({'error': 'Failed to fetch bookings'}), 500


@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@role_required('client', 'hotelier', 'admin')
def get_booking(booking_id):
    """Get single booking details (with permission check)"""
    try:
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check permissions
        if not can_manage_booking(user, booking_id):
            return jsonify({'error': 'You cannot view this booking'}), 403
        
        return jsonify(booking.to_dict()), 200
        
    except Exception as e:
        print(f"[v0] Get booking error: {str(e)}")
        return jsonify({'error': 'Failed to fetch booking'}), 500


@bookings_bp.route('', methods=['POST'])
@client_required
def create_booking():
    """
    Create new booking (client only)
    
    Required: room_id, check_in_date, check_out_date, num_adults
    """
    try:
        user = get_current_user()
        data = request.get_json()
        
        # Validate required fields
        required = ['room_id', 'check_in_date', 'check_out_date', 'num_adults']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get room and hotel
        room = Room.query.get(data['room_id'])
        if not room:
            return jsonify({'error': 'Room not found'}), 404
        
        if not room.is_available:
            return jsonify({'error': 'Room is not available'}), 400
        
        # Parse dates
        try:
            check_in = datetime.fromisoformat(data['check_in_date']).date()
            check_out = datetime.fromisoformat(data['check_out_date']).date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DD)'}), 400
        
        if check_out <= check_in:
            return jsonify({'error': 'Check-out date must be after check-in date'}), 400
        
        if check_in < date.today():
            return jsonify({'error': 'Check-in date cannot be in the past'}), 400
        
        # Calculate total price
        num_nights = (check_out - check_in).days
        total_price = room.price_per_night * num_nights
        
        # Check guest capacity
        num_adults = data['num_adults']
        num_children = data.get('num_children', 0)
        
        if num_adults + num_children > room.max_guests:
            return jsonify({'error': f'Room capacity is {room.max_guests} guests'}), 400
        
        # Create booking
        booking = Booking(
            booking_ref=generate_booking_reference(),
            user_id=user.id,
            hotel_id=room.hotel_id,
            room_id=room.id,
            check_in_date=check_in,
            check_out_date=check_out,
            num_adults=num_adults,
            num_children=num_children,
            total_price=total_price,
            special_requests=data.get('special_requests')
        )
        
        db.session.add(booking)
        db.session.commit()
        
        # Log creation
        log_user_action(
            user_id=user.id,
            action='create',
            entity_type='booking',
            entity_id=booking.id,
            new_values={
                'booking_ref': booking.booking_ref,
                'hotel_id': room.hotel_id,
                'room_id': room.id
            }
        )
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Create booking error: {str(e)}")
        return jsonify({'error': 'Failed to create booking'}), 500


@bookings_bp.route('/<int:booking_id>/cancel', methods=['POST'])
@role_required('client', 'admin')
def cancel_booking(booking_id):
    """Cancel booking (client can cancel their own, admin can cancel any)"""
    try:
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check permissions
        if not user.is_admin() and booking.user_id != user.id:
            return jsonify({'error': 'You cannot cancel this booking'}), 403
        
        if booking.status != 'confirmed':
            return jsonify({'error': f'Cannot cancel booking with status: {booking.status}'}), 400
        
        # Update status
        booking.status = 'cancelled'
        db.session.commit()
        
        # Log cancellation
        log_user_action(
            user_id=user.id,
            action='cancel',
            entity_type='booking',
            entity_id=booking.id,
            new_values={'status': 'cancelled'}
        )
        
        return jsonify({
            'message': 'Booking cancelled successfully',
            'booking': booking.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Cancel booking error: {str(e)}")
        return jsonify({'error': 'Failed to cancel booking'}), 500


@bookings_bp.route('/<int:booking_id>/complete', methods=['POST'])
@admin_required
def complete_booking(booking_id):
    """Mark booking as completed (admin only)"""
    try:
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        booking.status = 'completed'
        db.session.commit()
        
        # Log completion
        log_user_action(
            user_id=user.id,
            action='complete',
            entity_type='booking',
            entity_id=booking.id,
            new_values={'status': 'completed'}
        )
        
        return jsonify({
            'message': 'Booking marked as completed',
            'booking': booking.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[v0] Complete booking error: {str(e)}")
        return jsonify({'error': 'Failed to complete booking'}), 500
