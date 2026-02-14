import { User, UserRole } from '@/lib/types/auth'

export type UserWithPassword = User & { password: string }

// Mutable users array (simulates a database)
let mockUsers: UserWithPassword[] = [
  // Administrateurs
  {
    id: 'admin-001',
    email: 'admin@hsem.cm',
    password: 'Admin@2024!',
    firstName: 'Marie',
    lastName: 'Ndongo',
    phone: '+237677123456',
    role: 'admin',
    profileImage: '/images/avatar-admin.jpg',
    createdAt: '2024-01-15T08:00:00Z',
    isActive: true,
  },
  {
    id: 'admin-002',
    email: 'paul.ekotto@hsem.cm',
    password: 'AdminSecure123!',
    firstName: 'Paul',
    lastName: 'Ekotto',
    phone: '+237699876543',
    role: 'admin',
    createdAt: '2024-02-10T10:30:00Z',
    isActive: true,
  },

  // Hoteliers
  {
    id: 'hotelier-001',
    email: 'hotel.meridien@hsem.cm',
    password: 'Hotelier@2024',
    firstName: 'Jean-Claude',
    lastName: 'Mbarga',
    phone: '+237677234567',
    role: 'hotelier',
    profileImage: '/images/avatar-hotelier.jpg',
    createdAt: '2024-03-05T14:20:00Z',
    isActive: true,
  },
  {
    id: 'hotelier-002',
    email: 'hilton.yaounde@hsem.cm',
    password: 'HiltonYde2024!',
    firstName: 'Sophie',
    lastName: 'Atangana',
    phone: '+237699345678',
    role: 'hotelier',
    createdAt: '2024-03-20T09:15:00Z',
    isActive: true,
  },
  {
    id: 'hotelier-003',
    email: 'kribi.beach@hsem.cm',
    password: 'KribiResort@24',
    firstName: 'Emmanuel',
    lastName: 'Biya',
    phone: '+237677456789',
    role: 'hotelier',
    createdAt: '2024-04-01T11:45:00Z',
    isActive: true,
  },
  {
    id: 'hotelier-004',
    email: 'plaza.douala@hsem.cm',
    password: 'PlazaDla2024!',
    firstName: 'Francoise',
    lastName: 'Ngo Balla',
    phone: '+237699567890',
    role: 'hotelier',
    createdAt: '2024-04-15T13:30:00Z',
    isActive: true,
  },

  // Clients
  {
    id: 'client-001',
    email: 'client@example.com',
    password: 'Client123!',
    firstName: 'Thomas',
    lastName: 'Kamdem',
    phone: '+237677345678',
    role: 'client',
    createdAt: '2024-05-10T16:00:00Z',
    isActive: true,
  },
  {
    id: 'client-002',
    email: 'amelie.fotso@gmail.com',
    password: 'Amelie@2024',
    firstName: 'Amelie',
    lastName: 'Fotso',
    phone: '+237699678901',
    role: 'client',
    createdAt: '2024-05-15T10:20:00Z',
    isActive: true,
  },
  {
    id: 'client-003',
    email: 'kevin.nana@yahoo.fr',
    password: 'Kevin2024!',
    firstName: 'Kevin',
    lastName: 'Nana',
    phone: '+237677789012',
    role: 'client',
    createdAt: '2024-06-01T14:30:00Z',
    isActive: true,
  },
  {
    id: 'client-004',
    email: 'linda.tchoumi@outlook.com',
    password: 'Linda@Secure24',
    firstName: 'Linda',
    lastName: 'Tchoumi',
    phone: '+237699890123',
    role: 'client',
    createdAt: '2024-06-10T09:45:00Z',
    isActive: true,
  },
  {
    id: 'client-005',
    email: 'boris.essomba@gmail.com',
    password: 'Boris123!Safe',
    firstName: 'Boris',
    lastName: 'Essomba',
    phone: '+237677901234',
    role: 'client',
    createdAt: '2024-06-20T11:15:00Z',
    isActive: true,
  },
  {
    id: 'client-006',
    email: 'celine.moukouri@hotmail.fr',
    password: 'Celine@2024Pass',
    firstName: 'Celine',
    lastName: 'Moukouri',
    phone: '+237699012345',
    role: 'client',
    createdAt: '2024-07-01T15:50:00Z',
    isActive: true,
  },
]

// Keep MOCK_USERS as a getter for backward compatibility
export const MOCK_USERS = mockUsers

export const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  hotelier: '/partner/dashboard',
  client: '/client/account',
} as const

export const findUserByEmail = (email: string) => {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export const getUsersByRole = (role: UserRole) => {
  return mockUsers.filter((user) => user.role === role)
}

// --- Admin Management Functions ---

/**
 * Deactivate a user by ID. Prevents admins from being deactivated.
 * Returns true on success, false on failure.
 */
export const deactivateUser = (userId: string): boolean => {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user || user.role === 'admin') return false
  user.isActive = false
  return true
}

/**
 * Reactivate a user by ID. Prevents admins from being modified.
 * Returns true on success, false on failure.
 */
export const reactivateUser = (userId: string): boolean => {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user || user.role === 'admin') return false
  user.isActive = true
  return true
}

/**
 * Delete a user by ID. Prevents admins from being deleted.
 * Returns true on success, false on failure.
 */
export const deleteUser = (userId: string): boolean => {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user || user.role === 'admin') return false
  mockUsers = mockUsers.filter((u) => u.id !== userId)
  // Update the exported reference
  MOCK_USERS.length = 0
  MOCK_USERS.push(...mockUsers)
  return true
}
