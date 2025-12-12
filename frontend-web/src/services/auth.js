import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
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

export const updateProfile = async (userData) => {
  const response = await api.put('/auth/updatedetails', userData);
  return response.data;
};

export const updatePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/updatepassword', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
