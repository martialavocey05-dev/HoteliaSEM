'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/lib/types/auth'
import { findUserByEmail, ROLE_DASHBOARDS } from '@/lib/mock-data/users'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('hsem_user')
    const storedToken = localStorage.getItem('hsem_token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      // Simulate API call with mock data
      const foundUser = findUserByEmail(credentials.email)
      
      if (!foundUser) {
        throw new Error('Email non trouvé')
      }

      if (foundUser.password !== credentials.password) {
        throw new Error('Mot de passe incorrect')
      }

      if (!foundUser.isActive) {
        throw new Error('Compte désactivé. Contactez le support.')
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = foundUser

      // Simulate token generation
      const mockToken = `hsem_token_${userWithoutPassword.id}_${Date.now()}`
      
      // Store in localStorage
      localStorage.setItem('hsem_user', JSON.stringify(userWithoutPassword))
      localStorage.setItem('hsem_token', mockToken)
      
      setUser(userWithoutPassword)

      // Redirect based on role
      const dashboard = ROLE_DASHBOARDS[userWithoutPassword.role]
      router.push(dashboard)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      // Check if email already exists
      const existingUser = findUserByEmail(data.email)
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé')
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        createdAt: new Date().toISOString(),
        isActive: true,
      }

      // Simulate token generation
      const mockToken = `hsem_token_${newUser.id}_${Date.now()}`
      
      // Store in localStorage
      localStorage.setItem('hsem_user', JSON.stringify(newUser))
      localStorage.setItem('hsem_token', mockToken)
      
      setUser(newUser)

      // Redirect based on role
      const dashboard = ROLE_DASHBOARDS[newUser.role]
      router.push(dashboard)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('hsem_user')
    localStorage.removeItem('hsem_token')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
