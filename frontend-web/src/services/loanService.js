import api from './api';

export const loanService = {
  async createLoan(loanData) {
    try {
      const response = await api.post('/loans', loanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllLoans(params = {}) {
    try {
      const response = await api.get('/loans', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getLoanById(id) {
    try {
      const response = await api.get(`/loans/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addPayment(loanId, paymentData) {
    try {
      const response = await api.post(`/loans/${loanId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addPTP(loanId, ptpData) {
    try {
      const response = await api.post(`/loans/${loanId}/ptp`, ptpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addNote(loanId, noteData) {
    try {
      const response = await api.post(`/loans/${loanId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async importLoans(loanData) {
    try {
      const response = await api.post('/loans/import', loanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};