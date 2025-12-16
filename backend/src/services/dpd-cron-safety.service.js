const Loan = require('../models/loan.model');
const moment = require('moment-timezone');

class DPDCronSafetyService {
  static async updateAllLoansIdempotent() {
    const IST = 'Asia/Kolkata';
    const today = moment.tz(IST).startOf('day').toDate();
    
    // Check if already run today
    const lastRun = await this.getLastRunDate();
    if (lastRun && moment(lastRun).tz(IST).isSame(today, 'day')) {
      console.log('[CRON] Already ran today. Skipping.');
      return { skipped: true, reason: 'Already ran today' };
    }

    // Run update
    const result = await this.performUpdate();
    
    // Record run
    await this.recordRunDate(today);
    
    return result;
  }

  static async performUpdate() {
    const loans = await Loan.find({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    let updated = 0;

    for (const loan of loans) {
      const Installment = require('../models/installment.model');
      const installments = await Installment.find({ loanId: loan._id }).sort({ installmentNo: 1 });
      
      const unpaid = installments.find(i => i.status !== 'PAID');
      if (!unpaid) continue;

      const dpd = moment().diff(moment(unpaid.dueDate), 'days');
      if (dpd !== loan.dpd) {
        loan.dpd = Math.max(0, dpd);
        await loan.save();
        updated++;
      }
    }

    return { updated, timestamp: new Date() };
  }

  static async getLastRunDate() {
    const CronRun = require('../models/cron-run.model');
    const lastRun = await CronRun.findOne({ jobName: 'DPD_UPDATE' }).sort({ runDate: -1 });
    return lastRun?.runDate;
  }

  static async recordRunDate(date) {
    const CronRun = require('../models/cron-run.model');
    await CronRun.create({ jobName: 'DPD_UPDATE', runDate: date });
  }
}

module.exports = DPDCronSafetyService;
