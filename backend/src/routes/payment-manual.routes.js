const express = require('express');
const PaymentController = require('../controllers/payment.controller');
const { auth, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Record manual payment
router.post('/', auth, authorize(['collector', 'manager', 'admin']), async (req, res) => {
  try {
    await PaymentController.recordManualPayment(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get payment history for loan
router.get('/loan/:loanId', auth, async (req, res) => {
  try {
    await PaymentController.getPaymentHistory(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
