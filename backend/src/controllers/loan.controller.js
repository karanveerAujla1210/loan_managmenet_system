const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const LoanService = require('../services/loan.service');

class LoanController {
  static async getLoans(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const result = await LoanService.getLoansByStatus(status, page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getLoan(req, res) {
    try {
      const { id } = req.params;
      const loan = await LoanService.getLoanDetails(id);
      if (!loan) {
        return res.status(404).json({ success: false, message: 'Loan not found' });
      }
      res.json({ success: true, data: loan });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async applyLoan(req, res) {
    try {
      const loan = await LoanService.applyLoan(req.body, req.user?.id);
      res.json({ success: true, data: loan });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async approveLoan(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const loan = await LoanService.approveLoan(id, req.user?.id, notes);
      res.json({ success: true, data: loan });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async rejectLoan(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const loan = await LoanService.rejectLoan(id, req.user?.id, reason);
      res.json({ success: true, data: loan });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async disburseLoan(req, res) {
    try {
      const { id } = req.params;
      const { disbursementDate } = req.body;
      const loan = await LoanService.disburseLoan(id, req.user?.id, disbursementDate);
      res.json({ success: true, data: loan });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getActiveLoansByBucket(req, res) {
    try {
      const { bucket } = req.query;
      const query = { status: { $in: ['active', 'npa'] } };
      if (bucket) query.bucket = bucket;
      const loans = await Loan.find(query).populate('customerId', 'firstName lastName phone').sort({ dpd: -1 });
      res.json({ success: true, data: loans });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getLoanDetails(req, res) {
    try {
      const { loanId } = req.params;
      if (!loanId) return res.status(400).json({ success: false, message: 'loanId required' });
      const loan = await Loan.findById(loanId).populate('customerId');
      const installments = await Installment.find({ loanId });
      res.json({ success: true, data: { loan, installments } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getOverdueBuckets(req, res) {
    try {
      const buckets = ['1-7', '8-15', '16-22', '23-29', '30+', '60+', 'LEGAL'];
      const result = {};
      for (const bucket of buckets) {
        const loans = await Loan.find({ bucket, status: { $in: ['active', 'npa'] } });
        result[bucket] = { count: loans.length, totalOutstanding: loans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0) };
      }
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = LoanController;
