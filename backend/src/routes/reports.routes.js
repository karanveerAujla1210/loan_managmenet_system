const express = require('express');
const router = express.Router();
const Loan = require('../models/loan.model');
const Installment = require('../models/disbursement.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/mis', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const portfolioSnapshot = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'LEGAL'] } } },
      {
        $group: {
          _id: null,
          totalLoans: { $sum: 1 },
          totalPrincipal: { $sum: '$principal' },
          totalOutstanding: { $sum: '$outstandingAmount' },
          totalInterest: { $sum: '$interest' }
        }
      }
    ]);

    const bucketExposure = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'LEGAL'] } } },
      {
        $group: {
          _id: '$bucket',
          loanCount: { $sum: 1 },
          outstandingAmount: { $sum: '$outstandingAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const collectionEfficiency = await Installment.aggregate([
      {
        $group: {
          _id: null,
          dueAmount: { $sum: '$emiAmount' },
          collectedAmount: { $sum: '$paidAmount' }
        }
      },
      {
        $project: {
          efficiency: {
            $cond: [
              { $eq: ['$dueAmount', 0] },
              0,
              { $divide: ['$collectedAmount', '$dueAmount'] }
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        portfolioSnapshot: portfolioSnapshot[0] || {},
        bucketExposure,
        collectionEfficiency: collectionEfficiency[0] || {}
      },
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
