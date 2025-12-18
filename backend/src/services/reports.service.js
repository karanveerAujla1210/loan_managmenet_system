const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');

/**
 * Portfolio Snapshot - Total deployed, outstanding, at risk
 */
const getPortfolioSnapshot = async () => {
  const result = await Loan.aggregate([
    { $match: { status: { $in: ['ACTIVE', 'CLOSED'] } } },
    {
      $group: {
        _id: null,
        totalLoans: { $sum: 1 },
        totalPrincipal: { $sum: '$loanAmount' },
        totalOutstanding: { $sum: '$outstandingAmount' },
        totalPayable: { $sum: '$totalPayable' }
      }
    },
    {
      $project: {
        _id: 0,
        totalLoans: 1,
        totalPrincipal: 1,
        totalOutstanding: 1,
        totalInterest: { $subtract: ['$totalPayable', '$totalPrincipal'] }
      }
    }
  ]);

  return result[0] || {
    totalLoans: 0,
    totalPrincipal: 0,
    totalOutstanding: 0,
    totalInterest: 0
  };
};

/**
 * Bucket-wise Exposure
 */
const getBucketExposure = async () => {
  const loans = await Loan.find({ status: 'ACTIVE' });
  const buckets = {};

  for (const loan of loans) {
    const firstUnpaid = await Installment.findOne({
      loanId: loan._id,
      status: { $in: ['DUE', 'PARTIAL', 'OVERDUE'] }
    }).sort({ dueDate: 1 });

    if (!firstUnpaid) continue;

    const dpd = Math.floor((Date.now() - firstUnpaid.dueDate) / (1000 * 60 * 60 * 24));
    let bucket;

    if (dpd <= 0) bucket = 'CURRENT';
    else if (dpd <= 7) bucket = '1-7';
    else if (dpd <= 15) bucket = '8-15';
    else if (dpd <= 22) bucket = '16-22';
    else if (dpd <= 29) bucket = '23-29';
    else if (dpd <= 59) bucket = '30+';
    else if (dpd <= 89) bucket = '60+';
    else bucket = 'LEGAL';

    if (!buckets[bucket]) {
      buckets[bucket] = { loanCount: 0, outstandingAmount: 0 };
    }
    buckets[bucket].loanCount++;
    buckets[bucket].outstandingAmount += loan.outstandingAmount;
  }

  return Object.entries(buckets).map(([bucket, data]) => ({
    _id: bucket,
    ...data
  }));
};

/**
 * Collection Efficiency
 */
const getCollectionEfficiency = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await Installment.aggregate([
    { $match: { dueDate: { $lte: today } } },
    {
      $group: {
        _id: null,
        dueAmount: { $sum: '$dueAmount' },
        collectedAmount: { $sum: '$paidAmount' }
      }
    },
    {
      $project: {
        _id: 0,
        dueAmount: 1,
        collectedAmount: 1,
        efficiency: {
          $cond: [
            { $eq: ['$dueAmount', 0] },
            0,
            { $multiply: [{ $divide: ['$collectedAmount', '$dueAmount'] }, 100] }
          ]
        }
      }
    }
  ]);

  return result[0] || { dueAmount: 0, collectedAmount: 0, efficiency: 0 };
};

/**
 * Legal Exposure
 */
const getLegalExposure = async () => {
  const result = await Loan.aggregate([
    { $match: { status: 'LEGAL' } },
    {
      $group: {
        _id: null,
        totalCases: { $sum: 1 },
        totalOutstanding: { $sum: '$outstandingAmount' }
      }
    }
  ]);

  return result[0] || { totalCases: 0, totalOutstanding: 0 };
};

/**
 * Collector Performance
 */
const getCollectorPerformance = async () => {
  const collectors = await User.find({ role: 'COLLECTOR', active: true });
  const performance = [];

  for (const collector of collectors) {
    const loans = await Loan.find({ assignedTo: collector._id });
    const loanIds = loans.map(l => l._id);

    const payments = await Payment.aggregate([
      { $match: { loanId: { $in: loanIds } } },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$amount' },
          paymentCount: { $sum: 1 }
        }
      }
    ]);

    const totalOutstanding = loans.reduce((sum, l) => sum + l.outstandingAmount, 0);

    performance.push({
      _id: collector._id,
      name: collector.name,
      loanCount: loans.length,
      totalCollected: payments[0]?.totalCollected || 0,
      totalOutstanding,
      score: calculateCollectorScore(loans, payments[0])
    });
  }

  return performance.sort((a, b) => b.score - a.score);
};

/**
 * Calculate collector score (0-100)
 */
const calculateCollectorScore = (loans, paymentData) => {
  if (loans.length === 0) return 0;

  const collectionRate = paymentData ? (paymentData.totalCollected / (loans.length * 4286)) * 100 : 0;
  const activeLoans = loans.filter(l => l.status === 'ACTIVE').length;
  const activeRate = (activeLoans / loans.length) * 100;

  return Math.min(100, (collectionRate * 0.6 + activeRate * 0.4));
};

/**
 * Aging Analysis
 */
const getAgingAnalysis = async () => {
  const today = new Date();
  const periods = [
    { name: '0-30 days', start: 0, end: 30 },
    { name: '31-60 days', start: 31, end: 60 },
    { name: '61-90 days', start: 61, end: 90 },
    { name: '90+ days', start: 91, end: 999 }
  ];

  const aging = [];

  for (const period of periods) {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - period.end);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - period.start);

    const loans = await Loan.find({
      status: 'ACTIVE',
      disbursementDate: { $gte: startDate, $lte: endDate }
    });

    const totalOutstanding = loans.reduce((sum, l) => sum + l.outstandingAmount, 0);

    aging.push({
      period: period.name,
      loanCount: loans.length,
      outstandingAmount: totalOutstanding
    });
  }

  return aging;
};

module.exports = {
  getPortfolioSnapshot,
  getBucketExposure,
  getCollectionEfficiency,
  getLegalExposure,
  getCollectorPerformance,
  getAgingAnalysis
};
