/**
 * DPD CRON SCHEDULER
 * 
 * Runs daily at 2:30 AM to:
 * - Calculate DPD for all active loans
 * - Update bucket classification (current → 1-7 → ... → 90+ → 120+)
 * - Auto-escalate 90+ DPD to legal queue
 * - Update collections tracking
 * - Mark installments as overdue
 * 
 * Can also be triggered manually via API or npm script
 */

const cron = require('node-cron');
const Loan = require('../models/Loan');
const Schedule = require('../models/Schedule');
const Collections = require('../models/Collections');
const { computeBucket } = require('../utils/dpdBucketEngine');

/**
 * Core DPD calculation logic
 */
async function calculateAndUpdateDPD() {
  try {
    console.log(`[DPD CRON] Starting DPD calculation at ${new Date().toISOString()}`);

    const loans = await Loan.find({ status: 'active' });
    let updatedCount = 0;
    let escalatedCount = 0;
    const escalatedCases = [];

    for (const loan of loans) {
      // Find next unpaid installment
      const nextDue = await Schedule.findOne({
        loanId: loan._id,
        status: { $ne: 'paid' }
      }).sort({ installmentNumber: 1 });

      if (!nextDue) {
        // All installments paid - mark loan as closed
        await Loan.updateOne({ _id: loan._id }, { status: 'closed' });
        continue;
      }

      // Calculate DPD from due date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      const dueDate = new Date(nextDue.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Start of due date
      
      const dpd = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));

      // Calculate bucket based on DPD
      const bucket = computeBucket(dpd);

      // Detect bucket escalation (90+ is legal escalation point)
      const previousBucket = loan.bucket;
      const isNowLegal = (dpd > 90 && previousBucket !== '90+' && previousBucket !== '120+');

      if (isNowLegal) {
        escalatedCases.push({
          loanId: loan.loanId,
          customerId: loan.customerId,
          amount: nextDue.remainingAmount,
          dpd,
          bucket,
          escalatedAt: new Date()
        });
        escalatedCount++;
      }

      // Update loan record
      await Loan.updateOne(
        { _id: loan._id },
        {
          dpd,
          bucket,
          legalStatus: dpd > 90 ? 'notice_pending' : undefined
        }
      );

      // Update collections tracking
      await Collections.findOneAndUpdate(
        { loanId: loan._id },
        {
          loanId: loan._id,
          customerId: loan.customerId,
          dpd,
          bucket,
          legalStatus: dpd > 90 ? 'notice_pending' : undefined,
          lastUpdated: new Date()
        },
        { upsert: true }
      );

      // Mark overdue installments
      if (dpd > 0) {
        await Schedule.updateMany(
          {
            loanId: loan._id,
            dueDate: { $lt: today },
            status: { $in: ['pending', 'partial'] }
          },
          { status: 'overdue' }
        );
      }

      updatedCount++;
    }

    console.log(`[DPD CRON] Updated ${updatedCount} loans`);
    console.log(`[DPD CRON] Escalated ${escalatedCount} cases to legal`);

    // Log escalation event
    if (escalatedCases.length > 0) {
      console.log(`[DPD CRON] Legal escalation cases:`, escalatedCases);
      
      // TODO: Send notification to managers/legal team about new escalations
      // This could be email, SMS, or push notification
    }

    return {
      success: true,
      updatedCount,
      escalatedCount,
      escalatedCases,
      timestamp: new Date()
    };

  } catch (error) {
    console.error('[DPD CRON] Error during DPD calculation:', error);
    throw error;
  }
}

/**
 * Initialize cron job
 * Runs at 2:30 AM every day (0 30 2 * * *)
 */
function initDPDCron() {
  try {
    // Cron expression: minute hour day month dayOfWeek
    // 0 30 2 * * * = 2:30 AM every day
    const task = cron.schedule('30 2 * * *', async () => {
      console.log('[DPD CRON] Scheduled DPD calculation triggered');
      try {
        const result = await calculateAndUpdateDPD();
        console.log('[DPD CRON] Cron completed successfully:', result);
      } catch (err) {
        console.error('[DPD CRON] Cron execution failed:', err);
        // Continue running despite errors
      }
    });

    console.log('[DPD CRON] Scheduler initialized - will run at 2:30 AM daily');
    return task;
  } catch (error) {
    console.error('[DPD CRON] Failed to initialize scheduler:', error);
    throw error;
  }
}

/**
 * Manual trigger for testing
 */
async function triggerDPDUpdate() {
  try {
    const result = await calculateAndUpdateDPD();
    return result;
  } catch (error) {
    console.error('[DPD CRON] Manual trigger failed:', error);
    throw error;
  }
}

module.exports = {
  calculateAndUpdateDPD,
  initDPDCron,
  triggerDPDUpdate
};
