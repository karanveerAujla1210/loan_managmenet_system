import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const getMISReports = async () => {
  return axios.get(`${API_URL}/reports/mis`);
};

export const getCollectionReport = async () => {
  return axios.get(`${API_URL}/reports/collection`);
};

export const getAgingReport = async () => {
  return axios.get(`${API_URL}/reports/aging`);
};
