const express = require('express');
const loanController = require('../controllers/loan.controller');
const { protect, checkPermission } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validateRequest');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(checkPermission('VIEW_LOAN'), loanController.getLoans)
  .post(
    checkPermission('CREATE_LOAN'),
    validateRequest(schemas.createLoan),
    loanController.createLoan
  );

router
  .route('/:id')
  .get(checkPermission('VIEW_LOAN'), loanController.getLoanById)
  .patch(checkPermission('UPDATE_LOAN'), loanController.updateLoan);

router
  .route('/:id/assign-collector')
  .patch(checkPermission('ASSIGN_COLLECTOR'), loanController.assignCollector);

module.exports = router;