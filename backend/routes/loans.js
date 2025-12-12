const express = require('express');
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const { auth, authorize } = require('../middleware/auth');
const { generateLoanId, generateRepaymentSchedule } = require('../utils/generators');
const { calculateDPD, updateBucket } = require('../services/loanService');

const router = express.Router();

// Get all loans
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('customerId', 'name phone customerId')
      .populate('assignedAgent', 'name email');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create loan
router.post('/', auth, authorize(['admin', 'manager', 'counsellor']), async (req, res) => {
  try {
    const { customerId, principalAmount, interestRate, tenure } = req.body;
    
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const loanId = generateLoanId();
    const totalAmount = principalAmount + (principalAmount * interestRate * tenure / 1200);
    const emiAmount = totalAmount / tenure;
    
    const installments = generateRepaymentSchedule(principalAmount, interestRate, tenure);

    const loan = new Loan({
      loanId,
      customerId,
      principalAmount,
      interestRate,
      tenure,
      totalAmount,
      emiAmount,
      installments,
      status: 'approved'
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get loan by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('customerId')
      .populate('assignedAgent', 'name email');
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Disburse loan
router.post('/:id/disburse', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    
    loan.status = 'disbursed';
    loan.disbursedDate = new Date();
    await loan.save();
    
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update DPD and buckets (scheduled job endpoint)
router.post('/update-dpd', auth, authorize(['admin']), async (req, res) => {
  try {
    const loans = await Loan.find({ status: { $in: ['disbursed', 'active'] } });
    
    for (const loan of loans) {
      const dpd = calculateDPD(loan);
      const bucket = updateBucket(dpd);
      
      loan.dpd = dpd;
      loan.bucket = bucket;
      await loan.save();
    }
    
    res.json({ message: 'DPD updated for all loans' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;