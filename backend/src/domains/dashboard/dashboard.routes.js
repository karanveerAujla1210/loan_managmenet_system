const express = require('express');
const { getKPIs } = require('./dashboard.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/kpis', auth, getKPIs);

module.exports = router;
