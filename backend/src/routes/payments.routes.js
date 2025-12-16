const express = require('express');
const router = express.Router();
const Payment = require('../models/payment.model');
const Loan = require('../models/loan.model');
const Installment = require('../models/disbursement.model');
const { allocatePayment } = require('../utils/paymentAllocator');
const { protect } = require('../middlewares/auth.middleware');

router.post('/manual', protect, async (req, res) => {
  try {
    const { loanId, amount, paymentDate, mode, utr } = req.body;
    
    if (!loanId || !amount || !paymentDate || !mode) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    
    const installments = await Installment.find({ loanId });
    const allocation = allocatePayment(installments, amount);
    
    const payment = await Payment.create({
      loanId,
      customerId: loan.customerId,
      amount,
      paymentDate,
      mode,
      utr,
      allocation: allocation.installmentAllocations,
      source: 'MANUAL',
      reconciled: false
    });
    
    for (const alloc of allocation.installmentAllocations) {
      await Installment.findOneAndUpdate(
        { loanId, installmentNo: alloc.installmentNo },
        {
          paidAmount: alloc.allocated,
          penalty: alloc.penalty,
          status: alloc.newStatus
        }
      );
    }
    
    res.json({
      success: true,
      data: payment,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
