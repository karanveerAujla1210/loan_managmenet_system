import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireRole = ({ roles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
