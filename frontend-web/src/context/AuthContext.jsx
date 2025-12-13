import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as authService from '../services/auth';

const AuthContext = createContext();

// Mock users for demo (fallback)
const MOCK_USERS = [
  { id: 'user1', name: 'Karanveer Singh', email: 'karanveer@loancrm.com', password: 'mbl123', role: 'admin' },
  { id: 'user2', name: 'Arvind', email: 'arvind@loancrm.com', password: 'mbl123', role: 'manager' },
  { id: 'user3', name: 'Admin', email: 'admin@loancrm.com', password: 'mbl123', role: 'admin' },
  { id: 'user4', name: 'Manish', email: 'manish@loancrm.com', password: 'mbl123', role: 'collector' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Load user on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Load user data from backend
  const loadUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error loading user:', err);
      // Try mock authentication as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const response = await authService.register(formData);
      if (response?.success) {
        const { token, user } = response.data || {};
        if (token) {
          localStorage.setItem('token', token);
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        }
        setToken(token || null);
        setIsAuthenticated(!!token);
        toast.success('Registration successful!');
        navigate('/dashboard');
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

  // Login user
  const login = async (formData) => {
    try {
      const response = await authService.login(formData);
      if (response?.success) {
        const { token, user } = response.data || {};
        if (token) localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
        setToken(token || null);
        setUser(user || null);
        setIsAuthenticated(!!token);
        toast.success(`Welcome back, ${user?.name || 'user'}!`);
        navigate('/dashboard');
        return { success: true };
      }
      toast.error(response?.message || 'Login failed');
      return { success: false, error: response?.message };
    } catch (err) {
      // Fallback to mock authentication
      const mockUser = MOCK_USERS.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      
      if (mockUser) {
        const mockToken = 'mock-jwt-token-' + mockUser.id;
        const userData = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        };
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(mockToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${mockUser.name}!`);
        navigate('/dashboard');
        return { success: true };
      } else {
        toast.error('Invalid email or password');
        return { success: false, error: 'Invalid credentials' };
      }
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  // Update user details
  const updateDetails = async (formData) => {
    try {
      const res = await authService.updateProfile(formData);
      if (res?.success) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
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

  // Update password
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

  // Forgot password
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

  // Reset password
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
