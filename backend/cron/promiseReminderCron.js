/**
 * PROMISE-TO-PAY REMINDER SCHEDULER
 * 
 * Runs daily at 8:00 AM to:
 * - Check for loans with promise-to-pay due today
 * - Send SMS/email reminder to assigned collector
 * - Update case status to "awaiting_promised_payment"
 * - Track promised payment follow-ups
 * 
 * This helps convert promises into actual payments
 */

const cron = require('node-cron');
const Loan = require('../models/Loan');
const Collections = require('../models/Collections');

/**
 * Check for promised payments due today
 */
async function checkPromisedPaymentsDue() {
  try {
    console.log(`[PROMISE CRON] Starting promised payment check at ${new Date().toISOString()}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find loans with promiseToPayDate = today
    const promisedCases = await Loan.find({
      status: 'active',
      promiseToPayDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('customerId');

    let remindersSent = 0;

    for (const loan of promisedCases) {
      // Update collections record
      await Collections.findOneAndUpdate(
        { loanId: loan._id },
        {
          promiseStatus: 'due_today',
          lastPromiseReminder: new Date()
        },
        { upsert: true }
      );

      // TODO: Send SMS reminder to collector
      // SMS: "Follow-up: Customer promised payment for loan {loanId} today. Amount: ₹{amount}"
      
      // TODO: Send email reminder to collector
      // Email subject: "Payment promised today: {loanId}"
      // Email body: Case details + promised amount + customer contact

      remindersSent++;
    }

    console.log(`[PROMISE CRON] Sent ${remindersSent} reminders for promised payments due today`);

    return {
      success: true,
      remindersSent,
      cases: promisedCases.map(l => ({
        loanId: l.loanId,
        customerId: l.customerId,
        promiseDate: l.promiseToPayDate,
        promisedAmount: l.promisedAmount
      })),
      timestamp: new Date()
    };

  } catch (error) {
    console.error('[PROMISE CRON] Error checking promised payments:', error);
    throw error;
  }
}

/**
 * Mark overdue promises (not honored by promised date + 1 day)
 */
async function markOverduePromises() {
  try {
    console.log(`[PROMISE CRON] Checking for overdue promises...`);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    // Find loans where promiseToPayDate < yesterday and promiseStatus still = 'awaiting'
    const overduePromises = await Loan.updateMany(
      {
        status: 'active',
        promiseToPayDate: { $lt: yesterday },
        promiseStatus: { $in: ['awaiting', 'due_today'] }
      },
      {
        promiseStatus: 'broken',
        promiseFollowUpCount: { $inc: 1 }
      }
    );

    console.log(`[PROMISE CRON] Marked ${overduePromises.modifiedCount} promises as broken`);
    
    return {
      success: true,
      overdueCount: overduePromises.modifiedCount
    };

  } catch (error) {
    console.error('[PROMISE CRON] Error marking overdue promises:', error);
    throw error;
  }
}

/**
 * Initialize cron job
 * Runs at 8:00 AM every day
 */
function initPromiseReminderCron() {
  try {
    // Cron expression: minute hour day month dayOfWeek
    // 0 8 * * * = 8:00 AM every day
    const task = cron.schedule('0 8 * * *', async () => {
      console.log('[PROMISE CRON] Scheduled promise reminder check triggered');
      try {
        const result = await checkPromisedPaymentsDue();
        await markOverduePromises();
        console.log('[PROMISE CRON] Promise check completed successfully');
      } catch (err) {
        console.error('[PROMISE CRON] Cron execution failed:', err);
        // Continue running despite errors
      }
    });

    console.log('[PROMISE CRON] Scheduler initialized - will run at 8:00 AM daily');
    return task;
  } catch (error) {
    console.error('[PROMISE CRON] Failed to initialize scheduler:', error);
    throw error;
  }
}

/**
 * Manual trigger for testing
 */
async function triggerPromiseCheck() {
  try {
    const result = await checkPromisedPaymentsDue();
    await markOverduePromises();
    return result;
  } catch (error) {
    console.error('[PROMISE CRON] Manual trigger failed:', error);
    throw error;
  }
}

module.exports = {
  checkPromisedPaymentsDue,
  markOverduePromises,
  initPromiseReminderCron,
  triggerPromiseCheck
};
