const express = require('express');
const flowController = require('./flow.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get complete loan flow (timeline, schedule, transactions)
router.get('/loan/:loanId', flowController.getLoanFlow);

// Update loan status
router.put('/loan/:loanId/status', flowController.updateLoanStatus);

// Process payment and update loan flow
router.post('/loan/:loanId/payment', flowController.processPayment);

// Generate/regenerate payment schedule
router.post('/loan/:loanId/schedule', flowController.generateSchedule);

// Get all overdue loans
router.get('/overdue', flowController.getOverdueLoans);

// Allocate loan to collection agent
router.post('/loan/:loanId/allocate', flowController.allocateToAgent);

module.exports = router;