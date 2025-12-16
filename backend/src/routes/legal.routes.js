const express = require('express');
const router = express.Router();
const LegalCase = require('../models/LegalCase');
const { protect } = require('../middlewares/auth.middleware');

router.get('/cases', protect, async (req, res) => {
  try {
    const cases = await LegalCase.find()
      .populate('loanId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: cases,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cases/:caseId', protect, async (req, res) => {
  try {
    const legalCase = await LegalCase.findById(req.params.caseId).populate('loanId');
    
    if (!legalCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    
    res.json({
      success: true,
      data: legalCase,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/cases/:caseId', protect, async (req, res) => {
  try {
    const legalCase = await LegalCase.findByIdAndUpdate(
      req.params.caseId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    res.json({
      success: true,
      data: legalCase,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
