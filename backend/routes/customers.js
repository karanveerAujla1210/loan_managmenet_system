const express = require('express');
const Joi = require('joi');
const Customer = require('../models/Customer');
const protect = require('../middleware/auth');

const router = express.Router();

const customerSchema = Joi.object({
  customerId: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(7).max(20).required(),
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    pincode: Joi.string().allow('', null),
  }).optional(),
  kyc: Joi.object({
    aadhar: Joi.string().allow('', null),
    pan: Joi.string().allow('', null),
    status: Joi.string().valid('pending', 'verified', 'rejected').optional(),
  }).optional(),
  isActive: Joi.boolean().optional(),
});

router.get('/', protect, async (req, res, next) => {
  try {
    const customers = await Customer.find().limit(100).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { error, value } = customerSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const created = await Customer.create(value);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const doc = await Customer.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const { error, value } = customerSchema.min(1).validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });
    const updated = await Customer.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

module.exports = router;
