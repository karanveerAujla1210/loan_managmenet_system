const express = require('express');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ isActive: true });
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ status: { $in: ['disbursed', 'active'] } });
    const overdueLoans = await Loan.countDocuments({ dpd: { $gt: 0 } });
    
    const totalDisbursed = await Loan.aggregate([
      { $match: { status: { $in: ['disbursed', 'active', 'closed'] } } },
      { $group: { _id: null, total: { $sum: '$principalAmount' } } }
    ]);
    
    const totalCollected = await Payment.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const bucketStats = await Loan.aggregate([
      { $match: { dpd: { $gt: 0 } } },
      { $group: { _id: '$bucket', count: { $sum: 1 }, amount: { $sum: '$principalAmount' } } }
    ]);
    
    res.json({
      totalCustomers,
      totalLoans,
      activeLoans,
      overdueLoans,
      totalDisbursed: totalDisbursed[0]?.total || 0,
      totalCollected: totalCollected[0]?.total || 0,
      bucketStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get collection performance
router.get('/collection-performance', auth, async (req, res) => {
  try {
    const last30Days = moment().subtract(30, 'days').toDate();
    
    const dailyCollections = await Payment.aggregate([
      { $match: { createdAt: { $gte: last30Days }, status: 'confirmed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(dailyCollections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;