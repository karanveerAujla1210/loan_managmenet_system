const express = require('express');
const router = express.Router();
const {
  validateLoansUpload,
  previewLoansImport,
  confirmLoansImport,
  validatePaymentsUpload,
  confirmPaymentsImport
} = require('../controllers/importController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Loans Import Flow
 * Step 1: Validate
 * Step 2: Preview
 * Step 3: Confirm
 */

router.post('/loans/validate',
  authenticate,
  authorize(['ADMIN', 'CONTROLLER']),
  validateLoansUpload
);

router.post('/loans/preview',
  authenticate,
  authorize(['ADMIN', 'CONTROLLER']),
  previewLoansImport
);

router.post('/loans/confirm',
  authenticate,
  authorize(['ADMIN', 'CONTROLLER']),
  confirmLoansImport
);

/**
 * Payments Import Flow
 * Step 1: Validate
 * Step 2: Confirm
 */

router.post('/payments/validate',
  authenticate,
  authorize(['ADMIN', 'CONTROLLER']),
  validatePaymentsUpload
);

router.post('/payments/confirm',
  authenticate,
  authorize(['ADMIN', 'CONTROLLER']),
  confirmPaymentsImport
);

module.exports = router;
