import React, { createContext, useContext, useState } from 'react'

type User = {
  email: string
} | null

type AuthContextType = {
  user: User
  login: (payload: { email: string; password?: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null)

  const login = ({ email }: { email: string; password?: string }) => {
    // In a real app you'd call your API here and persist tokens
    setUser({ email })
    try {
      localStorage.setItem('crm_user', JSON.stringify({ email }))
    } catch {}
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('crm_user')
    } catch {}
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
