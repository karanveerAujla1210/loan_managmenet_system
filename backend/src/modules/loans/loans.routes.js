const express = require('express');
const loanController = require('./loans.controller');
const importController = require('./import.controller');
const { validateLoan, validatePayment, validatePTP, validateNote } = require('./loans.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Import route
router.post('/import', importController.importLoanData);

// Loan CRUD routes
router.post('/', validateLoan, loanController.createLoan);
router.get('/', loanController.getAllLoans);
router.get('/:loanId', loanController.getLoanById);
router.put('/:loanId/status', loanController.updateLoanStatus);

// Payment routes
router.post('/:loanId/payments', validatePayment, loanController.addPayment);
router.get('/:loanId/payments', loanController.getPayments);

// Collection routes
router.get('/collections/due', loanController.getDueLoans);
router.get('/collections/overdue', loanController.getOverdueLoans);
router.get('/collections/outstanding', loanController.getOutstandingLoans);

// PTP and Notes
router.post('/:loanId/ptp', validatePTP, loanController.addPTP);
router.post('/:loanId/notes', validateNote, loanController.addNote);

// Events and timeline
router.get('/:loanId/events', loanController.getEvents);

module.exports = router;