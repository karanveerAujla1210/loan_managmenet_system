import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Import modern pages
import ModernLogin from './pages/ModernLogin';
import ModernDashboard from './pages/ModernDashboard';
import ModernCustomers from './pages/ModernCustomers';
import ModernCollections from './pages/ModernCollections';
import Leads from './pages/Leads';
import CreditAnalysis from './pages/CreditAnalysis';
import Operations from './pages/Operations';
import Disbursement from './pages/Disbursement';
import Reports from './pages/Reports';
import CaseClosure from './pages/CaseClosure';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AppLayout from './components/Layout/AppLayout';

// Layout wrapper component
const LayoutWrapper = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

// Build a route tree and opt-in to future v7 behaviors to silence warnings
const router = createBrowserRouter(
  [
    { path: '/login', element: <ModernLogin /> },
    {
      element: <LayoutWrapper />,
      children: [
        { path: '/', element: <ModernDashboard /> },
        { path: '/customers', element: <ModernCustomers /> },
        { path: '/leads', element: <Leads /> },
        { path: '/credit-analysis', element: <CreditAnalysis /> },
        { path: '/operations', element: <Operations /> },
        { path: '/disbursement', element: <Disbursement /> },
        { path: '/collections', element: <ModernCollections /> },
        { path: '/reports', element: <Reports /> },
        { path: '/case-closure', element: <CaseClosure /> },
        { path: '/profile', element: <Profile /> },
        { path: '/settings', element: <Settings /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
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
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
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
      <div className="min-h-screen bg-gray-50 font-sans">
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
