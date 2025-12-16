const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const LegalCase = require('../models/LegalCase');
const LoanBucketHistory = require('../models/loan-bucket-history.model');
const moment = require('moment-timezone');

class DPDSafeService {
  static async updateDPDSafely() {
    const IST = 'Asia/Kolkata';
    const today = moment.tz(IST).startOf('day').toDate();

    // Check if already ran today
    const CronRun = require('../models/cron-run.model');
    const lastRun = await CronRun.findOne({ jobName: 'DPD_UPDATE', runDate: { $gte: today } });
    if (lastRun) return { skipped: true, reason: 'Already ran today' };

    const loans = await Loan.find({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    let updated = 0;
    let escalated = 0;

    for (const loan of loans) {
      const installments = await Installment.find({ loanId: loan._id }).sort({ installmentNo: 1 });
      const unpaid = installments.find(i => i.status !== 'PAID');
      if (!unpaid) continue;

      const dpd = Math.max(0, moment().diff(moment(unpaid.dueDate), 'days'));
      const bucket = this.getBucket(dpd);
      const prevBucket = loan.bucket;

      if (dpd !== loan.dpd || bucket !== loan.bucket) {
        loan.dpd = dpd;
        loan.bucket = bucket;

        // Auto-escalate to legal
        if (dpd >= 90 && loan.status !== 'LEGAL') {
          loan.status = 'LEGAL';
          const existing = await LegalCase.findOne({ loanId: loan._id });
          if (!existing) {
            await LegalCase.create({ loanId: loan._id, dpdAtEntry: dpd, status: 'OPEN' });
            escalated++;
          }
        }

        await loan.save();

        // Track bucket change
        if (prevBucket !== bucket) {
          await LoanBucketHistory.create({
            loanId: loan._id,
            previousBucket: prevBucket,
            currentBucket: bucket,
            dpd
          });
        }

        updated++;
      }
    }

    // Record run
    await CronRun.create({ jobName: 'DPD_UPDATE', runDate: today, recordsProcessed: updated });

    return { updated, escalated };
  }

  static getBucket(dpd) {
    if (dpd === 0) return 'CURRENT';
    if (dpd <= 7) return '1-7';
    if (dpd <= 15) return '8-15';
    if (dpd <= 22) return '16-22';
    if (dpd <= 29) return '23-29';
    if (dpd <= 59) return '30+';
    if (dpd <= 89) return '60+';
    return 'LEGAL';
  }
}

module.exports = DPDSafeService;
