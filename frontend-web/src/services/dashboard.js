import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRecentActivities = async () => {
  const response = await api.get('/dashboard/activities');
  return response.data;
};

export const getCollectionTrends = async () => {
  const response = await api.get('/dashboard/collections/trends');
  return response.data;
};

export const getLoanPortfolio = async () => {
  const response = await api.get('/dashboard/portfolio');
  return response.data;
};
