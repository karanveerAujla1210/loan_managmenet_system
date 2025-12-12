import api from './api';

export const getLoans = async (params = {}) => {
  const response = await api.get('/loans', { params });
  return response.data;
};

export const getLoan = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

export const createLoan = async (loanData) => {
  const response = await api.post('/loans', loanData);
  return response.data;
};

export const updateLoan = async (id, loanData) => {
  const response = await api.put(`/loans/${id}`, loanData);
  return response.data;
};

export const deleteLoan = async (id) => {
  const response = await api.delete(`/loans/${id}`);
  return response.data;
};

export const getLoanPayments = async (loanId) => {
  const response = await api.get(`/loans/${loanId}/payments`);
  return response.data;
};

export const createLoanPayment = async (loanId, paymentData) => {
  const response = await api.post(`/loans/${loanId}/payments`, paymentData);
  return response.data;
};
