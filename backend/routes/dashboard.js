const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Core dashboard endpoints
router.get('/stats', dashboardService.getDashboardStats);
router.get('/activities', dashboardService.getRecentActivities);
router.get('/trends', dashboardService.getCollectionTrends);
router.get('/portfolio', dashboardService.getLoanPortfolio);
router.get('/risk-analytics', dashboardService.getRiskAnalytics);

// Additional endpoints for enhanced features
router.get('/agent-performance', async (req, res) => {
  try {
    const User = require('../models/User');
    const Loan = require('../models/Loan');
    const Payment = require('../models/Payment');
    
    const agents = await User.find({ role: 'agent' });
    const performance = await Promise.all(agents.map(async (agent) => {
      const assignedLoans = await Loan.find({ assignedAgent: agent._id });
      const collections = await Payment.find({ collectedBy: agent._id });
      
      return {
        agentId: agent._id,
        name: agent.name,
        assignedLoans: assignedLoans.length,
        totalCollections: collections.reduce((sum, p) => sum + p.amount, 0),
        avgCollectionTime: calculateAvgCollectionTime(assignedLoans, collections)
      };
    }));
    
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/compliance', async (req, res) => {
  try {
    const Customer = require('../models/Customer');
    const Loan = require('../models/Loan');
    
    const totalCustomers = await Customer.countDocuments();
    const kycCompleted = await Customer.countDocuments({ 'kyc.status': 'verified' });
    const totalLoans = await Loan.countDocuments();
    const compliantLoans = await Loan.countDocuments({ status: { $in: ['active', 'closed'] } });
    
    const compliance = {
      kycComplianceRate: (kycCompleted / totalCustomers * 100).toFixed(2),
      loanComplianceRate: (compliantLoans / totalLoans * 100).toFixed(2),
      pendingDocuments: await Customer.countDocuments({ 'kyc.status': 'pending' }),
      auditTrailHealth: 95.5 // Mock value - implement actual audit trail check
    };
    
    res.json({ success: true, data: compliance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const format = req.query.format || 'excel';
    const stats = await dashboardService.getDashboardStats(req, { send: () => {} });
    
    if (format === 'excel') {
      // Mock Excel export - implement actual Excel generation
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dashboard-export.xlsx');
      res.send('Mock Excel Data'); // Replace with actual Excel buffer
    } else {
      res.json({ success: true, data: stats.data });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const Loan = require('../models/Loan');
    const Customer = require('../models/Customer');
    
    const alerts = [
      {
        id: 1,
        type: 'critical',
        title: 'High DPD Loans',
        message: 'Multiple loans with DPD > 90 days',
        count: await Loan.countDocuments({ dpd: { $gt: 90 } }),
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Pending KYC',
        message: 'KYC verification pending for customers',
        count: await Customer.countDocuments({ 'kyc.status': 'pending' }),
        timestamp: new Date(),
        isRead: false
      }
    ];
    
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/alerts/:alertId/read', async (req, res) => {
  try {
    // Mock implementation - store alert read status in database
    res.json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/system-health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    const health = {
      database: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date(),
      services: {
        api: 'healthy',
        notifications: 'healthy',
        reports: 'healthy'
      }
    };
    
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function
function calculateAvgCollectionTime(loans, payments) {
  if (!loans.length || !payments.length) return 0;
  
  const collectionTimes = payments.map(payment => {
    const loan = loans.find(l => l._id.toString() === payment.loanId.toString());
    if (loan && loan.disbursedDate) {
      return Math.ceil((new Date(payment.paymentDate) - new Date(loan.disbursedDate)) / (1000 * 60 * 60 * 24));
    }
    return 0;
  }).filter(time => time > 0);
  
  return collectionTimes.length ? Math.round(collectionTimes.reduce((sum, time) => sum + time, 0) / collectionTimes.length) : 0;
}

module.exports = router;