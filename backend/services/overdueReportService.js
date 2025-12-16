
const Loan = require('../models/Loan');
const Schedule = require('../models/Schedule');
const Payment = require('../models/Payment');
const Collections = require('../models/Collections');

/**
 * Get overdue summary by bucket and age
 */
const getOverdueSummary = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get overdue loans by bucket
  const overdueByBucket = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    { $group: { _id: '$bucket', count: { $sum: 1 }, totalAmount: { $sum: '$totalRepayable' } } },
    { $sort: { _id: 1 } }
  ]);

  // Get overdue loans by age (days past due ranges)
  const overdueByAge = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ['$dpd', 7] }, then: '1-7 days' },
              { case: { $lte: ['$dpd', 15] }, then: '8-15 days' },
              { case: { $lte: ['$dpd', 30] }, then: '16-30 days' },
              { case: { $lte: ['$dpd', 60] }, then: '31-60 days' },
              { case: { $lte: ['$dpd', 90] }, then: '61-90 days' },
              { case: { $lte: ['$dpd', 120] }, then: '91-120 days' }
            ],
            default: '120+ days'
          }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalRepayable' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get total overdue amount and count
  const totalOverdue = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: '$totalRepayable' } } }
  ]);

  // Get overdue trends for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const overdueTrend = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 }, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalRepayable' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get recovery rate
  const [totalDisbursed, totalCollected] = await Promise.all([
    Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$netDisbursement' } } }
    ]),
    Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  const recoveryRate = totalDisbursed[0] && totalCollected[0] 
    ? ((totalCollected[0].total / totalDisbursed[0].total) * 100).toFixed(2)
    : 0;

  return {
    overdueByBucket,
    overdueByAge,
    totalOverdue: totalOverdue[0] || { count: 0, totalAmount: 0 },
    overdueTrend,
    recoveryRate: parseFloat(recoveryRate),
    generatedAt: new Date()
  };
};

/**
 * Get detailed overdue report with pagination
 */
const getDetailedOverdueReport = async (bucket, page, limit, sortBy, sortOrder) => {
  const skip = (page - 1) * limit;

  // Build filter
  const filter = { dpd: { $gt: 0 } };
  if (bucket && bucket !== 'all') {
    filter.bucket = bucket;
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get loans with customer details
  const loans = await Loan.find(filter)
    .populate('customerId', 'firstName lastName phone email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Loan.countDocuments(filter);

  // Get next installment details for each loan
  const loansWithSchedule = await Promise.all(loans.map(async (loan) => {
    const nextInstallment = await Schedule.findOne({
      loanId: loan._id,
      status: { $ne: 'paid' }
    }).sort({ installmentNumber: 1 });

    // Get last payment
    const lastPayment = await Payment.findOne({
      loanId: loan._id,
      status: 'success'
    }).sort({ paymentDate: -1 });

    return {
      ...loan.toObject(),
      nextInstallment,
      lastPayment
    };
  }));

  return {
    loans: loansWithSchedule,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get aging report by branch
 */
const getOverdueAgingReport = async (branch) => {
  // Build filter
  const filter = { dpd: { $gt: 0 } };
  if (branch) {
    filter.branch = branch;
  }

  // Get aging report by branch
  const agingByBranch = await Loan.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$branch',
        '1-7': {
          $sum: {
            $cond: [{ $lte: ['$dpd', 7] }, '$totalRepayable', 0]
          }
        },
        '8-15': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 7] }, { $lte: ['$dpd', 15] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '16-30': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 15] }, { $lte: ['$dpd', 30] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '31-60': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 30] }, { $lte: ['$dpd', 60] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '61-90': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 60] }, { $lte: ['$dpd', 90] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '90+': {
          $sum: {
            $cond: [{ $gt: ['$dpd', 90] }, '$totalRepayable', 0]
          }
        },
        total: { $sum: '$totalRepayable' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get aging report overall
  const agingOverall = await Loan.aggregate([
    { $match: { dpd: { $gt: 0 } } },
    {
      $group: {
        _id: null,
        '1-7': {
          $sum: {
            $cond: [{ $lte: ['$dpd', 7] }, '$totalRepayable', 0]
          }
        },
        '8-15': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 7] }, { $lte: ['$dpd', 15] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '16-30': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 15] }, { $lte: ['$dpd', 30] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '31-60': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 30] }, { $lte: ['$dpd', 60] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '61-90': {
          $sum: {
            $cond: [
              { $and: [{ $gt: ['$dpd', 60] }, { $lte: ['$dpd', 90] }] },
              '$totalRepayable',
              0
            ]
          }
        },
        '90+': {
          $sum: {
            $cond: [{ $gt: ['$dpd', 90] }, '$totalRepayable', 0]
          }
        },
        total: { $sum: '$totalRepayable' },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    agingByBranch,
    agingOverall: agingOverall[0] || {},
    generatedAt: new Date()
  };
};

/**
 * Export overdue report data
 */
const exportOverdueReport = async (bucket, branch) => {
  // Build filter
  const filter = { dpd: { $gt: 0 } };
  if (bucket && bucket !== 'all') {
    filter.bucket = bucket;
  }
  if (branch && branch !== 'all') {
    filter.branch = branch;
  }

  // Get loans with customer details
  const loans = await Loan.find(filter)
    .populate('customerId', 'firstName lastName phone email')
    .sort({ dpd: -1 });

  // Get next installment details for each loan
  const loansWithSchedule = await Promise.all(loans.map(async (loan) => {
    const nextInstallment = await Schedule.findOne({
      loanId: loan._id,
      status: { $ne: 'paid' }
    }).sort({ installmentNumber: 1 });

    // Get last payment
    const lastPayment = await Payment.findOne({
      loanId: loan._id,
      status: 'success'
    }).sort({ paymentDate: -1 });

    return {
      ...loan.toObject(),
      nextInstallment,
      lastPayment
    };
  }));

  return {
    loans: loansWithSchedule,
    generatedAt: new Date()
  };
};

module.exports = {
  getOverdueSummary,
  getDetailedOverdueReport,
  getOverdueAgingReport,
  exportOverdueReport
};
