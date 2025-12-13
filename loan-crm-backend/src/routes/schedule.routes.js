const express = require('express');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', checkPermission('VIEW_LOAN'), (req, res) => {
  res.json({ message: 'Schedule routes - to be implemented' });
});

module.exports = router;