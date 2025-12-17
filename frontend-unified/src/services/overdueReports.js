
import api from './api';

export const overdueReportsService = {
  // Get overdue summary
  getOverdueSummary: async () => {
    const response = await api.get('/overdue-reports/summary');
    return response.data;
  },

  // Get detailed overdue report
  getDetailedOverdueReport: async (params = {}) => {
    const response = await api.get('/overdue-reports/detailed', { params });
    return response.data;
  },

  // Get aging report
  getOverdueAgingReport: async (params = {}) => {
    const response = await api.get('/overdue-reports/aging', { params });
    return response.data;
  },

  // Export overdue report
  exportOverdueReport: async (params = {}) => {
    const response = await api.get('/overdue-reports/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
