import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const getOverdueBuckets = async () => {
  return axios.get(`${API_URL}/overdue/buckets`);
};
