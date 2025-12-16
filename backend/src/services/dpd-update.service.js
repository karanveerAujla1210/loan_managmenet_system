const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const LegalCase = require('../models/LegalCase');
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
      inst.status === 'PENDING' || inst.status === 'PARTIAL' || inst.status === 'OVERDUE'
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
    const loans = await Loan.find({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    let updated = 0;
    let legalEscalated = 0;

    for (const loan of loans) {
      const installments = await Installment.find({ loanId: loan._id }).sort({ installmentNo: 1 });
      
      const dpd = this.calculateDPD(installments);
      const bucket = this.assignBucket(dpd);
      const prevBucket = loan.bucket;

      if (dpd !== loan.dpd || bucket !== loan.bucket) {
        loan.dpd = dpd;
        loan.bucket = bucket;

        // Auto-escalate to legal at DPD >= 90
        if (dpd >= 90 && loan.status !== 'LEGAL') {
          loan.status = 'LEGAL';
          
          // Create legal case
          const existingCase = await LegalCase.findOne({ loanId: loan._id });
          if (!existingCase) {
            await LegalCase.create({
              loanId: loan._id,
              dpdAtEntry: dpd,
              status: 'OPEN'
            });
            legalEscalated++;
          }
        }

        await loan.save();
        updated++;

        // Audit log
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
