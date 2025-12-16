const Loan = require('../models/Loan');
const Instalment = require('../models/Instalment');
const LegalCase = require('../models/LegalCase');
const LoanBucketHistory = require('../models/LoanBucketHistory');
const { updateDPDAndBucket } = require('../utils/dpdBucketEngine');

const updateAllLoans = async () => {
  try {
    const loans = await Loan.find({ status: { $in: ['ACTIVE', 'LEGAL'] } });
    
    for (const loan of loans) {
      const installments = await Instalment.find({ loanId: loan._id });
      const updates = updateDPDAndBucket(loan, installments);
      
      if (updates.bucket !== loan.bucket) {
        await LoanBucketHistory.create({
          loanId: loan._id,
          previousBucket: loan.bucket,
          currentBucket: updates.bucket,
          dpd: updates.dpd
        });
      }
      
      if (updates.dpd >= 90 && loan.status !== 'LEGAL') {
        try {
          await LegalCase.create({
            loanId: loan._id,
            dpdAtEntry: updates.dpd,
            status: 'OPEN'
          });
        } catch (err) {
          console.error(`Failed to create legal case for loan ${loan._id}:`, err.message);
        }
      }
      
      await Loan.findByIdAndUpdate(loan._id, {
        dpd: updates.dpd,
        bucket: updates.bucket,
        status: updates.status
      });
    }
    
    return { success: true, loansUpdated: loans.length };
  } catch (error) {
    throw new Error(`DPD update failed: ${error.message}`);
  }
};

module.exports = {
  updateAllLoans
};
