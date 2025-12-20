import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success && response.data.token) {
    return {
      success: true,
      data: {
        token: response.data.token,
        user: response.data.user || { name: 'User', role: 'admin' }
      }
    };
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success && response.data.token) {
    return {
      success: true,
      data: {
        token: response.data.token,
        user: response.data.user || { name: userData.name, role: 'user' }
      }
    };
  }
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/auth/updatedetails', userData);
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await api.put('/auth/updatepassword', passwordData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgotpassword', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/resetpassword/${token}`, { password });
  return response.data;
};
