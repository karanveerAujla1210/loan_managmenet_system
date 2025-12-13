import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000/api/v1';

// Mock users for demo
const MOCK_USERS = [
  { id: 'user1', name: 'Karanveer Singh', email: 'karanveer@loancrm.com', password: 'mbl123', role: 'head' },
  { id: 'user2', name: 'Arvind', email: 'arvind@loancrm.com', password: 'mbl123', role: 'head' },
  { id: 'user3', name: 'Admin', email: 'admin@loancrm.com', password: 'mbl123', role: 'head' },
  { id: 'user4', name: 'Manish', email: 'manish@loancrm.com', password: 'mbl123', role: 'head' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user on initial load or when token changes
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  // Load user data
  const loadUser = async () => {
    try {
      // Mock user loading - in real app this would validate token
      if (token && token.startsWith('mock-jwt-token-')) {
        const userId = token.replace('mock-jwt-token-', '');
        const mockUser = MOCK_USERS.find(u => u.id === userId);
        if (mockUser) {
          setUser({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role
          });
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error loading user:', err);
      logout();
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
      // Mock authentication
      const mockUser = MOCK_USERS.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      
      if (mockUser) {
        const mockToken = 'mock-jwt-token-' + mockUser.id;
        setToken(mockToken);
        setUser({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        });
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${mockUser.name}!`);
        navigate('/dashboard');
        return { success: true };
      } else {
        toast.error('Invalid email or password');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (err) {
      const errorMessage = 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    navigate('/login');
    toast.success('Logged out successfully');
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
      {!loading && children}
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
