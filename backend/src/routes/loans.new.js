const express = require('express');
const LoanController = require('../controllers/loan.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Public routes (all authenticated users)
router.get('/', LoanController.getLoans);
router.get('/:id', LoanController.getLoan);

// Customer can apply for loan
router.post('/apply', LoanController.applyLoan);

// Manager/Admin only routes
router.put('/:id/approve', authorize('manager', 'admin'), LoanController.approveLoan);
router.put('/:id/reject', authorize('manager', 'admin'), LoanController.rejectLoan);
router.put('/:id/disburse', authorize('manager', 'admin'), LoanController.disburseLoan);

module.exports = router;