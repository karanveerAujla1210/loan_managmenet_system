import { loanAPI } from './api';

export const loanService = {
  async createLoan(loanData) {
    try {
      const response = await loanAPI.create(loanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllLoans(params = {}) {
    try {
      const response = await loanAPI.getAll(params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getLoanById(id) {
    try {
      const response = await loanAPI.getById(id);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addPayment(loanId, paymentData) {
    try {
      const response = await loanAPI.addPayment(loanId, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addPTP(loanId, ptpData) {
    try {
      const response = await loanAPI.addPTP(loanId, ptpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addNote(loanId, noteData) {
    try {
      const response = await loanAPI.addNote(loanId, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};