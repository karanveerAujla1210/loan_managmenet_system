import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Suspense } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SystemHealthMonitor from './components/SystemHealthMonitor';
import './styles/dashboard.css';

// Lazy loaded components
import { 
  Dashboard, 
  Customers, 
  Loans, 
  Collections, 
  Upload, 
  Profile,
  ComponentLoader 
} from './components/LazyComponents';

// Regular components (lightweight)
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PageNotFound from './pages/PageNotFound';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';

// Layout wrapper component
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

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
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes - Temporarily removing authentication */}
              <Route element={<LayoutWrapper />}>
                <Route 
                  path="/dashboard" 
                  element={
                    <Suspense fallback={<ComponentLoader />}>
                      <Dashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/profile" 
                  element={
                    <Suspense fallback={<ComponentLoader />}>
                      <Profile />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/loans" 
                  element={
                    <Suspense fallback={<ComponentLoader />}>
                      <Loans />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/customers" 
                  element={
                    <Suspense fallback={<ComponentLoader />}>
                      <Customers />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/collections" 
                  element={
                    <Suspense fallback={<ComponentLoader />}>
                      <Collections />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/upload" 
                  element={
                    <Suspense fallback={<ComponentLoader />}>
                      <Upload />
                    </Suspense>
                  } 
                />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
                error: {
                  duration: 5000,
                },
              }}
            />
            
            {/* System Health Monitor */}
            <SystemHealthMonitor />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App