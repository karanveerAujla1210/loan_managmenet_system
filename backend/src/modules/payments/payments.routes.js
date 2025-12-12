const express = require('express');
const paymentsController = require('./payments.controller');
const { validatePayment } = require('../loans/loans.validation');

const router = express.Router();

// Payment routes
router.post('/:loanId', validatePayment, paymentsController.addPayment);
router.get('/:loanId', paymentsController.getPayments);
router.get('/', paymentsController.getAllPayments);

module.exports = router;