import api from './api';

class AnalyticsService {
  async getOverview(filters = {}) {
    const response = await api.get('/analytics/overview', { params: filters });
    return response.data;
  }

  async getBuckets(filters = {}) {
    const response = await api.get('/analytics/buckets', { params: filters });
    return response.data;
  }

  async getCashflowForecast(filters = {}) {
    const response = await api.get('/analytics/cashflow-forecast', { params: filters });
    return response.data;
  }

  async getRollRates(fromDate, toDate) {
    const response = await api.get('/analytics/roll-rates', { 
      params: { fromDate, toDate } 
    });
    return response.data;
  }

  async getAgentPerformance(filters = {}) {
    const response = await api.get('/analytics/agent-performance', { params: filters });
    return response.data;
  }

  async getLegal(filters = {}) {
    const response = await api.get('/analytics/legal', { params: filters });
    return response.data;
  }

  async getClosed(filters = {}) {
    const response = await api.get('/analytics/closed', { params: filters });
    return response.data;
  }

  async getDefaults(filters = {}) {
    const response = await api.get('/analytics/defaults', { params: filters });
    return response.data;
  }

  async getVintageAnalysis(cohort, filters = {}) {
    const response = await api.get(`/analytics/vintage/${cohort}`, { params: filters });
    return response.data;
  }

  async getDPDDistribution(filters = {}) {
    const response = await api.get('/analytics/dpd-distribution', { params: filters });
    return response.data;
  }

  async getCollectionEfficiency(filters = {}) {
    const response = await api.get('/analytics/collection-efficiency', { params: filters });
    return response.data;
  }
}

export default new AnalyticsService();