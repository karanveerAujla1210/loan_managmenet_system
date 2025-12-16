const express = require('express');
const PaymentSafetyService = require('../services/payment-safety.service');
const Payment = require('../models/payment.model');
const { auth, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/record', auth, authorize(['collector', 'manager', 'admin']), async (req, res) => {
  try {
    const { loanId, amount, paymentDate, mode, utr } = req.body;

    // Record safely
    const payment = await PaymentSafetyService.recordPaymentSafely(
      loanId, amount, paymentDate, mode, utr, req.user.id
    );

    // Allocate safely
    const result = await PaymentSafetyService.allocatePaymentSafely(payment._id, req.user.id);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/history/:loanId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ loanId: req.params.loanId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
