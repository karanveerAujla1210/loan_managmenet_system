const express = require('express');
const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const LegalCase = require('../models/legal-case.model');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Check data counts
router.get('/counts', protect, async (req, res) => {
  try {
    const loanCount = await Loan.countDocuments();
    const installmentCount = await Installment.countDocuments();
    const legalCount = await LegalCase.countDocuments();

    res.json({
      success: true,
      data: {
        loans: loanCount,
        installments: installmentCount,
        legalCases: legalCount
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get sample loan
router.get('/sample-loan', protect, async (req, res) => {
  try {
    const loan = await Loan.findOne().limit(1);
    res.json({ success: true, data: loan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get sample installment
router.get('/sample-installment', protect, async (req, res) => {
  try {
    const installment = await Installment.findOne().limit(1);
    res.json({ success: true, data: installment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
