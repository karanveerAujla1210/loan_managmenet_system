const express = require('express');
const customerController = require('./customers.controller');
const { validateCustomer, validateKYC, validateDocument } = require('./customers.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Customer routes
router.post('/', validateCustomer, customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:customerId', customerController.getCustomerById);
router.put('/:customerId', customerController.updateCustomer);
router.patch('/:customerId/kyc', validateKYC, customerController.updateKYCStatus);
router.post('/:customerId/documents', validateDocument, customerController.addDocument);

module.exports = router;