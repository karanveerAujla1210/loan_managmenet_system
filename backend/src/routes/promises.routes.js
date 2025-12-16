const express = require('express');
const PromiseToPay = require('../models/promise-to-pay.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Create promise
router.post('/', protect, authorize('collector', 'manager', 'admin'), async (req, res) => {
  try {
    const { loanId, installmentNo, promisedAmount, promisedDate, remarks } = req.body;
    
    const promise = await PromiseToPay.create({
      loanId,
      installmentNo,
      promisedAmount,
      promisedDate,
      remarks,
      madeBy: req.user.id
    });

    res.json({ success: true, data: promise });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get loan promises
router.get('/loan/:loanId', protect, async (req, res) => {
  try {
    const promises = await PromiseToPay.find({ loanId: req.params.loanId }).sort({ promisedDate: -1 });
    res.json({ success: true, data: promises });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update promise status
router.put('/:id/status', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const promise = await PromiseToPay.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data: promise });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
