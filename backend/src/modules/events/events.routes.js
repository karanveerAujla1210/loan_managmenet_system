const express = require('express');
const eventsController = require('./events.controller');

const router = express.Router();

// Event routes
router.get('/:loanId', eventsController.getLoanEvents);
router.get('/', eventsController.getAllEvents);

module.exports = router;