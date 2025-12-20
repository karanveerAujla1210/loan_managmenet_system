import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as authService from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  const navigateTo = (path) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          await loadUser();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadUser = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      try {
        const response = await Promise.race([authService.getProfile(), timeoutPromise]);
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      } catch (timeoutErr) {
        console.log('Profile check timed out, using sessionStorage data');
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedPath = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case 'collector':
        return '/collector-work';
      case 'manager':
        return '/manager-supervision';
      case 'legal':
        return '/legal-cases';
      case 'admin':
      default:
        return '/dashboard';
    }
  };

  const login = async (formData) => {
    try {
      const response = await authService.login(formData);
      if (response?.success && response?.data) {
        const { token, user } = response.data;
        if (token) {
          sessionStorage.setItem('token', token);
          setToken(token);
        }
        if (user) {
          sessionStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        }
        setIsAuthenticated(true);
        setLoading(false);
        toast.success(`Welcome back, ${user?.name || 'user'}!`);
        const redirectPath = getRoleBasedPath(user?.role);
        setTimeout(() => navigateTo(redirectPath), 100);
        return { success: true };
      }
      const message = response?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (formData) => {
    try {
      const response = await authService.register(formData);
      if (response?.success) {
        const { token, user } = response.data || {};
        if (token) sessionStorage.setItem('token', token);
        if (user) sessionStorage.setItem('user', JSON.stringify(user));
        setToken(token || null);
        setIsAuthenticated(!!token);
        toast.success('Registration successful!');
        setTimeout(() => navigateTo('/dashboard'), 500);
        return { success: true };
      }
      const message = response?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      setTimeout(() => navigateTo('/login'), 500);
    }
  };

  const updateDetails = async (formData) => {
    try {
      const res = await authService.updateProfile(formData);
      if (res?.success) {
        setUser(res.data);
        sessionStorage.setItem('user', JSON.stringify(res.data));
        toast.success('Profile updated successfully');
        return { success: true };
      }
      const message = res?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authService.updatePassword({ currentPassword, newPassword });
      if (res?.success) {
        toast.success('Password updated successfully');
        return { success: true };
      }
      const message = res?.message || 'Password update failed';
      toast.error(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Password update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      if (res?.success) {
        toast.success('Password reset email sent');
        return { success: true };
      }
      const message = res?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to send reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      const res = await authService.resetPassword(resetToken, newPassword);
      if (res?.success) {
        toast.success('Password reset successful. Please log in.');
        return { success: true };
      }
      const message = res?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Password reset failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateDetails,
        updatePassword,
        forgotPassword,
        resetPassword,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
