const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const auth = require('../middleware/auth');

// Loan routes
router.post('/', loanController.createLoan);
router.get('/', loanController.getLoans);
router.get('/:id', loanController.getLoanById);
router.post('/payment', auth, auth.authorize && auth.authorize('admin', 'manager', 'collector'), loanController.addPayment);
router.get('/bucket/:bucket', loanController.getLoansByBucket);

module.exports = router;