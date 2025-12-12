const express = require('express');
const Customer = require('../models/Customer');
const { auth, authorize } = require('../middleware/auth');
const { generateCustomerId } = require('../utils/generators');

const router = express.Router();

// Get all customers
router.get('/', auth, authorize(['admin', 'manager', 'counsellor']), async (req, res) => {
  try {
    const customers = await Customer.find({ isActive: true });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', auth, authorize(['admin', 'manager', 'counsellor']), async (req, res) => {
  try {
    const customerId = generateCustomerId();
    const customer = new Customer({ ...req.body, customerId });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', auth, authorize(['admin', 'manager', 'counsellor']), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;