import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import modern pages
import Welcome from './pages/Welcome';
import ModernLogin from './pages/ModernLogin';
import ModernDashboard from './pages/ModernDashboard';
import ModernCustomers from './pages/ModernCustomers';
import ModernLeads from './pages/ModernLeads';
import ModernCollections from './pages/ModernCollections';
import ModernLayout from './components/Layout/ModernLayout';

// Import existing pages for fallback
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/Customers/Detail';
import Loans from './pages/Loans';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuditLog from './pages/AuditLog';
import Collections from './pages/Collections';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

// Modern Layout wrapper
const ModernLayoutWrapper = () => {
  return (
    <ModernLayout>
      <Outlet />
    </ModernLayout>
  );
};



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

// Inner component that uses router context
const AppContent = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Outlet />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
};

// Update router to include AppContent as root layout
const routerWithLayout = createBrowserRouter(
  [
    {
      element: <AppContent />,
      children: [
        { path: '/', element: <Welcome /> },
        { path: '/welcome', element: <Welcome /> },
        { path: '/login', element: <ModernLogin /> },
        { path: '/login-old', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
        { path: '/reset-password', element: <ResetPassword /> },
        {
          element: (
            <ProtectedRoute>
              <ModernLayoutWrapper />
            </ProtectedRoute>
          ),
          children: [
            { path: '/dashboard', element: <ModernDashboard /> },
            { path: '/dashboard-old', element: <Dashboard /> },
            { path: '/customers', element: <ModernCustomers /> },
            { path: '/customers-old', element: <Customers /> },
            { path: '/customers/:id', element: <CustomerDetail /> },
            { path: '/leads', element: <ModernLeads /> },
            { path: '/collections', element: <ModernCollections /> },
            { path: '/collections-old', element: <Collections /> },
            { path: '/loans', element: <Loans /> },
            { path: '/audit', element: <AuditLog /> },
            { path: '/upload', element: <Upload /> },
            { path: '/profile', element: <Profile /> },
          ],
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function AppModern() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routerWithLayout} />
    </QueryClientProvider>
  );
}

export default AppModern;