const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const AuditLog = require('../models/audit-log.model');
const moment = require('moment');

const BUCKET_RANGES = {
  'CURRENT': { min: 0, max: 0 },
  '1-7': { min: 1, max: 7 },
  '8-15': { min: 8, max: 15 },
  '16-22': { min: 16, max: 22 },
  '23-29': { min: 23, max: 29 },
  '30+': { min: 30, max: 59 },
  '60+': { min: 60, max: 89 },
  'LEGAL': { min: 90, max: Infinity }
};

class DPDUpdateService {
  static calculateDPD(installments) {
    const unpaid = installments.find(inst => 
      inst.status === 'pending' || inst.status === 'partially_paid' || inst.status === 'overdue'
    );
    
    if (!unpaid) return 0;
    
    const dpd = moment().diff(moment(unpaid.dueDate), 'days');
    return Math.max(0, dpd);
  }

  static assignBucket(dpd) {
    for (const [bucket, range] of Object.entries(BUCKET_RANGES)) {
      if (dpd >= range.min && dpd <= range.max) return bucket;
    }
    return 'CURRENT';
  }

  static async updateAllLoans() {
    const loans = await Loan.find({ status: { $in: ['active', 'npa'] } });
    let updated = 0;
    let legalEscalated = 0;

    for (const loan of loans) {
      const installments = await Installment.find({ loanId: loan._id }).sort({ sequence: 1 });
      
      const dpd = this.calculateDPD(installments);
      const bucket = this.assignBucket(dpd);
      const prevBucket = loan.bucket;

      if (dpd !== loan.dpd || bucket !== loan.bucket) {
        loan.dpd = dpd;
        loan.bucket = bucket;

        if (dpd >= 90 && loan.status !== 'npa') {
          loan.status = 'npa';
          legalEscalated++;
        }

        await loan.save();
        updated++;

        await AuditLog.create({
          action: 'DPD_UPDATED',
          entity: 'LOAN',
          entityId: loan._id,
          userId: null,
          changes: { before: { dpd: loan.dpd, bucket: prevBucket }, after: { dpd, bucket } },
          status: 'SUCCESS'
        });
      }
    }

    return { loansUpdated: updated, legalEscalated };
  }
}

module.exports = DPDUpdateService;
