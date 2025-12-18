const express = require('express');
const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const LegalCase = require('../models/legal-case.model');
const CollectorPerformance = require('../models/collector-performance.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Portfolio snapshot
router.get('/portfolio', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'CLOSED'] } } },
      {
        $group: {
          _id: null,
          totalLoans: { $sum: 1 },
          totalPrincipal: { $sum: '$loanAmount' },
          totalOutstanding: { $sum: '$outstandingAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: result[0] || { totalLoans: 0, totalPrincipal: 0, totalOutstanding: 0 },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Bucket-wise exposure (using status as bucket proxy)
router.get('/buckets', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'CLOSED'] } } },
      {
        $group: {
          _id: '$status',
          loanCount: { $sum: 1 },
          outstandingAmount: { $sum: '$outstandingAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Collection efficiency
router.get('/efficiency', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Installment.aggregate([
      {
        $group: {
          _id: null,
          dueAmount: { $sum: '$emiAmount' },
          collectedAmount: { $sum: '$paidAmount' }
        }
      },
      {
        $project: {
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
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Legal exposure
router.get('/legal', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Collector performance
router.get('/collectors', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await CollectorPerformance.find()
      .populate('userId', 'name email')
      .sort({ weekStartDate: -1 })
      .limit(50);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Aging analysis
router.get('/aging', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Installment.aggregate([
      {
        $group: {
          _id: '$status',
          loanCount: { $sum: 1 },
          totalAmount: { $sum: '$emiAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const aging = result.map(r => ({
      period: r._id,
      loanCount: r.loanCount,
      outstandingAmount: r.totalAmount
    }));

    res.json({
      success: true,
      data: aging,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
