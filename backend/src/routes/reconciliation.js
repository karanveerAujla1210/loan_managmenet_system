const express = require('express');
const router = express.Router();
const BankReconciliationService = require('../services/BankReconciliationService');
const auth = require('../middleware/auth');

// Create reconciliation from bank statement
router.post('/', auth, async (req, res) => {
  try {
    const { reconciliationDate, account, transactions } = req.body;

    const reconciliation = await BankReconciliationService.createReconciliation(
      reconciliationDate,
      account,
      transactions,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Reconciliation created',
      data: reconciliation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Auto-match transactions
router.post('/:id/auto-match', auth, async (req, res) => {
  try {
    const reconciliation = await BankReconciliationService.autoMatch(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Auto-match completed',
      data: reconciliation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Link unmatched payment
router.post('/:id/link-payment', auth, async (req, res) => {
  try {
    const { transactionIndex, loanId } = req.body;

    const reconciliation = await BankReconciliationService.linkPayment(
      req.params.id,
      transactionIndex,
      loanId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Payment linked',
      data: reconciliation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Flag fraud
router.post('/:id/flag-fraud', auth, async (req, res) => {
  try {
    const { transactionIndex, reason } = req.body;

    const reconciliation = await BankReconciliationService.flagFraud(
      req.params.id,
      transactionIndex,
      reason,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Fraud flagged',
      data: reconciliation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Finalize reconciliation
router.post('/:id/finalize', auth, async (req, res) => {
  try {
    const reconciliation = await BankReconciliationService.finalizeReconciliation(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Reconciliation finalized and locked',
      data: reconciliation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get reconciliation details
router.get('/:id', auth, async (req, res) => {
  try {
    const reconciliation = await BankReconciliationService.getReconciliation(
      req.params.id
    );

    res.json({
      success: true,
      data: reconciliation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// List reconciliations
router.get('/', auth, async (req, res) => {
  try {
    const reconciliations = await BankReconciliationService.listReconciliations(
      req.query
    );

    res.json({
      success: true,
      data: reconciliations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
