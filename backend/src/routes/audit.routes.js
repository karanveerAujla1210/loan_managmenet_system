const express = require('express');
const AuditLog = require('../models/audit-log.model');
const { protect, authorize } = require('../middlewares/auth.middleware');
const auth = protect;

const router = express.Router();

// Get audit logs for entity
router.get('/entity/:entityId', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const logs = await AuditLog.find({ entityId: req.params.entityId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get audit logs by user
router.get('/user/:userId', auth, authorize(['admin']), async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all audit logs (admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
