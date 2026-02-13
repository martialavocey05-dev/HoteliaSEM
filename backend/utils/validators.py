"""Input validation utilities for HoteliaSEM"""
import re
from email_validator import validate_email, EmailNotValidError


class ValidationError(Exception):
    """Custom validation error"""
    pass


def validate_password(password, min_length=8):
    """
    Validate password strength according to HoteliaSEM security policy
    
    Requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < min_length:
        raise ValidationError(f"Password must be at least {min_length} characters long")
    
    if len(password) > 128:
        raise ValidationError("Password must not exceed 128 characters")
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        raise ValidationError("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        raise ValidationError("Password must contain at least one digit")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError("Password must contain at least one special character")
    
    return True


def validate_email_address(email):
    """Validate email address format"""
    try:
        validated = validate_email(email, check_deliverability=False)
        return validated.normalized
    except EmailNotValidError as e:
        raise ValidationError(f"Invalid email address: {str(e)}")


def validate_user_type(user_type):
    """Validate user role/type"""
    valid_types = ['client', 'hotelier', 'admin']
    if user_type not in valid_types:
        raise ValidationError(f"Invalid user type. Must be one of: {', '.join(valid_types)}")
    return user_type


def validate_phone(phone):
    """Validate phone number (basic validation)"""
    if phone is None:
        return None
    
    # Remove spaces and common separators
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it contains only digits and optional leading +
    if not re.match(r'^\+?\d{8,15}$', cleaned):
        raise ValidationError("Invalid phone number format")
    
    return cleaned


def validate_full_name(name):
    """Validate full name"""
    if not name or len(name.strip()) < 2:
        raise ValidationError("Full name must be at least 2 characters")
    
    if len(name) > 120:
        raise ValidationError("Full name must not exceed 120 characters")
    
    return name.strip()
