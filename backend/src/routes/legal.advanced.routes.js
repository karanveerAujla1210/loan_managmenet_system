const express = require('express');
const LegalCase = require('../models/legal-case.model');
const { protect, authorize } = require('../middlewares/auth.middleware');
const auth = protect;

const router = express.Router();

// Get all legal cases
router.get('/', auth, authorize(['legal', 'admin', 'manager']), async (req, res) => {
  try {
    const cases = await LegalCase.find()
      .populate('loanId', 'loanId principal outstandingAmount')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: cases });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get legal case by loan
router.get('/loan/:loanId', auth, authorize(['legal', 'admin', 'manager']), async (req, res) => {
  try {
    const legalCase = await LegalCase.findOne({ loanId: req.params.loanId })
      .populate('loanId');
    res.json({ success: true, data: legalCase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update legal case status
router.put('/:id/status', auth, authorize(['legal', 'admin']), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const legalCase = await LegalCase.findByIdAndUpdate(
      req.params.id,
      { status, remarks, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data: legalCase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
