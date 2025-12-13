const express = require('express');
const UploadController = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Upload routes
router.post('/disbursements', UploadController.uploadDisbursements);
router.post('/payments', UploadController.uploadPayments);
router.get('/history', UploadController.getUploadHistory);

module.exports = router;