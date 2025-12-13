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
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      const { token } = res.data;
      
      // Use secure cookie instead of localStorage for token storage
      setToken(token);
      setAuthToken(token);
      await loadUser();
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/dashboard');
        return { success: true };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, error: response.message };
      }
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
      const res = await axios.put(`${API_URL}/auth/updatedetails`, formData);
      setUser(res.data.data);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`${API_URL}/auth/updatepassword`, {
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Password update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/auth/forgotpassword`, { email });
      toast.success('Password reset email sent');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to send reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (resetToken, newPassword) => {
    try {
      await axios.put(`${API_URL}/auth/resetpassword/${resetToken}`, {
        password: newPassword
      });
      toast.success('Password reset successful. Please log in.');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Password reset failed';
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
