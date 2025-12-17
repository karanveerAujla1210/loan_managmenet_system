import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const getMISReports = async () => {
  return axios.get(`${API_URL}/reports/mis`);
};

export const getCollectionReport = async () => {
  return axios.get(`${API_URL}/reports/collection`);
};

export const getAgingReport = async () => {
  return axios.get(`${API_URL}/reports/aging`);
};
