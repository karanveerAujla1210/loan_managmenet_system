const express = require('express');
const router = express.Router();
const Loan = require('../models/loan.model');
const { protect } = require('../middlewares/auth.middleware');

router.get('/buckets', protect, async (req, res) => {
  try {
    const buckets = await Loan.aggregate([
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
    
    res.json({
      success: true,
      data: buckets,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
