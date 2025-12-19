const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const stateGuard = require('../middlewares/stateGuard');

// Domain controllers
const loansController = require('../domains/loans/loans.controller');
const paymentsController = require('../domains/payments/payments.controller');
const collectionsController = require('../domains/collections/collections.controller');

const router = express.Router();

// LOANS ROUTES
router.get('/loans/:id', protect, loansController.getLoan);
router.get('/loans/:id/allowed-actions', protect, loansController.getAllowedActionsForLoan);
router.post('/loans/:id/transition', protect, stateGuard, loansController.transitionLoan);

// PAYMENTS ROUTES
router.post('/payments', protect, paymentsController.recordPayment);
router.get('/payments', protect, paymentsController.getPayments);

// COLLECTIONS ROUTES
router.get('/collections/dashboard', protect, authorize('manager', 'admin', 'collections_head'), collectionsController.getDashboard);
router.get('/collections/performance', protect, authorize('manager', 'admin'), collectionsController.getCollectorPerformance);

module.exports = router;
