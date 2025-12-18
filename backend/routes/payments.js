const express = require('express');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const payments = await Payment.find().limit(100).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) { 
    next(err); 
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { loanId, amount, paymentMethod } = req.body;
    
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(400).json({ success: false, message: 'Invalid loanId' });

    const created = await Payment.create({ loanId, amount, paymentMethod });
    res.status(201).json({ success: true, data: created });
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;
