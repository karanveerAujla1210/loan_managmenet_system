import { api } from './api';

export const importCustomers = async (data) => {
  return api.post('/import/customers', { data });
};

export const importLoans = async (data) => {
  return api.post('/import/loans', { data });
};

export const importPayments = async (data) => {
  return api.post('/import/payments', { data });
};

export const importUsers = async (data) => {
  return api.post('/import/users', { data });
};
