const express = require('express');
const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const { protect } = require('../middlewares/auth.middleware');
const auth = protect;

const router = express.Router();

// Dashboard summary
router.get('/summary', auth, async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    const totalOutstanding = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'LEGAL'] } } },
      { $group: { _id: null, total: { $sum: '$outstandingAmount' } } }
    ]);

    const bucketSummary = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'LEGAL'] } } },
      { $group: { _id: '$bucket', count: { $sum: 1 } } }
    ]);

    const overdueCount = await Loan.countDocuments({ dpd: { $gt: 0 }, status: 'ACTIVE' });

    res.json({
      success: true,
      data: {
        totalLoans,
        totalOutstanding: totalOutstanding[0]?.total || 0,
        bucketSummary,
        overdueCount
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
