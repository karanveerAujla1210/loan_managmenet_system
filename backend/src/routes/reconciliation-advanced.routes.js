const express = require('express');
const BankReconciliationService = require('../services/bank-reconciliation.service');
const BankReconciliation = require('../models/bank-reconciliation.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Upload and match bank statements
router.post('/match', protect, authorize('admin'), async (req, res) => {
  try {
    const { bankStatements } = req.body;
    const results = await BankReconciliationService.matchPayments(bankStatements);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get unmatched payments
router.get('/unmatched', protect, authorize('admin'), async (req, res) => {
  try {
    const unmatched = await BankReconciliation.find({ status: 'UNMATCHED' })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: unmatched });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reconcile payments
router.post('/reconcile', protect, authorize('admin'), async (req, res) => {
  try {
    const { reconciliationIds } = req.body;
    await BankReconciliationService.reconcilePayments(reconciliationIds, req.user.id);
    res.json({ success: true, message: 'Payments reconciled' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Lock reconciliation day
router.post('/lock-day', protect, authorize('admin'), async (req, res) => {
  try {
    const { date } = req.body;
    await BankReconciliationService.lockReconciliationDay(new Date(date), req.user.id);
    res.json({ success: true, message: 'Day locked' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
