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
    { path: '/register', element: React.createElement(require('./pages/Register').default) },
    { path: '/forgot-password', element: React.createElement(require('./pages/ForgotPassword').default) },
    { path: '/reset-password', element: React.createElement(require('./pages/ResetPassword').default) },
    {
      element: (
        <ProtectedRoute>
          <LayoutWrapper />
        </ProtectedRoute>
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
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <RouterProvider router={router} />
          <Toaster position="top-right" />
          {/* <SystemHealthMonitor /> */}
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;