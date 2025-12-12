const express = require('express');
const collectionsController = require('./collections.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Collection fetch APIs
router.get('/due-today', collectionsController.getDueToday);
router.get('/overdue', collectionsController.getOverdue);
router.get('/bucket/:bucket', collectionsController.getByBucket);
router.get('/agents/:agentId', collectionsController.getByAgent);
router.get('/summary', collectionsController.getCollectionSummary);
router.get('/dashboard', collectionsController.getDashboard);

// Payment and collection actions
router.post('/:loanId/payment', collectionsController.addPayment);
router.post('/:loanId/ptp', collectionsController.addPTP);
router.post('/:loanId/note', collectionsController.addNote);

// Escalation and assignment (admin/supervisor only)
router.post('/:loanId/escalate', 
  authorize('admin', 'manager'), 
  collectionsController.escalateLoan
);

router.post('/assign', 
  authorize('admin', 'manager'), 
  collectionsController.assignLoan
);

module.exports = router;