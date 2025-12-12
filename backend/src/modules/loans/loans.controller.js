const loanService = require('./loans.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class LoanController {
  // Create loan
  async createLoan(req, res) {
    try {
      const loanData = {
        ...req.body,
        createdBy: req.user.id
      };
      const loan = await loanService.createLoan(loanData);
      return successResponse(res, loan, 'Loan created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Get all loans
  async getAllLoans(req, res) {
    try {
      const filters = {
        status: req.query.status,
        customerId: req.query.customerId,
        agentId: req.query.agentId,
        bucket: req.query.bucket,
        search: req.query.search
      };
      const loans = await loanService.getAllLoans(filters);
      return successResponse(res, loans, 'Loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Get loan by ID
  async getLoanById(req, res) {
    try {
      const { loanId } = req.params;
      const loan = await loanService.getLoanById(loanId);
      return successResponse(res, loan, 'Loan retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  // Update loan status
  async updateLoanStatus(req, res) {
    try {
      const { loanId } = req.params;
      const { status } = req.body;
      const loan = await loanService.updateLoanStatus(loanId, status, req.user.id);
      return successResponse(res, loan, 'Loan status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Add payment
  async addPayment(req, res) {
    try {
      const { loanId } = req.params;
      const paymentData = {
        ...req.body,
        collectedBy: req.user.id
      };
      const result = await loanService.addPayment(loanId, paymentData);
      return successResponse(res, result, 'Payment added successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Get payments
  async getPayments(req, res) {
    try {
      const { loanId } = req.params;
      const payments = await loanService.getPayments(loanId);
      return successResponse(res, payments, 'Payments retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  // Get due loans
  async getDueLoans(req, res) {
    try {
      const agentId = req.query.agentId || req.user.id;
      const loans = await loanService.getDueLoans(agentId);
      return successResponse(res, loans, 'Due loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Get overdue loans
  async getOverdueLoans(req, res) {
    try {
      const { bucket } = req.query;
      const agentId = req.query.agentId || req.user.id;
      const loans = await loanService.getOverdueLoans(bucket, agentId);
      return successResponse(res, loans, 'Overdue loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Get outstanding loans
  async getOutstandingLoans(req, res) {
    try {
      const agentId = req.query.agentId || req.user.id;
      const loans = await loanService.getOutstandingLoans(agentId);
      return successResponse(res, loans, 'Outstanding loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Add Promise to Pay
  async addPTP(req, res) {
    try {
      const { loanId } = req.params;
      const ptpData = {
        ...req.body,
        createdBy: req.user.id
      };
      const loan = await loanService.addPTP(loanId, ptpData);
      return successResponse(res, loan, 'Promise to Pay added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Add collection note
  async addNote(req, res) {
    try {
      const { loanId } = req.params;
      const noteData = {
        ...req.body,
        createdBy: req.user.id
      };
      const loan = await loanService.addNote(loanId, noteData);
      return successResponse(res, loan, 'Note added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Get loan events
  async getEvents(req, res) {
    try {
      const { loanId } = req.params;
      const events = await loanService.getEvents(loanId);
      return successResponse(res, events, 'Events retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }
}

module.exports = new LoanController();