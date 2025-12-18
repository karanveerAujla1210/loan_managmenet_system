const express = require('express');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Schedule = require('../models/Schedule');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res, next) => {
  try {
    const loan = await Loan.create(req.body);
    res.status(201).json({ success: true, data: loan });
  } catch (err) { 
    next(err); 
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loans = await Loan.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Loan.countDocuments();

    res.json({
      success: true,
      data: loans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) { 
    next(err); 
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, error: 'Loan not found' });

    const schedule = await Schedule.find({ loanId: loan._id }).sort({ installmentNumber: 1 });
    const payments = await Payment.find({ loanId: loan._id }).sort({ paymentDate: -1 });

    res.json({
      success: true,
      data: { loan, schedule, payments }
    });
  } catch (err) { 
    next(err); 
  }
});

router.get('/bucket/:bucket', protect, async (req, res, next) => {
  try {
    const loans = await Loan.find({ bucket: req.params.bucket }).sort({ dpd: -1 });
    res.json({ success: true, data: loans });
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;
