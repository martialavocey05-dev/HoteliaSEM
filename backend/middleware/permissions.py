"""
Permission checking utilities for HoteliaSEM
Fine-grained permission checks for specific resources
"""
from flask import jsonify
from models.user import User
from models.hotel import Hotel
from models.booking import Booking
from models.room import Room


class PermissionDenied(Exception):
    """Custom exception for permission denied"""
    pass


def can_manage_hotel(user, hotel_id):
    """
    Check if user can manage a specific hotel
    
    Rules:
    - Admin: can manage all hotels
    - Hotelier: can only manage their own hotels
    - Client: cannot manage hotels
    """
    if user.is_admin():
        return True
    
    if user.is_hotelier():
        hotel = Hotel.query.get(hotel_id)
        if hotel and hotel.owner_id == user.id:
            return True
    
    return False


def can_view_hotel(user, hotel_id):
    """
    Check if user can view a specific hotel
    
    Rules:
    - Admin: can view all hotels
    - Hotelier: can view their own hotels
    - Client: can view approved hotels only
    """
    hotel = Hotel.query.get(hotel_id)
    
    if not hotel:
        return False
    
    if user.is_admin():
        return True
    
    if user.is_hotelier() and hotel.owner_id == user.id:
        return True
    
    # Clients can only view approved hotels
    if user.is_client() and hotel.status == 'approved':
        return True
    
    return False


def can_manage_booking(user, booking_id):
    """
    Check if user can manage a specific booking
    
    Rules:
    - Admin: can manage all bookings
    - Hotelier: can manage bookings for their hotels
    - Client: can manage their own bookings
    """
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return False
    
    if user.is_admin():
        return True
    
    if user.is_client() and booking.user_id == user.id:
        return True
    
    if user.is_hotelier():
        hotel = Hotel.query.get(booking.hotel_id)
        if hotel and hotel.owner_id == user.id:
            return True
    
    return False


def can_cancel_booking(user, booking_id):
    """
    Check if user can cancel a booking
    
    Rules:
    - Admin: can cancel any booking
    - Client: can cancel their own confirmed bookings
    - Hotelier: cannot cancel bookings (only admin)
    """
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return False
    
    if user.is_admin():
        return True
    
    # Clients can cancel their own bookings if status is 'confirmed'
    if user.is_client() and booking.user_id == user.id and booking.status == 'confirmed':
        return True
    
    return False


def can_create_room(user, hotel_id):
    """
    Check if user can create a room for a hotel
    
    Rules:
    - Admin: can create rooms for any hotel
    - Hotelier: can create rooms for their own hotels
    - Client: cannot create rooms
    """
    return can_manage_hotel(user, hotel_id)


def can_approve_hotel(user):
    """
    Check if user can approve/reject hotels
    
    Only admins can approve hotels
    """
    return user.is_admin()


def can_view_financial_reports(user, hotel_id=None):
    """
    Check if user can view financial reports
    
    Rules:
    - Admin: can view all financial reports
    - Hotelier: can view reports for their own hotels
    - Client: cannot view financial reports
    """
    if user.is_admin():
        return True
    
    if user.is_hotelier() and hotel_id:
        return can_manage_hotel(user, hotel_id)
    
    return False


def can_manage_users(user):
    """
    Check if user can manage other users
    
    Only admins can manage users
    """
    return user.is_admin()


def can_access_audit_logs(user):
    """
    Check if user can access audit logs
    
    Only admins can access audit logs
    """
    return user.is_admin()


def require_permission(permission_check, *args):
    """
    Helper to raise exception if permission check fails
    
    Usage:
        require_permission(can_manage_hotel, user, hotel_id)
    """
    if not permission_check(*args):
        raise PermissionDenied("You don't have permission to perform this action")


def permission_response(allowed, message=None):
    """
    Create standardized permission response
    """
    if allowed:
        return {'allowed': True}
    else:
        return {
            'allowed': False,
            'message': message or 'Permission denied'
        }
