const express = require('express');
const ImportController = require('../controllers/import.controller');
const { auth, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Import customers
router.post('/customers', auth, authorize(['admin']), async (req, res) => {
  try {
    await ImportController.importCustomers(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Import loans
router.post('/loans', auth, authorize(['admin']), async (req, res) => {
  try {
    await ImportController.importLoans(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Import payments
router.post('/payments', auth, authorize(['admin']), async (req, res) => {
  try {
    await ImportController.importPayments(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Import users
router.post('/users', auth, authorize(['admin']), async (req, res) => {
  try {
    await ImportController.importUsers(req, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
