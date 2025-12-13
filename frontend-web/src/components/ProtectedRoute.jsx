import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  // For now, just render children without authentication check
  // This allows the app to load and we can add auth back later
  return children;
};

export default ProtectedRoute;
