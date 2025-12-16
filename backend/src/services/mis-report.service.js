const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const LegalCase = require('../models/LegalCase');
const moment = require('moment');

class MISReportService {
  static async getPortfolioSnapshot() {
    const loans = await Loan.find({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    
    const totalLoans = loans.length;
    const totalPrincipal = loans.reduce((sum, l) => sum + l.principal, 0);
    
    const installments = await Installment.find({ 
      loanId: { $in: loans.map(l => l._id) } 
    });
    
    const totalOutstanding = installments.reduce((sum, i) => sum + i.remainingAmount, 0);
    const totalInterest = loans.reduce((sum, l) => sum + (l.interest || 0), 0);

    return {
      totalLoans,
      totalPrincipal,
      totalOutstanding,
      totalInterest,
      timestamp: new Date()
    };
  }

  static async getBucketExposure() {
    const buckets = ['CURRENT', '1-7', '8-15', '16-22', '23-29', '30+', '60+', 'LEGAL'];
    const exposure = {};

    for (const bucket of buckets) {
      const loans = await Loan.find({ bucket, status: { $in: ['ACTIVE', 'LEGAL'] } });
      const loanIds = loans.map(l => l._id);
      
      const outstanding = await Installment.aggregate([
        { $match: { loanId: { $in: loanIds } } },
        { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
      ]);

      exposure[bucket] = {
        loanCount: loans.length,
        outstandingAmount: outstanding[0]?.total || 0
      };
    }

    return exposure;
  }

  static async getCollectionEfficiency(date = new Date()) {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const dueInstallments = await Installment.find({
      dueDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const dueAmount = dueInstallments.reduce((sum, i) => sum + i.emiAmount, 0);
    const collectedAmount = dueInstallments.reduce((sum, i) => sum + i.paidAmount, 0);

    return {
      dueAmount,
      collectedAmount,
      efficiency: dueAmount > 0 ? (collectedAmount / dueAmount) * 100 : 0,
      date
    };
  }

  static async getRollRateAnalysis() {
    const loans = await Loan.find({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    const buckets = ['CURRENT', '1-7', '8-15', '16-22', '23-29', '30+', '60+', 'LEGAL'];
    
    const rollRate = {};
    for (const bucket of buckets) {
      rollRate[bucket] = {
        improved: 0,
        stable: 0,
        deteriorated: 0
      };
    }

    // Simplified: count loans in each bucket
    for (const loan of loans) {
      if (rollRate[loan.bucket]) {
        rollRate[loan.bucket].stable++;
      }
    }

    return rollRate;
  }

  static async getLegalExposure() {
    const legalCases = await LegalCase.find();
    const loanIds = legalCases.map(c => c.loanId);
    
    const loans = await Loan.find({ _id: { $in: loanIds } });
    const totalOutstanding = loans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);

    const byStatus = {};
    for (const status of ['OPEN', 'NOTICE_SENT', 'COURT_FILED', 'RESOLVED', 'CLOSED']) {
      byStatus[status] = await LegalCase.countDocuments({ status });
    }

    return {
      totalCases: legalCases.length,
      totalOutstanding,
      byStatus
    };
  }
}

module.exports = MISReportService;
