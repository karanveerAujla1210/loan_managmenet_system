import api from './api';

export const dashboardService = {
  // Combined dashboard data in single API call
  getDashboardData: async (filters = {}) => {
    const response = await api.get('/dashboard/combined', { params: filters });
    return response.data;
  },

  // Paginated data fetching
  getDashboardStats: async (filters = {}) => {
    const response = await api.get('/dashboard/stats', { 
      params: { ...filters, cache: true }
    });
    return response.data;
  },

  getRecentActivities: async (limit = 10) => {
    const response = await api.get('/dashboard/activities', {
      params: { limit, cache: true }
    });
    return response.data;
  },

  getCollectionTrends: async (period = '6m') => {
    const response = await api.get('/dashboard/trends', {
      params: { period, cache: true }
    });
    return response.data;
  },

  getLoanPortfolio: async () => {
    const response = await api.get('/dashboard/portfolio', {
      params: { cache: true }
    });
    return response.data;
  },

  getRiskAnalytics: async () => {
    const response = await api.get('/dashboard/risk-analytics', {
      params: { cache: true }
    });
    return response.data;
  },

  // Lightweight health check
  getSystemHealth: async () => {
    const response = await api.get('/dashboard/health');
    return response.data;
  },

  // Batch operations
  refreshAllData: async () => {
    const response = await api.post('/dashboard/refresh');
    return response.data;
  }
};

// Cache utilities
export const cacheKeys = {
  dashboardStats: (filters) => ['dashboard-stats', filters],
  activities: (limit) => ['activities', limit],
  trends: (period) => ['trends', period],
  portfolio: () => ['portfolio'],
  riskAnalytics: () => ['risk-analytics'],
  systemHealth: () => ['system-health']
};