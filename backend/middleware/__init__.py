"""Middleware package for HoteliaSEM"""
from middleware.role_required import (
    role_required,
    admin_required,
    hotelier_required,
    client_required,
    authenticated_required,
    owner_or_admin_required
)
from middleware.permissions import (
    can_manage_hotel,
    can_view_hotel,
    can_manage_booking,
    can_cancel_booking,
    can_create_room,
    can_approve_hotel,
    can_view_financial_reports,
    can_manage_users,
    can_access_audit_logs,
    require_permission,
    PermissionDenied
)

__all__ = [
    'role_required',
    'admin_required',
    'hotelier_required',
    'client_required',
    'authenticated_required',
    'owner_or_admin_required',
    'can_manage_hotel',
    'can_view_hotel',
    'can_manage_booking',
    'can_cancel_booking',
    'can_create_room',
    'can_approve_hotel',
    'can_view_financial_reports',
    'can_manage_users',
    'can_access_audit_logs',
    'require_permission',
    'PermissionDenied'
]
