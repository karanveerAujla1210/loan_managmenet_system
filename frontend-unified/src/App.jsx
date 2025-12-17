import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ModernLayout from './components/ModernLayout';

import ModernLogin from './pages/ModernLogin';
import ModernDashboard from './pages/ModernDashboard';
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
import OverdueBuckets from './pages/Overdue/OverdueBucketsNew';
import OverdueAging from './pages/Overdue/OverdueAging';
import FollowUpScheduler from './pages/Overdue/FollowUpScheduler';
import BankReconciliation from './pages/Reconciliation/BankReconciliation';
import PaymentProcessing from './pages/PaymentProcessing/index';
import MISReports from './pages/MISReports/index';
import LegalCases from './pages/Legal/LegalCases';
import Settings from './pages/Settings/index';
import Unauthorized from './pages/Unauthorized/index';
import Disputes from './pages/Disputes';
import Promises from './pages/Promises';
import CollectorPerformance from './pages/CollectorPerformance';
import Import from './pages/Import';

const LayoutWrapper = () => (
  <ModernLayout>
    <Outlet />
  </ModernLayout>
);

const router = createBrowserRouter([
  { path: '/login', element: <ModernLogin /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/unauthorized', element: <Unauthorized /> },
  {
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <LayoutWrapper />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <ModernDashboard /> },
      { path: '/credit-management', element: <CreditManagement /> },
      { path: '/loans', element: <Loans /> },
      { 
        path: '/overdue', 
        element: <OverdueBuckets />,
        children: [
          { path: '/overdue/buckets', element: <OverdueBuckets /> },
          { path: '/overdue/aging', element: <OverdueAging /> },
          { path: '/overdue/followup', element: <FollowUpScheduler /> }
        ]
      },
      { path: '/legal', element: <LegalCases /> },
      { path: '/payments', element: <PaymentProcessing /> },
      { path: '/reconciliation', element: <BankReconciliation /> },
      { path: '/customers', element: <Customers /> },
      { path: '/customers/:id', element: <CustomerDetail /> },
      { path: '/reports', element: <MISReports /> },
      { path: '/settings', element: <Settings /> },
      { path: '/audit', element: <AuditLog /> },
      { path: '/disputes', element: <Disputes /> },
      { path: '/promises', element: <Promises /> },
      { path: '/collector-performance', element: <CollectorPerformance /> },
      { path: '/import', element: <Import /> },
      { path: '/upload', element: <Upload /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 font-sans">
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
