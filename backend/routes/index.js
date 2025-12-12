const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.get('/', (req, res) => {
  res.json({ message: 'NBFC Loan Management API' });
});

module.exports = router;
