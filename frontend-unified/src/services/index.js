import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const collectorService = {
  getTodayDashboard: async (collectorId) => {
    const response = await api.get(`/collector/${collectorId}/today-dashboard`);
    return response.data.data;
  },

  getMyCases: async (collectorId, filters = {}) => {
    const response = await api.get(`/collector/${collectorId}/cases`, { params: filters });
    return response.data.data;
  }
};

export const loanService = {
  getLoanById: async (loanId) => {
    const response = await api.get(`/loans/${loanId}`);
    return response.data.data;
  },

  getInstallments: async (loanId) => {
    const response = await api.get(`/loans/${loanId}/installments`);
    return response.data.data;
  },

  getPaymentHistory: async (loanId) => {
    const response = await api.get(`/loans/${loanId}/payments`);
    return response.data.data;
  }
};

export const paymentService = {
  recordPayment: async (loanId, paymentData) => {
    const response = await api.post(`/loans/${loanId}/payments`, paymentData);
    return response.data.data;
  }
};

export const remarkService = {
  addRemark: async (loanId, remarkData) => {
    const response = await api.post(`/loans/${loanId}/remarks`, remarkData);
    return response.data.data;
  }
};

export const promiseService = {
  addPromiseToPay: async (loanId, promiseData) => {
    const response = await api.post(`/loans/${loanId}/promises`, promiseData);
    return response.data.data;
  }
};

export const authService = {
  login: async (mobileOrEmail, password) => {
    const response = await api.post('/auth/login', {
      mobileOrEmail,
      password
    });
    return response.data.data;
  }
};

export const managerService = {
  getManagerDashboard: async (date) => {
    const response = await api.get('/manager/dashboard', { params: { date } });
    return response.data.data;
  }
};

export const legalService = {
  getLegalStats: async () => {
    const response = await api.get('/legal/stats');
    return response.data.data;
  },

  getLegalCases: async (status) => {
    const response = await api.get('/legal/cases', { params: { status } });
    return response.data.data;
  }
};

export const misService = {
  getDailyMIS: async (date) => {
    const response = await api.get('/mis/daily', { params: { date } });
    return response.data.data;
  },

  getPortfolioHealth: async (date) => {
    const response = await api.get('/mis/portfolio-health', { params: { date } });
    return response.data.data;
  },

  getRollRate: async (startDate, endDate) => {
    const response = await api.get('/mis/roll-rate', { params: { startDate, endDate } });
    return response.data.data;
  },

  getLegalLoss: async (date) => {
    const response = await api.get('/mis/legal-loss', { params: { date } });
    return response.data.data;
  },

  getUnitEconomics: async (date) => {
    const response = await api.get('/mis/unit-economics', { params: { date } });
    return response.data.data;
  },

  getTrends: async (days = 30) => {
    const response = await api.get('/mis/trends', { params: { days } });
    return response.data.data;
  },

  getMISDashboard: async (date) => {
    const response = await api.get('/mis/dashboard', { params: { date } });
    return response.data.data;
  }
};

export default api;
