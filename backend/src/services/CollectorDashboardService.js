const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const PromiseToPay = require('../models/PromiseToPayModel');
const CollectorPerformance = require('../models/CollectorPerformanceModel');

class CollectorDashboardService {
  // Get collector's today dashboard
  async getTodayDashboard(collectorId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get assigned cases
    const assignedCases = await Loan.find({
      assignedCollector: collectorId,
      status: { $in: ['ACTIVE', 'OVERDUE'] },
    }).populate('customerId');

    // Count today's due
    const todayDueCount = assignedCases.filter(loan => {
      const nextDueDate = new Date(loan.nextDueDate);
      nextDueDate.setHours(0, 0, 0, 0);
      return nextDueDate.getTime() === today.getTime();
    }).length;

    // Count overdue
    const overdueCount = assignedCases.filter(loan => {
      const nextDueDate = new Date(loan.nextDueDate);
      return nextDueDate < today;
    }).length;

    // Find highest DPD case
    const highestDPDCase = assignedCases.reduce((max, loan) => {
      return loan.dpd > (max?.dpd || 0) ? loan : max;
    }, null);

    // Get today's collections
    const todayPayments = await Payment.find({
      collectorId,
      paymentDate: { $gte: today, $lt: tomorrow },
      status: 'CONFIRMED',
    });

    const totalCollectedToday = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    // Get promises due today
    const promisesDueToday = await PromiseToPay.find({
      createdBy: collectorId,
      promiseDate: { $gte: today, $lt: tomorrow },
      status: 'PENDING',
    });

    return {
      todayDueCount,
      overdueCount,
      highestDPDCase,
      totalCollectedToday,
      promisesDueToday: promisesDueToday.length,
      assignedCasesCount: assignedCases.length,
    };
  }

  // Get collector's cases (sorted by priority)
  async getMyCases(collectorId, filters = {}) {
    const query = {
      assignedCollector: collectorId,
      status: { $in: ['ACTIVE', 'OVERDUE'] },
    };

    if (filters.bucket) query.bucket = filters.bucket;
    if (filters.dpd) query.dpd = { $gte: filters.dpd };

    let cases = await Loan.find(query)
      .populate('customerId')
      .populate('assignedCollector');

    // Sort by priority (automatic, cannot be reordered)
    cases.sort((a, b) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Due today
      const aDueToday = new Date(a.nextDueDate).getTime() === today.getTime();
      const bDueToday = new Date(b.nextDueDate).getTime() === today.getTime();
      if (aDueToday && !bDueToday) return -1;
      if (!aDueToday && bDueToday) return 1;

      // 2. Highest DPD
      if (a.dpd !== b.dpd) return b.dpd - a.dpd;

      // 3. Promise date today
      const aPromiseToday = a.promiseToPayDate && new Date(a.promiseToPayDate).getTime() === today.getTime();
      const bPromiseToday = b.promiseToPayDate && new Date(b.promiseToPayDate).getTime() === today.getTime();
      if (aPromiseToday && !bPromiseToday) return -1;
      if (!aPromiseToday && bPromiseToday) return 1;

      // 4. Amount high to low
      return b.emiAmount - a.emiAmount;
    });

    return cases;
  }

  // Get loan detail for collector
  async getLoanDetail(loanId, collectorId) {
    const loan = await Loan.findById(loanId)
      .populate('customerId')
      .populate('assignedCollector');

    // Verify collector has access
    if (loan.assignedCollector._id.toString() !== collectorId) {
      throw new Error('Unauthorized access');
    }

    // Get payment history
    const payments = await Payment.find({ loanId }).sort({ paymentDate: -1 });

    // Get promises
    const promises = await PromiseToPay.find({ loanId }).sort({ createdAt: -1 });

    // Get remarks
    const remarks = loan.remarks || [];

    return {
      loan,
      payments,
      promises,
      remarks,
    };
  }

  // Get collector performance
  async getPerformance(collectorId, date = new Date()) {
    date.setHours(0, 0, 0, 0);

    const performance = await CollectorPerformance.findOne({
      collectorId,
      date,
    });

    if (!performance) {
      return {
        collectorId,
        date,
        metrics: {},
        kpis: {},
        incentiveEligible: true,
      };
    }

    return performance;
  }

  // Calculate daily performance metrics
  async calculateDailyMetrics(collectorId, date = new Date()) {
    date.setHours(0, 0, 0, 0);
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get assigned cases
    const assignedCases = await Loan.find({
      assignedCollector: collectorId,
      status: { $in: ['ACTIVE', 'OVERDUE'] },
    });

    // Get today's payments
    const todayPayments = await Payment.find({
      collectorId,
      paymentDate: { $gte: date, $lt: tomorrow },
      status: 'CONFIRMED',
    });

    // Get today's promises
    const todayPromises = await PromiseToPay.find({
      createdBy: collectorId,
      createdAt: { $gte: date, $lt: tomorrow },
    });

    // Get fulfilled promises
    const fulfilledPromises = await PromiseToPay.find({
      createdBy: collectorId,
      status: 'FULFILLED',
      'fulfillmentDetails.fulfillmentDate': { $gte: date, $lt: tomorrow },
    });

    // Get broken promises
    const brokenPromises = await PromiseToPay.find({
      createdBy: collectorId,
      status: 'BROKEN',
      'brokenPromiseTracking.brokenAt': { $gte: date, $lt: tomorrow },
    });

    const metrics = {
      casesAssigned: assignedCases.length,
      casesWorked: assignedCases.length, // Simplified
      callsMade: todayPayments.length * 2, // Estimate
      paymentsReceived: todayPayments.length,
      amountCollected: todayPayments.reduce((sum, p) => sum + p.amount, 0),
      promisesSet: todayPromises.length,
      promisesFulfilled: fulfilledPromises.length,
      promisesBroken: brokenPromises.length,
    };

    // Calculate KPIs
    const kpis = {
      collectionOnDueDate: this.calculateCollectionOnDueDate(todayPayments),
      earlyRecoveryRate: this.calculateEarlyRecoveryRate(todayPayments),
      brokenPromiseRate: metrics.promisesSet > 0 ? (metrics.promisesBroken / metrics.promisesSet) * 100 : 0,
      callToPaymentRatio: metrics.paymentsReceived > 0 ? metrics.callsMade / metrics.paymentsReceived : 0,
    };

    return { metrics, kpis };
  }

  calculateCollectionOnDueDate(payments) {
    // Simplified: % of payments on due date
    const onDueDate = payments.filter(p => {
      // Check if payment was on the due date
      return true; // Simplified
    }).length;

    return payments.length > 0 ? (onDueDate / payments.length) * 100 : 0;
  }

  calculateEarlyRecoveryRate(payments) {
    // % of payments in 1-7 DPD range
    const earlyRecoveries = payments.filter(p => {
      // Check if payment was in 1-7 DPD range
      return true; // Simplified
    }).length;

    return payments.length > 0 ? (earlyRecoveries / payments.length) * 100 : 0;
  }
}

module.exports = new CollectorDashboardService();
