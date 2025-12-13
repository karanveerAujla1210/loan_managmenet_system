const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Loan routes
router.post('/', loanController.createLoan);
router.get('/', loanController.getLoans);
router.get('/:id', loanController.getLoanById);
router.post('/payment', loanController.addPayment);
router.get('/bucket/:bucket', loanController.getLoansByBucket);

module.exports = router;