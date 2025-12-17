import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const getLegalCases = async () => {
  return axios.get(`${API_URL}/legal/cases`);
};

export const getLegalCase = async (caseId) => {
  return axios.get(`${API_URL}/legal/cases/${caseId}`);
};

export const updateLegalCase = async (caseId, data) => {
  return axios.patch(`${API_URL}/legal/cases/${caseId}`, data);
};
