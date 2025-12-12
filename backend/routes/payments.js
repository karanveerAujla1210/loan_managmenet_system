const express = require('express');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');
const { generatePaymentId } = require('../utils/generators');
const { allocatePayment } = require('../services/paymentService');

const router = express.Router();

// Record payment
router.post('/', auth, async (req, res) => {
  try {
    const { loanId, amount, paymentMethod, reference } = req.body;
    
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const paymentId = generatePaymentId();
    
    const payment = new Payment({
      paymentId,
      loanId,
      amount,
      paymentMethod,
      reference,
      collectedBy: req.user.userId
    });

    // Auto-allocate payment to installments
    const allocations = allocatePayment(loan, amount);
    payment.allocations = allocations;

    // Update loan installments
    for (const allocation of allocations) {
      const installment = loan.installments.find(i => i.installmentNumber === allocation.installmentNumber);
      if (installment) {
        installment.paidAmount += allocation.totalPaid;
        if (installment.paidAmount >= installment.totalAmount) {
          installment.status = 'paid';
          installment.paidDate = new Date();
        } else {
          installment.status = 'partial';
        }
      }
    }

    await payment.save();
    await loan.save();

    // Create event
    await new Event({
      loanId,
      type: 'payment',
      description: `Payment of ₹${amount} received`,
      amount,
      createdBy: req.user.userId
    }).save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payments for a loan
router.get('/loan/:loanId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ loanId: req.params.loanId })
      .populate('collectedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;