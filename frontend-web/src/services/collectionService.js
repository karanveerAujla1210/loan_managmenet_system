import { loanAPI } from './api';

export const collectionService = {
  async getDueToday() {
    try {
      const response = await loanAPI.getDue('today');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getOverdue() {
    try {
      const response = await loanAPI.getDue('overdue');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async recordPayment(loanId, paymentData) {
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