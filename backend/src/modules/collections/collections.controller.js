const collectionsService = require('./collections.service');
const { successResponse, errorResponse } = require('../../utils/responses');

class CollectionsController {
  // GET /api/v1/collections/due-today
  async getDueToday(req, res) {
    try {
      const loans = await collectionsService.getDueToday();
      return successResponse(res, loans, 'Loans due today retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // GET /api/v1/collections/overdue
  async getOverdue(req, res) {
    try {
      const loans = await collectionsService.getOverdue();
      return successResponse(res, loans, 'Overdue loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // GET /api/v1/collections/bucket/:bucket
  async getByBucket(req, res) {
    try {
      const { bucket } = req.params;
      const validBuckets = ['Current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'];
      
      if (!validBuckets.includes(bucket)) {
        return errorResponse(res, 'Invalid bucket type', 400);
      }

      const loans = await collectionsService.getByBucket(bucket);
      return successResponse(res, loans, `${bucket} bucket loans retrieved successfully`);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // GET /api/v1/collections/agents/:agentId
  async getByAgent(req, res) {
    try {
      const { agentId } = req.params;
      const loans = await collectionsService.getByAgent(agentId);
      return successResponse(res, loans, 'Agent loans retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // POST /api/v1/collections/:loanId/payment
  async addPayment(req, res) {
    try {
      const { loanId } = req.params;
      const { amount, mode, notes } = req.body;
      const agentId = req.user.id;

      if (!amount || amount <= 0) {
        return errorResponse(res, 'Valid payment amount is required', 400);
      }

      const result = await collectionsService.addPayment(loanId, {
        amount,
        mode,
        agentId,
        notes
      });

      return successResponse(res, result, 'Payment added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // POST /api/v1/collections/:loanId/ptp
  async addPTP(req, res) {
    try {
      const { loanId } = req.params;
      const { ptpDate, amount, note } = req.body;
      const agentId = req.user.id;

      if (!ptpDate || !amount) {
        return errorResponse(res, 'PTP date and amount are required', 400);
      }

      const loan = await collectionsService.addPTP(loanId, {
        ptpDate,
        amount,
        note,
        agentId
      });

      return successResponse(res, loan, 'Promise to Pay added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // POST /api/v1/collections/:loanId/note
  async addNote(req, res) {
    try {
      const { loanId } = req.params;
      const { note } = req.body;
      const agentId = req.user.id;

      if (!note) {
        return errorResponse(res, 'Note content is required', 400);
      }

      const loan = await collectionsService.addNote(loanId, {
        note,
        agentId
      });

      return successResponse(res, loan, 'Collection note added successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // POST /api/v1/collections/:loanId/escalate
  async escalateLoan(req, res) {
    try {
      const { loanId } = req.params;
      const { reason } = req.body;
      const agentId = req.user.id;

      const loan = await collectionsService.escalateLoan(loanId, {
        reason,
        agentId
      });

      return successResponse(res, loan, 'Loan escalated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // POST /api/v1/collections/assign
  async assignLoan(req, res) {
    try {
      const { loanId, agentId } = req.body;
      const assignedBy = req.user.id;

      if (!loanId || !agentId) {
        return errorResponse(res, 'Loan ID and Agent ID are required', 400);
      }

      const loan = await collectionsService.assignLoan(loanId, agentId, assignedBy);
      return successResponse(res, loan, 'Loan assigned successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // GET /api/v1/collections/summary
  async getCollectionSummary(req, res) {
    try {
      const summary = await collectionsService.getCollectionSummary();
      return successResponse(res, summary, 'Collection summary retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // GET /api/v1/collections/dashboard
  async getDashboard(req, res) {
    try {
      const dashboard = await collectionsService.getDashboardData();
      return successResponse(res, dashboard, 'Collection dashboard data retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new CollectionsController();