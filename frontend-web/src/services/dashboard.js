import api from './api';

// Mock dashboard data
const mockStats = {
  totalCustomers: 1250,
  activeLoans: 890,
  totalDisbursed: 45000000,
  pendingApprovals: 23,
  monthlyCollections: 3200000,
  overdueLoans: 45,
  portfolioHealthScore: 87,
  collectionEfficiency: 92,
  npaRatio: 3.2,
  averageTicketSize: 50000,
  bucketDistribution: [
    { bucket: '0-30 Days', count: 650, percentage: 73 },
    { bucket: '31-60 Days', count: 120, percentage: 13 },
    { bucket: '61-90 Days', count: 80, percentage: 9 },
    { bucket: '90+ Days', count: 40, percentage: 5 }
  ],
  dpdAnalysis: {
    '0-30': 650,
    '31-60': 120,
    '61-90': 80,
    '91+': 40
  },
  criticalAlerts: [
    { message: 'High risk customers requiring immediate attention', count: 12 },
    { message: 'Loans overdue by 90+ days', count: 8 }
  ]
};

const mockActivities = [
  {
    id: 1,
    action: 'Loan Disbursed',
    customer: 'NITIN CHAURASIA',
    amount: 25000,
    date: new Date().toISOString(),
    type: 'disbursement'
  },
  {
    id: 2,
    action: 'Payment Received',
    customer: 'AFREEN',
    amount: 2500,
    date: new Date(Date.now() - 3600000).toISOString(),
    type: 'payment'
  },
  {
    id: 3,
    action: 'New Customer Added',
    customer: 'PAWAN KESARWANI',
    amount: null,
    date: new Date(Date.now() - 7200000).toISOString(),
    type: 'customer'
  }
];

export const dashboardService = {
  getDashboardStats: async (filters = {}) => {
    try {
      const response = await api.get('/dashboard/stats', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: true,
        data: mockStats,
        trends: {
          customersGrowth: 12.5,
          loansGrowth: 8.3,
          collectionsGrowth: 15.2
        }
      };
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await api.get('/dashboard/activities');
      return response.data;
    } catch (error) {
      return {
        success: true,
        data: mockActivities
      };
    }
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
export const getDashboardActivities = dashboardService.getRecentActivities;
export const getRecentActivities = dashboardService.getRecentActivities;
export const getCollectionTrends = dashboardService.getCollectionTrends;
export const getLoanPortfolio = dashboardService.getLoanPortfolio;
