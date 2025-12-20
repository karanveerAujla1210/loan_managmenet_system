import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRoles, children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRoles specified, check if user has permission
  if (requiredRoles && requiredRoles.length > 0) {
    const hasPermission = requiredRoles.includes('all') || requiredRoles.includes(user?.role);
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
