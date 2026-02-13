# HoteliaSEM Flask Backend

Complete authentication and role-based access control (RBAC) system for the HoteliaSEM hotel booking platform.

## Features

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password strength validation (8+ chars, uppercase, lowercase, digit, special char)
- Token refresh mechanism
- Secure logout with audit logging
- Password change functionality

### Role-Based Access Control (RBAC)
Three user roles with distinct permissions:

#### 1. **Client**
- Register and manage account
- Browse approved hotels
- Create and manage own bookings
- Cancel own bookings
- View booking history

#### 2. **Hotelier** 
- All client permissions
- Create and manage own hotels
- View bookings for own hotels
- Update hotel information
- Manage room inventory

#### 3. **Admin**
- Full system access
- Approve/reject hotel submissions
- Manage all users (activate, deactivate, change roles)
- View system statistics
- Access audit logs
- Manage all bookings and hotels

### Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization decorators
- Comprehensive audit logging
- IP address and user agent tracking
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- CORS configuration
- Session management

## Installation

### Prerequisites
- Python 3.8+
- SQL Server (or compatible database)
- pip

### Setup

1. **Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
- `DATABASE_URL`: Your SQL Server connection string
- `SECRET_KEY`: Strong secret key for Flask
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `CORS_ORIGINS`: Allowed frontend origins

3. **Initialize database**
```bash
# Run the enhanced SQL schema script in your SQL Server
# File: scripts/enhanced-schema.sql
```

4. **Run the application**
```bash
python app.py
```

Server starts at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+237600000000",
  "user_type": "client"  // optional: client, hotelier, admin
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJh...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJh...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "user_type": "client",
    "is_active": true
  },
  "token_type": "Bearer"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /api/auth/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "phone": "+237611111111"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "old_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

### Hotels (`/api/hotels`)

#### List Hotels (Public + Filtered by role)
```http
GET /api/hotels?city=Douala&status=approved
```

#### Get Hotel Details
```http
GET /api/hotels/1
```

#### Create Hotel (Hotelier/Admin only)
```http
POST /api/hotels
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Hotel Luxe Douala",
  "description": "5-star luxury hotel",
  "address": "123 Rue de la Liberte",
  "city": "Douala",
  "phone": "+237699000000",
  "email": "contact@hotelluxe.cm"
}
```

#### Update Hotel (Owner/Admin only)
```http
PUT /api/hotels/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

#### Approve Hotel (Admin only)
```http
POST /api/hotels/1/approve
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "approved"  // or "rejected"
}
```

#### Get My Hotels (Hotelier only)
```http
GET /api/hotels/my-hotels
Authorization: Bearer <access_token>
```

### Bookings (`/api/bookings`)

#### List Bookings (Role-based)
```http
GET /api/bookings
Authorization: Bearer <access_token>
```

#### Create Booking (Client only)
```http
POST /api/bookings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "room_id": 1,
  "check_in_date": "2026-03-01",
  "check_out_date": "2026-03-05",
  "num_adults": 2,
  "num_children": 1,
  "special_requests": "Late check-in requested"
}
```

#### Cancel Booking
```http
POST /api/bookings/1/cancel
Authorization: Bearer <access_token>
```

### Admin (`/api/admin`)

#### System Statistics (Admin only)
```http
GET /api/admin/stats
Authorization: Bearer <access_token>
```

#### List All Users (Admin only)
```http
GET /api/admin/users?user_type=hotelier&is_active=true
Authorization: Bearer <access_token>
```

#### Deactivate User (Admin only)
```http
POST /api/admin/users/5/deactivate
Authorization: Bearer <access_token>
```

#### Change User Role (Admin only)
```http
POST /api/admin/users/5/change-role
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "user_type": "hotelier"
}
```

#### View Audit Logs (Admin only)
```http
GET /api/admin/audit-logs?action=login&page=1&per_page=50
Authorization: Bearer <access_token>
```

## Role-Based Decorators

### Using in Routes

```python
from middleware import (
    role_required,
    admin_required,
    hotelier_required,
    client_required,
    authenticated_required
)

# Single role
@admin_required
def admin_only_route():
    return jsonify({'message': 'Admin only'})

# Multiple roles
@role_required('admin', 'hotelier')
def admin_or_hotelier_route():
    return jsonify({'message': 'Admin or hotelier'})

# Any authenticated user
@authenticated_required
def any_user_route():
    return jsonify({'message': 'Any authenticated user'})
```

## Permission Checks

### Fine-Grained Permissions

```python
from middleware import can_manage_hotel, require_permission, PermissionDenied

@jwt_required()
def update_hotel(hotel_id):
    user = get_current_user()
    
    # Check permission
    if not can_manage_hotel(user, hotel_id):
        return jsonify({'error': 'Permission denied'}), 403
    
    # Or use require_permission (raises exception)
    try:
        require_permission(can_manage_hotel, user, hotel_id)
    except PermissionDenied as e:
        return jsonify({'error': str(e)}), 403
    
    # Update hotel...
```

### Available Permission Checks
- `can_manage_hotel(user, hotel_id)`
- `can_view_hotel(user, hotel_id)`
- `can_manage_booking(user, booking_id)`
- `can_cancel_booking(user, booking_id)`
- `can_create_room(user, hotel_id)`
- `can_approve_hotel(user)`
- `can_view_financial_reports(user, hotel_id)`
- `can_manage_users(user)`
- `can_access_audit_logs(user)`

## Database Models

All models include:
- Automatic timestamps (`created_at`, `updated_at`)
- Proper constraints and validations
- Relationships with cascade deletes
- Audit trail integration

## Security Best Practices

1. **Password Security**
   - Minimum 8 characters
   - Complexity requirements enforced
   - Bcrypt hashing (cost factor 12)

2. **Token Security**
   - JWT tokens with expiration
   - Refresh token rotation
   - Secure cookie options in production

3. **Input Validation**
   - Email validation
   - Phone number sanitization
   - SQL injection prevention

4. **Audit Logging**
   - All sensitive actions logged
   - IP address tracking
   - User agent tracking

## Testing

Create test users with different roles:

```python
# Admin user
POST /api/auth/register
{
  "email": "admin@hoteliasem.cm",
  "password": "Admin123!",
  "full_name": "System Admin",
  "user_type": "admin"
}

# Hotelier user
POST /api/auth/register
{
  "email": "hotel@hoteliasem.cm",
  "password": "Hotel123!",
  "full_name": "Hotel Manager",
  "user_type": "hotelier"
}

# Client user
POST /api/auth/register
{
  "email": "client@example.com",
  "password": "Client123!",
  "full_name": "John Client",
  "user_type": "client"
}
```

## Troubleshooting

### Common Issues

1. **Database connection error**
   - Verify `DATABASE_URL` in `.env`
   - Ensure SQL Server is running
   - Check firewall settings

2. **JWT decode error**
   - Ensure `JWT_SECRET_KEY` is set
   - Check token expiration
   - Verify Authorization header format: `Bearer <token>`

3. **Permission denied**
   - Check user role in database
   - Verify `is_active` is true
   - Check decorator requirements

## License

HoteliaSEM - Cameroon Hotel Booking Platform
