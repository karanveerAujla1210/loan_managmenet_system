import api from './api';

export const getOverdueLoans = async (params = {}) => {
  const response = await api.get('/collections/overdue', { params });
  return response.data;
};

export const getCollectionReports = async (params = {}) => {
  const response = await api.get('/collections/reports', { params });
  return response.data;
};

export const createFollowUp = async (loanId, followUpData) => {
  const response = await api.post(`/collections/loans/${loanId}/followup`, followUpData);
  return response.data;
};

export const getFollowUpHistory = async (loanId) => {
  const response = await api.get(`/collections/loans/${loanId}/followup/history`);
  return response.data;
};

export const updateCollectionStatus = async (loanId, status) => {
  const response = await api.put(`/collections/loans/${loanId}/status`, { status });
  return response.data;
};

export const initiateLegalAction = async (loanId, legalData) => {
  const response = await api.post(`/collections/loans/${loanId}/legal`, legalData);
  return response.data;
};

export const getCollectionAgents = async () => {
  const response = await api.get('/collections/agents');
  return response.data;
};

export const assignAgent = async (loanId, agentId) => {
  const response = await api.put(`/collections/loans/${loanId}/assign`, { agentId });
  return response.data;
};
