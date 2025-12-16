import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

export const RequireRole = ({ roles, children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  
  return children;
};
