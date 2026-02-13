export type UserRole = 'client' | 'hotelier' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  profileImage?: string
  createdAt: string
  isActive: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
}
