import api from '../utils/axiosInstance';

const DashboardService = {
  getMetrics: () => api.get('/dashboard/metrics').then(r => r.data.data),
  getLoanPerformance: () => api.get('/dashboard/loan-performance').then(r => r.data.data),
  getCollectionsTrend: () => api.get('/dashboard/collections-trend').then(r => r.data.data),
  getDpdBuckets: () => api.get('/dashboard/dpd-buckets').then(r => r.data.data),
  getLeadsStats: () => api.get('/dashboard/leads-stats').then(r => r.data.data),
  getRecentCustomers: (limit=10) => api.get(`/dashboard/recent-customers?limit=${limit}`).then(r => r.data.data),
  getRecentLoans: (limit=10) => api.get(`/dashboard/recent-loans?limit=${limit}`).then(r => r.data.data),
  getTodayCollections: () => api.get('/dashboard/today-collections').then(r => r.data.data),
  getPendingApprovals: () => api.get('/dashboard/pending-approvals').then(r => r.data.data),
  getMe: () => api.get('/v1/auth/me').then(r => r.data.data)
};

export default DashboardService;
