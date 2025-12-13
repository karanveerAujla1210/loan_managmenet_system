const express = require('express');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', checkPermission('VIEW_REPORTS'), (req, res) => {
  res.json({ message: 'Dashboard routes - to be implemented' });
});

module.exports = router;