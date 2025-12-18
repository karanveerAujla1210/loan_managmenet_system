const express = require('express');
const router = express.Router();
const { matchPayments, reconcilePayments } = require('../services/bank-reconciliation.service');
const { protect } = require('../middlewares/auth.middleware');

router.post('/upload', protect, async (req, res) => {
  try {
    const { bankStatements } = req.body;
    
    if (!bankStatements || !Array.isArray(bankStatements)) {
      return res.status(400).json({ success: false, message: 'Invalid bank statements' });
    }
    
    const matches = await matchPayments(bankStatements);
    
    res.json({
      success: true,
      data: matches,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reconcile', protect, async (req, res) => {
  try {
    const { matchedPayments } = req.body;
    
    const result = await reconcilePayments(matchedPayments);
    
    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
