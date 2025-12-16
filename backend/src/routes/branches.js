const express = require('express');
const router = express.Router();
const Branch = require('../models/branch.model');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, async (req, res) => {
  try {
    const branches = await Branch.find().sort({ branchId: 1 });
    res.json({
      success: true,
      data: branches,
      meta: { timestamp: new Date(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:branchId', protect, async (req, res) => {
  try {
    const branch = await Branch.findOne({ branchId: req.params.branchId });
    if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
    
    res.json({
      success: true,
      data: branch,
      meta: { timestamp: new Date(), role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
