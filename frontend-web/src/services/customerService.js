import { customerAPI } from './api';

export const customerService = {
  async createCustomer(customerData) {
    try {
      const response = await customerAPI.create(customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllCustomers(params = {}) {
    try {
      const response = await customerAPI.getAll(params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getCustomerById(id) {
    try {
      const response = await customerAPI.getById(id);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateCustomer(id, customerData) {
    try {
      const response = await customerAPI.update(id, customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};