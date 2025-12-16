const express = require('express');
const LoanController = require('../controllers/loan.controller');
const { auth, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get active loans by bucket
router.get('/bucket', auth, async (req, res) => {
  try {
    await LoanController.getActiveLoansByBucket(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get loan details with schedule
router.get('/:loanId/details', auth, async (req, res) => {
  try {
    await LoanController.getLoanDetails(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get overdue buckets summary
router.get('/overdue/buckets', auth, authorize(['manager', 'admin']), async (req, res) => {
  try {
    await LoanController.getOverdueBuckets(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
