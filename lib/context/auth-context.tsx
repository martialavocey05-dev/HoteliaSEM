'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData } from '@/lib/types/auth'
import { findUserByEmail, ROLE_DASHBOARDS } from '@/lib/mock-data/users'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  forceDisconnect: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('hsem_user')
    const storedToken = localStorage.getItem('hsem_token')

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const foundUser = findUserByEmail(credentials.email)

      if (!foundUser) {
        throw new Error('Email non trouve')
      }

      if (foundUser.password !== credentials.password) {
        throw new Error('Mot de passe incorrect')
      }

      if (!foundUser.isActive) {
        throw new Error('Compte desactive. Contactez le support.')
      }

      const { password, ...userWithoutPassword } = foundUser
      const mockToken = `hsem_token_${userWithoutPassword.id}_${Date.now()}`

      localStorage.setItem('hsem_user', JSON.stringify(userWithoutPassword))
      localStorage.setItem('hsem_token', mockToken)
      setUser(userWithoutPassword)

      const dashboard = ROLE_DASHBOARDS[userWithoutPassword.role]
      router.push(dashboard)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const existingUser = findUserByEmail(data.email)
      if (existingUser) {
        throw new Error('Cet email est deja utilise')
      }

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

      const mockToken = `hsem_token_${newUser.id}_${Date.now()}`
      localStorage.setItem('hsem_user', JSON.stringify(newUser))
      localStorage.setItem('hsem_token', mockToken)
      setUser(newUser)

      const dashboard = ROLE_DASHBOARDS[newUser.role]
      router.push(dashboard)
    } catch (error) {
      throw error
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('hsem_user')
    localStorage.removeItem('hsem_token')
    setUser(null)
    router.push('/')
  }, [router])

  /**
   * Force disconnect a specific user by their ID.
   * If the currently logged-in user matches the given ID, they are logged out immediately.
   */
  const forceDisconnect = useCallback(
    (userId: string) => {
      if (user && user.id === userId) {
        logout()
      }
    },
    [user, logout]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forceDisconnect,
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
