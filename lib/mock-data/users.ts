import { User } from '@/lib/types/auth'

export const MOCK_USERS: Array<User & { password: string }> = [
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

  // Hôteliers
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
    firstName: 'Françoise',
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
    firstName: 'Amélie',
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
    firstName: 'Céline',
    lastName: 'Moukouri',
    phone: '+237699012345',
    role: 'client',
    createdAt: '2024-07-01T15:50:00Z',
    isActive: true,
  },
]

export const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  hotelier: '/partner/dashboard',
  client: '/client/account',
} as const

export const findUserByEmail = (email: string) => {
  return MOCK_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export const getUsersByRole = (role: User['role']) => {
  return MOCK_USERS.filter((user) => user.role === role)
}
