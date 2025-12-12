const loanService = require('../loans/loans.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class PaymentsController {
  // Add payment to loan
  async addPayment(req, res) {
    try {
      const { loanId } = req.params;
      const paymentData = {
        ...req.body,
        collectedBy: req.user?.id
      };
      
      const loan = await loanService.addPayment(loanId, paymentData);
      return successResponse(res, loan, 'Payment added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Get payments for a loan
  async getPayments(req, res) {
    try {
      const { loanId } = req.params;
      const loan = await loanService.getLoanById(loanId);
      return successResponse(res, loan.transactions, 'Payments retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  // Get all payments (across all loans)
  async getAllPayments(req, res) {
    try {
      const { startDate, endDate, method } = req.query;
      const filters = {};
      
      if (startDate && endDate) {
        filters.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      if (method) {
        filters['transactions.method'] = method;
      }

      const loans = await loanService.getAllLoans(filters);
      const allPayments = loans.reduce((payments, loan) => {
        const loanPayments = loan.transactions.map(transaction => ({
          ...transaction.toObject(),
          loanId: loan.loanId,
          customerId: loan.customerId
        }));
        return payments.concat(loanPayments);
      }, []);

      return successResponse(res, allPayments, 'All payments retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new PaymentsController();