const express = require('express');
const Loan = require('../models/loan.model');
const LegalCase = require('../models/legal-case.model');
const CollectorPerformance = require('../models/collector-performance.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Portfolio snapshot
router.get('/portfolio', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const result = await Loan.aggregate([
    { $match: { status: { $in: ['active', 'closed', 'npa'] } } },
    {
      $group: {
        _id: null,
        totalLoans: { $sum: 1 },
        totalPrincipal: { $sum: '$principal' },
        totalOutstanding: {
          $sum: {
            $sum: {
              $map: {
                input: '$schedule',
                as: 'inst',
                in: {
                  $subtract: [
                    { $add: ['$$inst.principalDue', '$$inst.interestDue', '$$inst.penaltyDue'] },
                    { $add: ['$$inst.paidPrincipal', '$$inst.paidInterest', '$$inst.paidPenalty'] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: result[0] || { totalLoans: 0, totalPrincipal: 0, totalOutstanding: 0 },
    meta: { timestamp: new Date().toISOString() }
  });
}));

// Bucket-wise exposure (DPD-based)
router.get('/buckets', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const result = await Loan.aggregate([
    { $match: { status: { $in: ['active', 'npa'] } } },
    {
      $addFields: {
        bucket: {
          $cond: [
            { $lte: ['$dpd', 0] }, 'current',
            { $cond: [{ $lte: ['$dpd', 7] }, 'X',
            { $cond: [{ $lte: ['$dpd', 30] }, 'Y',
            { $cond: [{ $lte: ['$dpd', 60] }, 'M1',
            { $cond: [{ $lte: ['$dpd', 90] }, 'M2',
            { $cond: [{ $lte: ['$dpd', 180] }, 'M3', 'NPA']}]}]}]}]}]}
          ]
        }
      }
    },
    {
      $group: {
        _id: '$bucket',
        loanCount: { $sum: 1 },
        outstandingAmount: {
          $sum: {
            $sum: {
              $map: {
                input: '$schedule',
                as: 'inst',
                in: {
                  $subtract: [
                    { $add: ['$$inst.principalDue', '$$inst.interestDue', '$$inst.penaltyDue'] },
                    { $add: ['$$inst.paidPrincipal', '$$inst.paidInterest', '$$inst.paidPenalty'] }
                  ]
                }
              }
            }
          }
        },
        avgDPD: { $avg: '$dpd' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: result,
    meta: { timestamp: new Date().toISOString() }
  });
}));

// Collection efficiency
router.get('/efficiency', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await Loan.aggregate([
    { $match: { status: { $in: ['active', 'npa'] } } },
    { $unwind: '$schedule' },
    { $match: { 'schedule.dueDate': { $lte: today } } },
    {
      $group: {
        _id: null,
        dueAmount: {
          $sum: {
            $add: ['$schedule.principalDue', '$schedule.interestDue', '$schedule.penaltyDue']
          }
        },
        collectedAmount: {
          $sum: {
            $add: ['$schedule.paidPrincipal', '$schedule.paidInterest', '$schedule.paidPenalty']
          }
        }
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

  res.json({
    success: true,
    data: result[0] || { dueAmount: 0, collectedAmount: 0, efficiency: 0 },
    meta: { timestamp: new Date().toISOString() }
  });
}));

// Legal exposure
router.get('/legal', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const totalCases = await LegalCase.countDocuments();
  const result = await LegalCase.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: { totalCases, breakdown: result },
    meta: { timestamp: new Date().toISOString() }
  });
}));

// Collector performance
router.get('/collectors', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const result = await CollectorPerformance.find()
    .populate('userId', 'name email')
    .sort({ weekStartDate: -1 })
    .limit(50);

  res.json({
    success: true,
    data: result,
    meta: { timestamp: new Date().toISOString() }
  });
}));

// Aging analysis (date-based)
router.get('/aging', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await Loan.aggregate([
    { $match: { status: { $in: ['active', 'npa'] } } },
    {
      $addFields: {
        ageInDays: {
          $divide: [
            { $subtract: [today, '$disbursementDate'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    {
      $addFields: {
        agePeriod: {
          $cond: [
            { $lte: ['$ageInDays', 30] }, '0-30 days',
            { $cond: [{ $lte: ['$ageInDays', 60] }, '31-60 days',
            { $cond: [{ $lte: ['$ageInDays', 90] }, '61-90 days', '90+ days']}]}
          ]
        }
      }
    },
    {
      $group: {
        _id: '$agePeriod',
        loanCount: { $sum: 1 },
        outstandingAmount: {
          $sum: {
            $sum: {
              $map: {
                input: '$schedule',
                as: 'inst',
                in: {
                  $subtract: [
                    { $add: ['$$inst.principalDue', '$$inst.interestDue', '$$inst.penaltyDue'] },
                    { $add: ['$$inst.paidPrincipal', '$$inst.paidInterest', '$$inst.paidPenalty'] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  ]);

  const agingMap = { '0-30 days': 0, '31-60 days': 0, '61-90 days': 0, '90+ days': 0 };
  result.forEach(r => {
    agingMap[r._id] = { loanCount: r.loanCount, outstandingAmount: r.outstandingAmount };
  });

  const aging = Object.entries(agingMap).map(([period, data]) => ({
    period,
    loanCount: data.loanCount || 0,
    outstandingAmount: data.outstandingAmount || 0
  }));

  res.json({
    success: true,
    data: aging,
    meta: { timestamp: new Date().toISOString() }
  });
}));

module.exports = router;
