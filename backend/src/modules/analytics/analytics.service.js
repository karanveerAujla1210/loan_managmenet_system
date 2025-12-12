const Loan = require('../loans/loans.model');
const { AnalyticsSnapshot, LegalCase } = require('./analytics.model');
const moment = require('moment');

class AnalyticsService {
  // Portfolio Overview Analytics
  async getPortfolioOverview(filters = {}) {
    const matchStage = this.buildMatchStage(filters);
    
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDisbursed: { $sum: '$principalAmount' },
          liveLoanCount: { $sum: { $cond: [{ $in: ['$status', ['active', 'overdue']] }, 1, 0] } },
          outstandingPrincipal: { $sum: '$outstandingAmount' },
          outstandingInterest: { $sum: { $subtract: ['$totalAmount', '$principalAmount'] } },
          closedCount: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          writeoffCount: { $sum: { $cond: [{ $eq: ['$status', 'defaulted'] }, 1, 0] } },
          legalCount: { $sum: { $cond: [{ $gte: ['$escalationLevel', 3] }, 1, 0] } }
        }
      }
    ];

    const bucketPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$collectionBucket',
          count: { $sum: 1 },
          totalPrincipal: { $sum: '$outstandingAmount' }
        }
      }
    ];

    const parPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          par0: { $sum: { $cond: [{ $eq: ['$dpd', 0] }, '$outstandingAmount', 0] } },
          par7: { $sum: { $cond: [{ $and: [{ $gt: ['$dpd', 0] }, { $lte: ['$dpd', 7] }] }, '$outstandingAmount', 0] } },
          par14: { $sum: { $cond: [{ $and: [{ $gt: ['$dpd', 7] }, { $lte: ['$dpd', 14] }] }, '$outstandingAmount', 0] } },
          par30: { $sum: { $cond: [{ $and: [{ $gt: ['$dpd', 14] }, { $lte: ['$dpd', 30] }] }, '$outstandingAmount', 0] } },
          par60: { $sum: { $cond: [{ $and: [{ $gt: ['$dpd', 30] }, { $lte: ['$dpd', 60] }] }, '$outstandingAmount', 0] } },
          par90: { $sum: { $cond: [{ $gt: ['$dpd', 60] }, '$outstandingAmount', 0] } }
        }
      }
    ];

    const [overview, buckets, par] = await Promise.all([
      Loan.aggregate(pipeline),
      Loan.aggregate(bucketPipeline),
      Loan.aggregate(parPipeline)
    ]);

    const bucketCounts = {};
    buckets.forEach(b => bucketCounts[b._id] = b.count);

    return {
      ...overview[0],
      ...par[0],
      currentBucketCounts: bucketCounts,
      todaysDueCount: await this.getTodaysDueCount(filters),
      overdueCount: await this.getOverdueCount(filters)
    };
  }

  // Bucket Analysis
  async getBucketAnalysis(filters = {}) {
    const matchStage = this.buildMatchStage(filters);
    
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$collectionBucket',
          count: { $sum: 1 },
          totalPrincipal: { $sum: '$outstandingAmount' },
          averageDPD: { $avg: '$dpd' },
          totalDue: { $sum: '$installmentAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    return await Loan.aggregate(pipeline);
  }

  // Cashflow Forecast
  async getCashflowForecast(filters = {}) {
    const startDate = moment().startOf('day').toDate();
    const endDate = moment().add(12, 'weeks').endOf('day').toDate();
    
    const pipeline = [
      { $match: { ...this.buildMatchStage(filters), status: { $in: ['active', 'overdue'] } } },
      { $unwind: '$schedule' },
      {
        $match: {
          'schedule.dueDate': { $gte: startDate, $lte: endDate },
          'schedule.remainingAmount': { $gt: 0 }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$schedule.dueDate' },
            year: { $year: '$schedule.dueDate' }
          },
          expectedAmount: { $sum: '$schedule.remainingAmount' },
          loanCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ];

    return await Loan.aggregate(pipeline);
  }

  // Roll Rate Analysis
  async getRollRateAnalysis(fromDate, toDate) {
    const buckets = ['Current', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'];
    const matrix = Array(7).fill().map(() => Array(7).fill(0));
    
    // Get loans at start and end periods
    const startLoans = await Loan.find({
      createdAt: { $lte: fromDate }
    }).select('loanId collectionBucket dpd');
    
    const endLoans = await Loan.find({
      createdAt: { $lte: toDate }
    }).select('loanId collectionBucket dpd');
    
    const endLoanMap = new Map();
    endLoans.forEach(loan => endLoanMap.set(loan.loanId, loan));
    
    startLoans.forEach(startLoan => {
      const endLoan = endLoanMap.get(startLoan.loanId);
      if (endLoan) {
        const fromIndex = buckets.indexOf(startLoan.collectionBucket);
        const toIndex = buckets.indexOf(endLoan.collectionBucket);
        if (fromIndex >= 0 && toIndex >= 0) {
          matrix[fromIndex][toIndex]++;
        }
      }
    });

    return { buckets, matrix };
  }

  // Agent Performance
  async getAgentPerformance(filters = {}) {
    const matchStage = this.buildMatchStage(filters);
    
    const pipeline = [
      { $match: { ...matchStage, agentId: { $exists: true } } },
      {
        $group: {
          _id: '$agentId',
          totalAssigned: { $sum: 1 },
          totalOutstanding: { $sum: '$outstandingAmount' },
          collectedAmount: { $sum: '$paidAmount' },
          overdueLoans: { $sum: { $cond: [{ $gt: ['$dpd', 0] }, 1, 0] } },
          avgDPD: { $avg: '$dpd' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      { $unwind: '$agent' },
      {
        $project: {
          agentName: { $concat: ['$agent.firstName', ' ', '$agent.lastName'] },
          totalAssigned: 1,
          totalOutstanding: 1,
          collectedAmount: 1,
          overdueLoans: 1,
          avgDPD: 1,
          recoveryRate: { $divide: ['$collectedAmount', '$totalOutstanding'] }
        }
      },
      { $sort: { recoveryRate: -1 } }
    ];

    return await Loan.aggregate(pipeline);
  }

  // Legal Cases
  async getLegalAnalysis(filters = {}) {
    const legalLoans = await Loan.find({
      escalationLevel: { $gte: 3 },
      ...this.buildMatchStage(filters)
    }).populate('customerId', 'firstName lastName phone');

    const legalCases = await LegalCase.find({}).populate('loanId');
    
    return {
      totalLegalLoans: legalLoans.length,
      totalLegalAmount: legalLoans.reduce((sum, loan) => sum + loan.outstandingAmount, 0),
      casesByStage: await this.groupLegalCasesByStage(),
      avgCaseAge: await this.getAverageCaseAge(),
      loans: legalLoans
    };
  }

  // Closed Loans Analysis
  async getClosedLoansAnalysis(filters = {}) {
    const pipeline = [
      { $match: { ...this.buildMatchStage(filters), status: 'closed' } },
      {
        $group: {
          _id: null,
          totalClosed: { $sum: 1 },
          totalClosedAmount: { $sum: '$principalAmount' },
          avgClosureDays: { $avg: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 86400000] } },
          earlyClosures: { $sum: { $cond: [{ $lt: ['$paidAmount', '$totalAmount'] }, 1, 0] } }
        }
      }
    ];

    const monthlyTrend = await Loan.aggregate([
      { $match: { ...this.buildMatchStage(filters), status: 'closed' } },
      {
        $group: {
          _id: {
            month: { $month: '$updatedAt' },
            year: { $year: '$updatedAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$principalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const [analysis] = await Loan.aggregate(pipeline);
    return { ...analysis, monthlyTrend };
  }

  // Default Analysis
  async getDefaultAnalysis(filters = {}) {
    const pipeline = [
      { $match: { ...this.buildMatchStage(filters), dpd: { $gt: 90 } } },
      {
        $group: {
          _id: {
            dpdRange: {
              $switch: {
                branches: [
                  { case: { $lte: ['$dpd', 120] }, then: '91-120' },
                  { case: { $lte: ['$dpd', 180] }, then: '121-180' },
                  { case: { $lte: ['$dpd', 365] }, then: '181-365' }
                ],
                default: '365+'
              }
            }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$outstandingAmount' },
          avgDPD: { $avg: '$dpd' }
        }
      }
    ];

    return await Loan.aggregate(pipeline);
  }

  // Helper methods
  buildMatchStage(filters) {
    const match = {};
    
    if (filters.startDate && filters.endDate) {
      match.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }
    
    if (filters.agentId) match.agentId = filters.agentId;
    if (filters.bucket) match.collectionBucket = filters.bucket;
    if (filters.status) match.status = filters.status;
    if (filters.branch) match.branch = filters.branch;
    
    return match;
  }

  async getTodaysDueCount(filters) {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment().add(1, 'day').startOf('day').toDate();
    
    return await Loan.countDocuments({
      ...this.buildMatchStage(filters),
      'schedule.dueDate': { $gte: today, $lt: tomorrow },
      'schedule.remainingAmount': { $gt: 0 }
    });
  }

  async getOverdueCount(filters) {
    return await Loan.countDocuments({
      ...this.buildMatchStage(filters),
      dpd: { $gt: 0 }
    });
  }

  async groupLegalCasesByStage() {
    return await LegalCase.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getAverageCaseAge() {
    const result = await LegalCase.aggregate([
      {
        $group: {
          _id: null,
          avgAge: { $avg: { $divide: [{ $subtract: [new Date(), '$filedDate'] }, 86400000] } }
        }
      }
    ]);
    return result[0]?.avgAge || 0;
  }

  // Vintage Analysis
  async getVintageAnalysis(filters) {
    const cohortDate = new Date(filters.cohort);
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: cohortDate,
            $lt: new Date(cohortDate.getTime() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            status: '$status'
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$principalAmount' }
        }
      }
    ];
    return await Loan.aggregate(pipeline);
  }

  // DPD Distribution
  async getDPDDistribution(filters) {
    const matchStage = this.buildMatchStage(filters);
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            dpdRange: {
              $switch: {
                branches: [
                  { case: { $eq: ['$dpd', 0] }, then: '0' },
                  { case: { $lte: ['$dpd', 7] }, then: '1-7' },
                  { case: { $lte: ['$dpd', 14] }, then: '8-14' },
                  { case: { $lte: ['$dpd', 30] }, then: '15-30' },
                  { case: { $lte: ['$dpd', 60] }, then: '31-60' },
                  { case: { $lte: ['$dpd', 90] }, then: '61-90' }
                ],
                default: '90+'
              }
            }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$outstandingAmount' }
        }
      },
      { $sort: { '_id.dpdRange': 1 } }
    ];
    return await Loan.aggregate(pipeline);
  }

  // Collection Efficiency
  async getCollectionEfficiency(filters) {
    const matchStage = this.buildMatchStage(filters);
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDue: { $sum: '$installmentAmount' },
          totalCollected: { $sum: '$paidAmount' },
          expectedCollections: { $sum: { $multiply: ['$installmentAmount', '$numberOfInstallments'] } }
        }
      },
      {
        $project: {
          collectionEfficiency: { $divide: ['$totalCollected', '$totalDue'] },
          recoveryRate: { $divide: ['$totalCollected', '$expectedCollections'] }
        }
      }
    ];
    return await Loan.aggregate(pipeline);
  }
}

module.exports = new AnalyticsService();