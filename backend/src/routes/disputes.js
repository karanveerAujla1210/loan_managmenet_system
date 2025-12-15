const express = require('express');
const router = express.Router();
const DisputeService = require('../services/DisputeService');
const auth = require('../middleware/auth');

// Raise a dispute
router.post('/', auth, async (req, res) => {
  try {
    const { loanId, customerId, type, description, attachments } = req.body;
    const raisedBy = req.body.raisedBy || 'CUSTOMER';

    const dispute = await DisputeService.raiseDispute(
      loanId,
      customerId,
      type,
      description,
      attachments,
      raisedBy,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Dispute raised successfully',
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get dispute details
router.get('/:id', auth, async (req, res) => {
  try {
    const dispute = await DisputeService.getDispute(req.params.id);
    res.json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// List disputes
router.get('/', auth, async (req, res) => {
  try {
    const disputes = await DisputeService.listDisputes(req.query);
    res.json({
      success: true,
      data: disputes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Move to review
router.patch('/:id/review', auth, async (req, res) => {
  try {
    const dispute = await DisputeService.moveToReview(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Dispute moved to review',
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Resolve dispute
router.patch('/:id/resolve', auth, async (req, res) => {
  try {
    const { action, note } = req.body;
    const dispute = await DisputeService.resolveDispute(
      req.params.id,
      action,
      note,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Dispute resolved',
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Close dispute
router.patch('/:id/close', auth, async (req, res) => {
  try {
    const dispute = await DisputeService.closeDispute(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Dispute closed',
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get dispute statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await DisputeService.getDisputeStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
