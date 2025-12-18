const express = require('express');
const LoanController = require('../controllers/loan.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/bucket', protect, async (req, res) => {
  try {
    await LoanController.getActiveLoansByBucket(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:loanId/details', protect, async (req, res) => {
  try {
    await LoanController.getLoanDetails(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/overdue/buckets', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    await LoanController.getOverdueBuckets(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
