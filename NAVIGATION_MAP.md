# HoteliaSEM - Navigation Map

## Page Structure and Routes

### Public Pages

#### Landing Page (`/`)
- **Route**: `/` or `/app/page.tsx`
- **Sections**:
  - `#hero` - Hero section with logo, CTA buttons
  - `#destinations` - Douala, Yaounde, Kribi hotels showcase
  - `#services` - 8 key platform features
  - `#architecture` - Technical architecture overview
  - *(SQL section still accessible via direct scroll, removed from navigation)*

#### Authentication Pages

**Login Page** (`/login`)
- **Route**: `/login` or `/app/login/page.tsx`
- **Features**:
  - Email/password login
  - Demo user quick-fill buttons for all 3 roles
  - Link to registration page
  - Auto-redirect to role-specific dashboard after login

**Registration Page** (`/register`)
- **Route**: `/register` or `/app/register/page.tsx`
- **Features**:
  - Full registration form with role selection
  - Validates email format, password strength
  - Link to login page
  - Auto-redirect to role-specific dashboard after registration

### Role-Based Dashboards

#### Client Dashboard (`/client/account`)
- **Route**: `/client/account` or `/app/client/account/page.tsx`
- **Access**: Requires authentication with `role: 'client'`
- **Features**:
  - View all bookings (confirmed, pending, completed, cancelled)
  - Personal information display
  - Quick stats: total bookings, confirmed bookings, total spent
  - Logout button

#### Partner Dashboard (`/partner/dashboard`)
- **Route**: `/partner/dashboard` or `/app/partner/dashboard/page.tsx`
- **Access**: Requires authentication with `role: 'hotelier'`
- **Features**:
  - Manage hotels (view all partner hotels)
  - View bookings for partner hotels
  - Revenue stats: total bookings, active hotels, revenue
  - Hotel list with status (pending/approved)
  - Logout button

#### Admin Dashboard (`/admin/dashboard`)
- **Route**: `/admin/dashboard` or `/app/admin/dashboard/page.tsx`
- **Access**: Requires authentication with `role: 'admin'`
- **Features**:
  - System overview with complete stats
  - User management (view all users, filter by role)
  - Pending hotel approvals
  - System metrics: total users, total hotels, total bookings, platform revenue
  - Logout button

## Navigation Components

### Navbar
**Location**: `/components/navbar.tsx`
**Navigation Links**:
- Accueil → `#hero`
- Destinations → `#destinations`
- Services → `#services`
- Architecture → `#architecture`
- ~~SQL~~ *(Removed from navigation)*

**Actions**:
- Theme Toggle (Sun/Moon icon) - Switch between light and dark mode
- Language Selector (FR) - Currently French only
- Login/Account Button:
  - If **not authenticated**: "Connexion" → redirects to `/login`
  - If **authenticated**: "FirstName" → redirects to role-specific dashboard

### Footer
**Location**: `/components/footer.tsx`
**Link Sections**:
- **Plateforme**:
  - Accueil → `#hero`
  - Destinations → `#destinations`
  - Services → `#services`
  - Architecture → `#architecture`
- **Partenaires**:
  - Devenir Partenaire → `/register`
  - Dashboard Hotelier → `/partner/dashboard`
  - Espace Client → `/client/account`
  - Connexion → `/login`
- **Legal**:
  - Mentions Legales, CGU, etc. (placeholder links)

## Theme System

### Dark Mode (Default)
**Colors**:
- Background: Deep Night Blue `#001020` - `#001F3F`
- Primary: Royal Gold `#D4AF37` (HSL: 43 72% 52%)
- Accent: Premium Silver `#C0C0C0` (HSL: 0 0% 75%)
- Foreground: Alabaster White (HSL: 40 20% 95%)

### Light Mode
**Colors**:
- Background: Blanc Albâtre `#F8F9FA` (HSL: 0 0% 98%)
- Primary: Bleu Givré / Lavande Clair (HSL: 245 65% 70%)
- Accent: Anthracite Profond `#121212` (HSL: 0 0% 8%)
- Foreground: Dark text (HSL: 0 0% 7%)

