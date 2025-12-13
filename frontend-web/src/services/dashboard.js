import api from './api';

export const dashboardService = {
  getDashboardStats: async (filters = {}) => {
    const response = await api.get('/dashboard/stats', { params: filters });
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/dashboard/activities');
    return response.data;
  },

  getCollectionTrends: async () => {
    const response = await api.get('/dashboard/trends');
    return response.data;
  },

  getLoanPortfolio: async () => {
    const response = await api.get('/dashboard/portfolio');
    return response.data;
  },

  getRiskAnalytics: async () => {
    const response = await api.get('/dashboard/risk-analytics');
    return response.data;
  },

  getAgentPerformance: async () => {
    const response = await api.get('/dashboard/agent-performance');
    return response.data;
  },

  getComplianceMetrics: async () => {
    const response = await api.get('/dashboard/compliance');
    return response.data;
  },

  exportDashboardData: async (format = 'excel') => {
    const response = await api.get(`/dashboard/export?format=${format}`, { responseType: 'blob' });
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },

  markAlertAsRead: async (alertId) => {
    const response = await api.patch(`/dashboard/alerts/${alertId}/read`);
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get('/dashboard/system-health');
    return response.data;
  }
};

// Legacy exports for backward compatibility
export const getDashboardStats = dashboardService.getDashboardStats;
export const getRecentActivities = dashboardService.getRecentActivities;
export const getCollectionTrends = dashboardService.getCollectionTrends;
export const getLoanPortfolio = dashboardService.getLoanPortfolio;
