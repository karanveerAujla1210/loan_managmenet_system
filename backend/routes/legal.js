const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth);

/**
 * Get all legal cases
 * GET /api/v1/legal/cases
 */
router.get('/cases', async (req, res) => {
  try {
    const LegalCase = require('../models/LegalCase');
    const cases = await LegalCase.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: cases
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get legal case by ID
 * GET /api/v1/legal/cases/:id
 */
router.get('/cases/:id', async (req, res) => {
  try {
    const LegalCase = require('../models/LegalCase');
    const legalCase = await LegalCase.findById(req.params.id);
    
    if (!legalCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    
    res.json({
      success: true,
      data: legalCase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Create legal case
 * POST /api/v1/legal/cases
 */
router.post('/cases', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'legal') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const LegalCase = require('../models/LegalCase');
    const legalCase = await LegalCase.create(req.body);
    
    res.status(201).json({
      success: true,
      data: legalCase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Update legal case
 * PUT /api/v1/legal/cases/:id
 */
router.put('/cases/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'legal') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const LegalCase = require('../models/LegalCase');
    const legalCase = await LegalCase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!legalCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    
    res.json({
      success: true,
      data: legalCase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Delete legal case
 * DELETE /api/v1/legal/cases/:id
 */
router.delete('/cases/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const LegalCase = require('../models/LegalCase');
    await LegalCase.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Case deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
