import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Customers } from './pages/Customers'
import { CustomerDetail } from './pages/CustomerDetail'
import { CreditAnalysis } from './pages/CreditAnalysis'
import { Collections } from './pages/Collections'
import { CaseClosure } from './pages/CaseClosure'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { useAuth } from './context/AuthContext'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'customers', element: <Customers /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'credit-analysis', element: <CreditAnalysis /> },
      { path: 'collections', element: <Collections /> },
      { path: 'case-closure', element: <CaseClosure /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
])

export const Router: React.FC = () => {
  return <RouterProvider router={router} />
}
