import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole } from '../types'

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('crm_user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Mock authentication - in production, call your API
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock user data based on email
      const roles: { [key: string]: UserRole } = {
        'admin@crm.com': 'admin',
        'officer@crm.com': 'loan_officer',
        'collector@crm.com': 'collector',
        'analyst@crm.com': 'analyst',
        'manager@crm.com': 'manager'
      }

      const role = roles[email] || 'loan_officer'

      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').trim() || 'User',
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=1741FF&color=fff`
      }

      setUser(userData)
      localStorage.setItem('crm_user', JSON.stringify(userData))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    try {
      localStorage.removeItem('crm_user')
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
