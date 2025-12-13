import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Import pages directly
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

// Layout wrapper component
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Build a route tree and opt-in to future v7 behaviors to silence warnings
const router = createBrowserRouter(
  [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> },
    {
      element: (
        <AuthProvider>
          <ProtectedRoute>
            <LayoutWrapper />
          </ProtectedRoute>
        </AuthProvider>
      ),
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        { path: '/customers', element: <Customers /> },
        { path: '/customers/:id', element: <CustomerDetail /> },
          { path: '/audit', element: <AuditLog /> },
        { path: '/loans', element: <Loans /> },
        { path: '/collections', element: <Collections /> },
        { path: '/upload', element: <Upload /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
    { path: '*', element: <Navigate to="/dashboard" replace /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;