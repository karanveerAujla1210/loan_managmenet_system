import React from 'react'
import { Sidebar } from './components/Sidebar'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <Dashboard />
      </main>
    </div>
  )
}
