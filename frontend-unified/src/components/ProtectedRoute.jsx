import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, requiredRoles, children }) => {
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRoles specified, check if user has permission
  if (requiredRoles && requiredRoles.length > 0) {
    const hasPermission = requiredRoles.includes('all') || requiredRoles.includes(user.role);
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
