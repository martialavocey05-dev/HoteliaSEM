# HoteliaSEM - Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

The app will be available at: **http://localhost:3000**

### 3. Explore the Platform

#### Test Theme Switching
- **Desktop**: Click the Sun/Moon icon in the top-right navbar
- **Mobile**: Open menu (☰), click "Mode Clair" or "Mode Sombre"
- Theme persists across pages and reloads

#### Test Authentication
Navigate to login page and use demo quick-fill buttons:

**Click "Admin" button** → Auto-fills:
- Email: `admin@hoteliasem.cm`
- Password: `Admin2026!`
- Click "Se connecter" → Redirects to Admin Dashboard

**Click "Hôtelier" button** → Auto-fills:
- Email: `marie.kouassi@luxehotels.cm`
- Password: `Hotelier2026!`
- Click "Se connecter" → Redirects to Partner Dashboard

**Click "Client" button** → Auto-fills:
- Email: `sophie.martin@email.com`
- Password: `Client2026!`
- Click "Se connecter" → Redirects to Client Account

## Project Features

### Dual Theme System
- **Dark Mode**: Deep oceanic luxury with gold accents (default)
- **Light Mode**: Clean elegance with soft lavender and anthracite
- Instant switching, no page reload needed
- Persists to localStorage

### Complete Navigation
- **Landing Page**: Hero, Destinations, Services, Architecture
- **Auth Pages**: Login with demo buttons, Registration with validation
- **Dashboards**: Role-specific (Client, Partner, Admin)
- **All Connected**: Seamless flow between all pages

### Authentication Roles
- **Client**: View bookings, manage account
- **Hotelier**: Manage hotels, view bookings, revenue stats
- **Admin**: Full system access, user management, pending approvals

## Page Routes

| Page | Route | Access |
|------|-------|--------|
| Landing | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Client Account | `/client/account` | Client only |
| Partner Dashboard | `/partner/dashboard` | Hotelier only |
| Admin Dashboard | `/admin/dashboard` | Admin only |

## Key Files

### Frontend
- `app/page.tsx` - Landing page with all sections
- `app/login/page.tsx` - Login with demo buttons
- `components/navbar.tsx` - Navigation with theme toggle
- `lib/context/theme-context.tsx` - Theme management
- `lib/context/auth-context.tsx` - Authentication

### Backend (Flask)
- `backend/app.py` - Main Flask application
- `backend/routes/auth.py` - Login/register endpoints
- `backend/middleware/role_required.py` - RBAC decorators

### Documentation
- `NAVIGATION_MAP.md` - Complete route structure
- `THEME_IMPLEMENTATION.md` - Theme system details
- `TESTING_CHECKLIST.md` - Comprehensive tests
- `DEMO_CREDENTIALS.md` - All 12 demo users
- `PROJECT_UPDATES.md` - Latest changes summary

## What's New

### Recent Updates
✅ **SQL tab removed** from navigation (section still accessible)
✅ **Light mode implemented** with complementary colors
✅ **Theme toggle added** to navbar (desktop & mobile)
✅ **All navigation connected** and verified
✅ **Login button properly redirects** based on auth state

### Theme Colors

**Dark Mode (Luxe Métallique)**
- Background: Deep Night Blue `#001F3F`
- Primary: Royal Gold `#D4AF37`
- Accent: Premium Silver `#C0C0C0`

**Light Mode (Lumière Élégante)**
- Background: Blanc Albâtre `#F8F9FA`
- Primary: Bleu Givré (Lavender) `HSL(245, 65%, 70%)`
- Accent: Anthracite `#121212`

## Common Tasks

### Logging In
1. Click "Connexion" in navbar
2. Use demo button OR enter credentials
3. Click "Se connecter"
4. Auto-redirect to role-specific dashboard

### Creating Account
1. Click "Devenir Partenaire" in footer OR "Créer un compte" on login
2. Fill form (all fields required)
3. Select role: Client, Hôtelier, or Admin
4. Click "Créer mon compte"
5. Auto-redirect to dashboard

### Switching Themes
1. Click Sun/Moon icon (desktop) or theme button (mobile)
2. Watch entire app transition smoothly
3. Theme saves automatically
4. Persists across pages and browser sessions

### Navigating Sections
- Use navbar links to scroll to sections
- Use footer links to navigate pages
- Use back links on auth pages to return home
- Use logout button on dashboards to return home

## Demo Credentials Reference

### Quick Copy-Paste

**Admin**:
```
admin@hoteliasem.cm
Admin2026!
```

**Hotelier**:
```
marie.kouassi@luxehotels.cm
Hotelier2026!
```

**Client**:
```
sophie.martin@email.com
Client2026!
```

See `DEMO_CREDENTIALS.md` for all 12 demo users with detailed profiles.

## Troubleshooting

### Theme Not Persisting?
- Check browser localStorage is enabled
- Look for `hsem-theme` key in DevTools → Application → Local Storage

### Login Not Working?
- Ensure exact credentials (case-sensitive)
- Check console for errors
- Try demo buttons for quick testing

### Navigation Not Smooth?
- Ensure JavaScript is enabled
- Check for console errors
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Styles Look Wrong?
- Clear browser cache
- Check if correct theme is applied (light/dark class on HTML)
- Verify Tailwind CSS is loading

## Development Commands

```bash
# Start dev server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4 + Custom CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Backend**: Flask with SQLAlchemy (Python)
- **Authentication**: JWT + bcrypt
- **Database**: PostgreSQL (via enhanced schema)

## Next Steps

1. **Explore the App**: Navigate through all pages and sections
2. **Test Both Themes**: Switch between dark and light modes
3. **Try All Roles**: Login as admin, hotelier, and client
4. **Review Docs**: Read the detailed documentation files
5. **Run Tests**: Follow `TESTING_CHECKLIST.md` for comprehensive testing

## Support & Documentation

- **Navigation Guide**: `NAVIGATION_MAP.md`
- **Theme Details**: `THEME_IMPLEMENTATION.md`
- **Testing Guide**: `TESTING_CHECKLIST.md`
- **Project Updates**: `PROJECT_UPDATES.md`
- **Backend API**: `backend/README.md`
- **Demo Users**: `DEMO_CREDENTIALS.md`

## Links

- Landing Page: http://localhost:3000
- Login Page: http://localhost:3000/login
- Register Page: http://localhost:3000/register
- Client Dashboard: http://localhost:3000/client/account
- Partner Dashboard: http://localhost:3000/partner/dashboard
- Admin Dashboard: http://localhost:3000/admin/dashboard

---

**Ready to start?** Run `pnpm install && pnpm dev` and visit http://localhost:3000

**Questions?** Check the documentation files or review console logs for errors.

**Happy coding!** 🚀
