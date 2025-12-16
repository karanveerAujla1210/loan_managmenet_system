const express = require('express');
const CollectorPerformance = require('../models/collector-performance.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get all collector performance
router.get('/', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const performance = await CollectorPerformance.find()
      .populate('userId', 'name email')
      .sort({ weekStartDate: -1 });
    
    res.json({ 
      success: true, 
      data: performance,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get collector performance by week
router.get('/week/:weekStartDate', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const performance = await CollectorPerformance.find({ 
      weekStartDate: new Date(req.params.weekStartDate) 
    }).populate('userId', 'name email');
    
    res.json({ 
      success: true, 
      data: performance,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get collector performance by user
router.get('/collector/:userId', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const performance = await CollectorPerformance.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .sort({ weekStartDate: -1 });
    
    res.json({ 
      success: true, 
      data: performance,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
