import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const getOverdueBuckets = async () => {
  return axios.get(`${API_URL}/overdue/buckets`);
};
