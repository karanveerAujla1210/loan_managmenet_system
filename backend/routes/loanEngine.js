const express = require('express');
const router = express.Router();
const {
    createLoanWithSchedule,
    processPayment,
    linkExcelData,
    updateDPD
} = require('../controllers/loanEngineController');

// POST /api/loan-engine/create - Create loan with schedule
router.post('/create', createLoanWithSchedule);

// POST /api/loan-engine/payment - Process payment allocation
router.post('/payment', processPayment);

// POST /api/loan-engine/link-data - Link imported Excel data
router.post('/link-data', linkExcelData);

// POST /api/loan-engine/update-dpd - Update DPD for all loans
router.post('/update-dpd', updateDPD);

module.exports = router;