const customerService = require('./customers.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class CustomerController {
  // Create customer
  async createCustomer(req, res) {
    try {
      const customer = await customerService.createCustomer(req.body);
      return successResponse(res, customer, 'Customer created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Get all customers
  async getAllCustomers(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search
      };
      const customers = await customerService.getAllCustomers(filters);
      return successResponse(res, customers, 'Customers retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Get customer by ID
  async getCustomerById(req, res) {
    try {
      const { customerId } = req.params;
      const customer = await customerService.getCustomerById(customerId);
      return successResponse(res, customer, 'Customer retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  // Update customer
  async updateCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const customer = await customerService.updateCustomer(customerId, req.body);
      return successResponse(res, customer, 'Customer updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Update KYC status
  async updateKYCStatus(req, res) {
    try {
      const { customerId } = req.params;
      const kycData = {
        ...req.body,
        verifiedBy: req.user?.id
      };
      const customer = await customerService.updateKYCStatus(customerId, kycData);
      return successResponse(res, customer, 'KYC status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Add document
  async addDocument(req, res) {
    try {
      const { customerId } = req.params;
      const customer = await customerService.addDocument(customerId, req.body);
      return successResponse(res, customer, 'Document added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new CustomerController();