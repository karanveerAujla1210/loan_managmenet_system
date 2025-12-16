const express = require('express');
const DisputeService = require('../services/dispute.service');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Create dispute
router.post('/', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { loanId, reason } = req.body;
    const dispute = await DisputeService.createDispute(loanId, reason, req.user.id);
    res.json({ success: true, data: dispute });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get loan disputes
router.get('/loan/:loanId', protect, async (req, res) => {
  try {
    const disputes = await DisputeService.getActiveLoanDisputes(req.params.loanId);
    res.json({ success: true, data: disputes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Resolve dispute
router.put('/:id/resolve', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { resolution } = req.body;
    const dispute = await DisputeService.resolveDispute(req.params.id, resolution, req.user.id);
    res.json({ success: true, data: dispute });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
