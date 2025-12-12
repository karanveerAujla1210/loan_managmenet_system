const express = require('express');
const Loan = require('../models/Loan');
const Event = require('../models/Event');
const { auth, authorize } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get due today
router.get('/due-today', auth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const loans = await Loan.find({
      status: { $in: ['disbursed', 'active'] },
      'installments.dueDate': {
        $gte: today.toDate(),
        $lt: moment(today).add(1, 'day').toDate()
      },
      'installments.status': { $in: ['due', 'partial'] }
    }).populate('customerId', 'name phone customerId');
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get overdue loans by bucket
router.get('/overdue/:bucket?', auth, async (req, res) => {
  try {
    const bucket = req.params.bucket || 'all';
    const query = { dpd: { $gt: 0 } };
    
    if (bucket !== 'all') {
      query.bucket = bucket;
    }
    
    const loans = await Loan.find(query)
      .populate('customerId', 'name phone customerId')
      .populate('assignedAgent', 'name email')
      .sort({ dpd: -1 });
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign agent to loan
router.post('/assign-agent', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { loanId, agentId } = req.body;
    
    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { assignedAgent: agentId },
      { new: true }
    ).populate('assignedAgent', 'name email');
    
    // Create event
    await new Event({
      loanId,
      type: 'assign_agent',
      description: 'Agent assigned for collections',
      createdBy: req.user.userId,
      metadata: { agentId }
    }).save();
    
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create PTP (Promise to Pay)
router.post('/ptp', auth, async (req, res) => {
  try {
    const { loanId, ptpDate, ptpAmount, notes } = req.body;
    
    const event = new Event({
      loanId,
      type: 'ptp',
      description: notes || 'Promise to Pay created',
      ptpDate: new Date(ptpDate),
      ptpAmount,
      createdBy: req.user.userId
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add collection note
router.post('/note', auth, async (req, res) => {
  try {
    const { loanId, description } = req.body;
    
    const event = new Event({
      loanId,
      type: 'note',
      description,
      createdBy: req.user.userId
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get loan timeline
router.get('/timeline/:loanId', auth, async (req, res) => {
  try {
    const events = await Event.find({ loanId: req.params.loanId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;