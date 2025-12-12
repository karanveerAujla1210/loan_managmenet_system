const flowService = require('./flow.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class FlowController {
  async getLoanFlow(req, res) {
    try {
      const { loanId } = req.params;
      const flow = await flowService.getLoanFlow(loanId);
      return successResponse(res, flow, 'Loan flow retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async updateLoanStatus(req, res) {
    try {
      const { loanId } = req.params;
      const { status, reason } = req.body;
      const updatedFlow = await flowService.updateLoanStatus(loanId, status, reason);
      return successResponse(res, updatedFlow, 'Loan status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async processPayment(req, res) {
    try {
      const { loanId } = req.params;
      const paymentData = req.body;
      const result = await flowService.processPayment(loanId, paymentData);
      return successResponse(res, result, 'Payment processed successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async generateSchedule(req, res) {
    try {
      const { loanId } = req.params;
      const schedule = await flowService.generateSchedule(loanId);
      return successResponse(res, schedule, 'Schedule generated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getOverdueLoans(req, res) {
    try {
      const overdueLoans = await flowService.getOverdueLoans();
      return successResponse(res, overdueLoans, 'Overdue loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async allocateToAgent(req, res) {
    try {
      const { loanId } = req.params;
      const { agentId } = req.body;
      const result = await flowService.allocateToAgent(loanId, agentId);
      return successResponse(res, result, 'Loan allocated to agent successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new FlowController();