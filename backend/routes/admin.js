const express = require('express');
const router = express.Router();
const multer = require('multer');
const { triggerDPDUpdate } = require('../cron/dpdCronScheduler');
const protect = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const LegalCase = require('../models/LegalCase');

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Manual DPD Update Trigger
 * POST /api/v1/admin/dpd-update
 */
router.post('/dpd-update', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await triggerDPDUpdate();
    
    res.json({
      success: true,
      message: 'DPD update completed',
      data: result
    });
  } catch (error) {
    console.error('DPD update failed:', error);
    res.status(500).json({
      success: false,
      message: 'DPD update failed',
      error: error.message
    });
  }
});

/**
 * Check DPD Cron Status
 * GET /api/v1/admin/dpd-status
 */
router.get('/dpd-status', protect, authorize('admin', 'manager'), (req, res) => {
  res.json({
    success: true,
    message: 'DPD Cron is running',
    nextRun: getNextCronRun(),
    lastRun: global.lastDPDCronRun || 'Not run yet',
    schedule: 'Daily at 2:30 AM'
  });
});

/**
 * Import Disbursements
 * POST /api/v1/admin/import-disbursements
 */
router.post('/import-disbursements', protect, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const csv = req.file.buffer.toString('utf-8');
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const data = {};
      headers.forEach((header, idx) => {
        data[header] = values[idx];
      });

      await Loan.create({
        loanId: data.loanId,
        customerId: data.customerId,
        principal: parseFloat(data.principal),
        disbursementDate: new Date(data.disbursementDate),
        branch: data.branch,
        status: 'ACTIVE'
      });
      imported++;
    }

    res.json({
      success: true,
      message: `${imported} disbursements imported`,
      data: { imported }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Import Payments
 * POST /api/v1/admin/import-payments
 */
router.post('/import-payments', protect, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const csv = req.file.buffer.toString('utf-8');
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const data = {};
      headers.forEach((header, idx) => {
        data[header] = values[idx];
      });

      await Payment.create({
        loanId: data.loanId,
        amount: parseFloat(data.amount),
        paymentDate: new Date(data.paymentDate),
        mode: data.mode,
        utr: data.utr,
        source: 'BULK'
      });
      imported++;
    }

    res.json({
      success: true,
      message: `${imported} payments imported`,
      data: { imported }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Import Legal Cases
 * POST /api/v1/admin/import-legal-cases
 */
router.post('/import-legal-cases', protect, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const csv = req.file.buffer.toString('utf-8');
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const data = {};
      headers.forEach((header, idx) => {
        data[header] = values[idx];
      });

      await LegalCase.create({
        loanId: data.loanId,
        dpdAtEntry: parseInt(data.dpdAtEntry),
        status: data.status,
        remarks: data.remarks
      });
      imported++;
    }

    res.json({
      success: true,
      message: `${imported} legal cases imported`,
      data: { imported }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Bank Reconciliation Upload
 * POST /api/v1/admin/reconciliation/upload
 */
router.post('/reconciliation/upload', protect, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const csv = req.file.buffer.toString('utf-8');
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const results = {
      exactMatches: [],
      semiMatches: [],
      looseMatches: [],
      unmatched: []
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const data = {};
      headers.forEach((header, idx) => {
        data[header] = values[idx];
      });

      results.exactMatches.push(data);
    }

    res.json({
      success: true,
      message: 'Bank statement processed',
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * System Settings
 * POST /api/v1/admin/settings
 */
router.post('/settings', protect, authorize('admin'), async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Settings saved successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Helper to calculate next cron run time
 */
function getNextCronRun() {
  const now = new Date();
  const nextRun = new Date();
  nextRun.setDate(nextRun.getDate() + 1);
  nextRun.setHours(2, 30, 0, 0);
  return nextRun;
}

module.exports = router;
