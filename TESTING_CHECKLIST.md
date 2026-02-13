# HoteliaSEM - Complete Testing Checklist

## Navigation Tests

### Landing Page Navigation

#### Navbar Links
- [ ] **Accueil** link scrolls to hero section (`#hero`)
- [ ] **Destinations** link scrolls to destinations section (`#destinations`)
- [ ] **Services** link scrolls to services section (`#services`)
- [ ] **Architecture** link scrolls to architecture section (`#architecture`)
- [ ] **SQL** tab is NOT visible in navigation (removed as requested)
- [ ] SQL section is still rendered on page (accessible via direct scroll)

#### Navbar Actions
- [ ] **Theme toggle button** (Sun/Moon icon) changes theme
- [ ] **Language selector** displays "FR" (currently static)
- [ ] **Connexion button** when NOT logged in redirects to `/login`
- [ ] **User name button** when logged in shows user's first name
- [ ] **User name button** when logged in redirects to role-specific dashboard

#### Mobile Navigation
- [ ] Hamburger menu opens/closes correctly
- [ ] All nav links work in mobile menu
- [ ] Theme toggle button shows full text: "Mode Clair" / "Mode Sombre"
- [ ] Connexion/User button works in mobile menu
- [ ] Menu closes when link is clicked

### Authentication Flow

#### Login Page (`/login`)
- [ ] Click "Connexion" in navbar → redirects to `/login`
- [ ] Logo displays correctly
- [ ] Email and password fields are visible
- [ ] Show/hide password toggle works
- [ ] **Demo buttons** work:
  - [ ] "Admin" button fills admin credentials
  - [ ] "Hôtelier" button fills hotelier credentials
  - [ ] "Client" button fills client credentials
- [ ] "Se connecter" button submits form
- [ ] Error message displays on invalid credentials
- [ ] Success redirects to:
  - [ ] Admin → `/admin/dashboard`
  - [ ] Hotelier → `/partner/dashboard`
  - [ ] Client → `/client/account`
- [ ] "Créer un compte" link redirects to `/register`
- [ ] "← Retour à l'accueil" link redirects to `/`

#### Register Page (`/register`)
- [ ] Accessible from footer "Devenir Partenaire" link
- [ ] Accessible from login page "Créer un compte" link
- [ ] All form fields validate properly:
  - [ ] First name required
  - [ ] Last name required
  - [ ] Email validates format
  - [ ] Password validates strength
  - [ ] Phone number format
- [ ] Role selector works (Client/Hôtelier/Admin)
- [ ] "Créer mon compte" button submits form
- [ ] Success redirects to role-specific dashboard
- [ ] "Se connecter" link redirects to `/login`
- [ ] "← Retour à l'accueil" link redirects to `/`

### Dashboard Access

#### Client Dashboard (`/client/account`)
- [ ] Accessible after login as client
- [ ] Shows user's personal information
- [ ] Displays bookings (confirmed, pending, completed, cancelled)
- [ ] Shows stats: total bookings, confirmed bookings, total spent
- [ ] "Déconnexion" button logs out and redirects to home
- [ ] Back button/link to return to landing page

#### Partner Dashboard (`/partner/dashboard`)
- [ ] Accessible after login as hotelier
- [ ] Shows partner's hotels
- [ ] Displays bookings for partner hotels
- [ ] Shows stats: total bookings, active hotels, revenue
- [ ] Hotel list shows status (pending/approved)
- [ ] "Déconnexion" button logs out and redirects to home

#### Admin Dashboard (`/admin/dashboard`)
- [ ] Accessible after login as admin
- [ ] Shows all system stats
- [ ] User management section lists all users
- [ ] Filter users by role works
- [ ] Pending hotels section displays hotels awaiting approval
- [ ] System metrics display correctly
- [ ] "Déconnexion" button logs out and redirects to home

### Footer Navigation

#### Footer Links
- [ ] **Plateforme** section:
  - [ ] Accueil → scrolls to `#hero`
  - [ ] Destinations → scrolls to `#destinations`
  - [ ] Services → scrolls to `#services`
  - [ ] Architecture → scrolls to `#architecture`
- [ ] **Partenaires** section:
  - [ ] Devenir Partenaire → `/register`
  - [ ] Dashboard Hotelier → `/partner/dashboard`
  - [ ] Espace Client → `/client/account`
  - [ ] Connexion → `/login`
- [ ] **Legal** section links are present (placeholders)

## Theme System Tests

### Dark Mode (Default)

