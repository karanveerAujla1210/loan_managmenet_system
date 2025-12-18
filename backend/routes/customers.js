const express = require('express');
const Customer = require('../models/Customer');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const customers = await Customer.find().limit(100).sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (err) { 
    next(err); 
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const created = await Customer.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) { 
    next(err); 
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const doc = await Customer.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { 
    next(err); 
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;
