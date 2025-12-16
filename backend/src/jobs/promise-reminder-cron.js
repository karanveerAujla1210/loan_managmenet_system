const cron = require('node-cron');
const PromiseToPay = require('../models/promise-to-pay.model');
const moment = require('moment');

const initPromiseReminderCron = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('[CRON] Promise reminder started');
      
      const today = moment().startOf('day').toDate();
      const tomorrow = moment().add(1, 'day').startOf('day').toDate();

      const pendingPromises = await PromiseToPay.find({
        status: 'PENDING',
        promisedDate: { $gte: today, $lt: tomorrow }
      }).populate('loanId madeBy');

      console.log(`[CRON] Found ${pendingPromises.length} promises due today`);
      
      // In production, send SMS/email reminders here
      for (const promise of pendingPromises) {
        console.log(`[CRON] Reminder: Loan ${promise.loanId?.loanId} - ₹${promise.promisedAmount} due today`);
      }

      console.log('[CRON] Promise reminder completed');
    } catch (error) {
      console.error('[CRON] Promise reminder failed:', error.message);
    }
  });
};

module.exports = { initPromiseReminderCron };