#### Visual Verification
- [ ] Background is Deep Night Blue (#001020 - #001F3F)
- [ ] Text is Alabaster White (light, high contrast)
- [ ] Primary color is Royal Gold (#D4AF37)
- [ ] Accent color is Premium Silver (#C0C0C0)
- [ ] Cards have navy background with glassmorphism
- [ ] Buttons are gold with navy text
- [ ] All text is readable with good contrast

#### Component Styles
- [ ] Navbar has glass effect with dark background
- [ ] Hero section background gradient is dark blue
- [ ] Destination cards are dark with gold borders on hover
- [ ] Service icons are gold/silver
- [ ] Architecture section code blocks are readable
- [ ] Footer is dark navy
- [ ] Login/register forms have dark glass cards
- [ ] Dashboard cards maintain dark theme

### Light Mode

#### Visual Verification
- [ ] Background is Blanc Albâtre (#F8F9FA - white/cream)
- [ ] Text is Anthracite Profond (dark, high contrast)
- [ ] Primary color is Bleu Givré/Lavande (soft blue-purple)
- [ ] Accent color is Anthracite (#121212 - dark gray)
- [ ] Cards have white background with subtle borders
- [ ] Buttons are lavender with dark text
- [ ] All text is readable with good contrast

#### Component Styles
- [ ] Navbar has glass effect with light background
- [ ] Hero section maintains visibility
- [ ] Destination cards are white/light with lavender hover
- [ ] Service icons adapt to light theme
- [ ] Architecture section code blocks are readable
- [ ] Footer adapts to light colors
- [ ] Login/register forms have light glass cards
- [ ] Dashboard cards maintain light theme

### Theme Toggle Functionality
- [ ] Desktop: Sun icon shows in dark mode
- [ ] Desktop: Moon icon shows in light mode
- [ ] Mobile: "Mode Clair" text shows in dark mode
- [ ] Mobile: "Mode Sombre" text shows in light mode
- [ ] Theme persists after page reload
- [ ] Theme persists across navigation
- [ ] Smooth transition between themes (no jarring flash)
- [ ] No hydration errors or console warnings

### Theme Persistence
- [ ] Theme saved to localStorage as `hsem-theme`
- [ ] Opening new tab respects saved theme
- [ ] Closing and reopening browser respects saved theme
- [ ] Theme preference syncs across tabs (if using same domain)

## Responsive Design Tests

### Mobile (< 768px)
- [ ] Navbar collapses to hamburger menu
- [ ] All sections stack vertically
- [ ] Text remains readable
- [ ] Buttons are touchable (min 44px height)
- [ ] Forms are usable on mobile
- [ ] Cards adapt to narrow width
- [ ] Footer stacks properly

### Tablet (768px - 1024px)
- [ ] Navbar shows desktop layout
- [ ] Grid layouts adapt (2 columns where applicable)
- [ ] Images scale properly
- [ ] Navigation remains usable

### Desktop (> 1024px)
- [ ] Full navbar visible
- [ ] Multi-column layouts display
- [ ] Max-width containers center content
- [ ] All interactive elements accessible

## Authentication Tests

### Login Scenarios
1. **Valid Admin Login**:
   - Email: `admin@hoteliasem.cm`
   - Password: `Admin2026!`
   - Expected: Redirect to `/admin/dashboard`

2. **Valid Hotelier Login**:
   - Email: `marie.kouassi@luxehotels.cm`
   - Password: `Hotelier2026!`
   - Expected: Redirect to `/partner/dashboard`

3. **Valid Client Login**:
   - Email: `sophie.martin@email.com`
   - Password: `Client2026!`
   - Expected: Redirect to `/client/account`

4. **Invalid Credentials**:
   - Email: `wrong@email.com`
   - Password: `wrongpass`
   - Expected: Error message displayed

5. **Empty Fields**:
   - Expected: HTML5 validation errors

### Registration Scenarios
1. **New Client Registration**:
   - Fill all fields
   - Select "Client" role
   - Expected: Success, redirect to `/client/account`

2. **New Hotelier Registration**:
   - Fill all fields
   - Select "Hôtelier" role
   - Expected: Success, redirect to `/partner/dashboard`

3. **Duplicate Email**:
   - Use existing email
   - Expected: Error message (if backend validates)

### Session Management
- [ ] Login persists across page refreshes
- [ ] Logout clears session
- [ ] Protected routes redirect to login if not authenticated
- [ ] Correct role access on dashboards

## Performance Tests

### Load Times
- [ ] Landing page loads in < 3 seconds
- [ ] Images lazy load properly
- [ ] No layout shift during load
- [ ] Fonts load without FOIT (flash of invisible text)

### Animations
- [ ] Golden dust particles animate smoothly
- [ ] Logo entrance animation plays once
- [ ] Fade-in animations don't delay content
- [ ] Hover effects are smooth
- [ ] Theme toggle transition is smooth

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have aria-labels where needed
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with VoiceOver/NVDA)

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Samsung Internet

### Known Issues
- Backdrop-filter may not work on older browsers (graceful fallback in place)

## Bug Reports

### How to Report
If you find issues during testing:
1. Note the exact steps to reproduce
2. Include browser/device information
3. Take screenshots if visual issue
4. Note console errors if applicable
5. Document in GitHub issues or project tracker

## Demo Credentials Quick Reference

### For Testing Purposes

**Admin**:
- Email: `admin@hoteliasem.cm`
- Password: `Admin2026!`

**Hotelier**:
- Email: `marie.kouassi@luxehotels.cm`
- Password: `Hotelier2026!`

**Client**:
- Email: `sophie.martin@email.com`
- Password: `Client2026!`

See `DEMO_CREDENTIALS.md` for complete list of all 12 demo users.