**Theme Toggle**:
- Desktop: Sun/Moon icon button in navbar
- Mobile: Full button with text "Mode Clair" / "Mode Sombre"
- Persistence: Saved to localStorage as `hsem-theme`
- Class-based: `.light` class added to `<html>` element

## Authentication Flow

### Login Flow
1. User clicks "Connexion" in navbar/footer
2. Redirected to `/login`
3. User enters credentials OR clicks demo button
4. On success → Auto-redirect based on role:
   - `client` → `/client/account`
   - `hotelier` → `/partner/dashboard`
   - `admin` → `/admin/dashboard`

### Registration Flow
1. User clicks "Devenir Partenaire" in footer OR "Inscription" link in login page
2. Redirected to `/register`
3. User fills form and selects role
4. On success → Auto-redirect to role-specific dashboard

### Protected Routes
All dashboard pages use authentication context to verify user is logged in and has appropriate role.

## Demo Users (Quick Login)

### Administrators (2)
- `admin@hoteliasem.cm` / `Admin2026!`
- `tech.admin@hoteliasem.cm` / `TechAdmin2026!`

### Hoteliers (4)
- `marie.kouassi@luxehotels.cm` / `Hotelier2026!` - Luxe Hotels Group
- `paul.ngoumou@prestigesuites.cm` / `Hotelier2026!` - Prestige Suites
- `fatima.sow@oceanview.cm` / `Hotelier2026!` - Ocean View Resorts
- `jean.mbarga@mountainlodge.cm` / `Hotelier2026!` - Mountain Lodge

### Clients (6)
- `sophie.martin@email.com` / `Client2026!`
- `ahmed.diallo@email.com` / `Client2026!`
- `claire.dubois@email.com` / `Client2026!`
- `ibrahim.kamara@email.com` / `Client2026!`
- `emma.laurent@email.com` / `Client2026!`
- `mamadou.toure@email.com` / `Client2026!`

## Component Hierarchy

```
app/layout.tsx (ThemeProvider + AuthProvider wrapper)
├── app/page.tsx (Landing page)
│   ├── components/navbar.tsx (Global navigation + theme toggle)
│   ├── components/hero-section.tsx
│   ├── components/destinations-section.tsx
│   ├── components/services-section.tsx
│   ├── components/architecture-section.tsx
│   ├── components/sql-section.tsx (Hidden from nav, still rendered)
│   └── components/footer.tsx
│
├── app/login/page.tsx (Authentication)
├── app/register/page.tsx (Registration)
│
├── app/client/account/page.tsx (Client dashboard)
├── app/partner/dashboard/page.tsx (Partner dashboard)
└── app/admin/dashboard/page.tsx (Admin dashboard)
```

## Backend Integration

### Flask Backend
**Location**: `/backend/`
**Key Files**:
- `app.py` - Main Flask application
- `routes/auth.py` - Login, register, logout endpoints
- `routes/hotels.py` - Hotel CRUD operations
- `routes/bookings.py` - Booking management
- `routes/admin.py` - Admin-only endpoints
- `middleware/role_required.py` - RBAC decorators

**API Endpoints** (see `/backend/README.md` for full documentation):
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/hotels` - List hotels (public)
- `POST /api/hotels` - Create hotel (hotelier only)
- `GET /api/bookings/my-bookings` - User bookings (client only)
- `POST /api/bookings` - Create booking (client only)
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/pending-hotels` - Pending hotels (admin only)

## Development Tips

### Adding New Pages
1. Create page in `app/[route]/page.tsx`
2. Add link in navbar or footer
3. Update this navigation map

### Protecting Routes
Import and use `useAuth()` hook:
```tsx
import { useAuth } from "@/lib/context/auth-context"

const { user, isAuthenticated } = useAuth()
if (!isAuthenticated) return <div>Please login</div>
```

### Theme-Aware Components
Use Tailwind classes with dark mode variants:
```tsx
<div className="bg-background text-foreground">
  {/* Automatically adapts to theme */}
</div>
```

Or use theme hook:
```tsx
import { useTheme } from "@/lib/context/theme-context"
const { theme, toggleTheme } = useTheme()
```
