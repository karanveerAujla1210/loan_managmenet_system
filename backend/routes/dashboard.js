const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');

router.use(protect);

router.get('/stats', async (req, res, next) => {
  try {
    const Loan = require('../models/Loan');
    const Customer = require('../models/Customer');
    const Payment = require('../models/Payment');

    const [totalLoans, totalCustomers, totalPayments] = await Promise.all([
      Loan.countDocuments(),
      Customer.countDocuments(),
      Payment.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        totalLoans,
        totalCustomers,
        totalPayments
      }
    });
  } catch (err) { 
    next(err); 
  }
});

router.get('/portfolio', async (req, res, next) => {
  try {
    const Loan = require('../models/Loan');
    const data = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'LEGAL'] } } },
      {
        $group: {
          _id: null,
          totalLoans: { $sum: 1 },
          totalPrincipal: { $sum: '$principal' },
          totalOutstanding: { $sum: '$outstandingAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: data[0] || { totalLoans: 0, totalPrincipal: 0, totalOutstanding: 0 }
    });
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;
