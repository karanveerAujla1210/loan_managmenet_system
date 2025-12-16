import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ModernLayout from './components/Layout/ModernLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/Customers/Detail';
import Loans from './pages/Loans';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuditLog from './pages/AuditLog';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import CreditManagement from './pages/CreditManagement/index';
import OverdueBuckets from './pages/Overdue/OverdueBuckets';
import BankReconciliation from './pages/Reconciliation/BankReconciliation';
import PaymentProcessing from './pages/PaymentProcessing/index';
import MISReports from './pages/MISReports/index';
import LegalCases from './pages/Legal/LegalCases';
import Settings from './pages/Settings/index';

const ModernLayoutWrapper = () => (
  <ModernLayout>
    <Outlet />
  </ModernLayout>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => (
  <AuthProvider>
    <div className="min-h-screen bg-gray-50 font-sans">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  </AuthProvider>
);

const routerWithLayout = createBrowserRouter([
  {
    element: <AppContent />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/login', element: <Login /> },
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
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/credit-management', element: <CreditManagement /> },
          { path: '/loans', element: <Loans /> },
          { path: '/overdue', element: <OverdueBuckets /> },
          { path: '/legal', element: <LegalCases /> },
          { path: '/payments', element: <PaymentProcessing /> },
          { path: '/reconciliation', element: <BankReconciliation /> },
          { path: '/customers', element: <Customers /> },
          { path: '/customers/:id', element: <CustomerDetail /> },
          { path: '/reports', element: <MISReports /> },
          { path: '/settings', element: <Settings /> },
          { path: '/audit', element: <AuditLog /> },
          { path: '/upload', element: <Upload /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

function AppModern() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routerWithLayout} />
    </QueryClientProvider>
  );
}

export default AppModern;
