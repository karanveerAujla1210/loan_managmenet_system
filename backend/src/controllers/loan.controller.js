const Loan = require('../models/Loan');
const Instalment = require('../models/Instalment');
const DPDUpdateService = require('../services/dpd-update.service');

class LoanController {
  static async getActiveLoansByBucket(req, res) {
    try {
      const { bucket } = req.query;
      const query = { status: { $in: ['ACTIVE', 'LEGAL'] } };
      if (bucket) query.bucket = bucket;

      const loans = await Loan.find(query)
        .populate('customerId', 'firstName lastName phone')
        .sort({ dpd: -1 });

      res.json({ success: true, data: loans });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getLoanDetails(req, res) {
    try {
      const { loanId } = req.params;
      if (!loanId) {
        return res.status(400).json({ success: false, message: 'loanId required' });
      }
      const loan = await Loan.findById(loanId).populate('customerId');
      const installments = await Instalment.find({ loanId });

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
        const loans = await Loan.find({ bucket, status: { $in: ['ACTIVE', 'LEGAL'] } });
        result[bucket] = {
          count: loans.length,
          totalOutstanding: loans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0)
        };
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = LoanController;
