const express = require('express');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', checkPermission('LEGAL_ACTIONS'), (req, res) => {
  res.json({ message: 'Legal routes - to be implemented' });
});

module.exports = router;