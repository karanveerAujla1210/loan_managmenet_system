import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const uploadBankStatement = async (formData) => {
  return axios.post(`${API_URL}/reconciliation/upload`, formData);
};

export const reconcilePayments = async (matchedPayments) => {
  return axios.post(`${API_URL}/reconciliation/reconcile`, { matchedPayments });
};
