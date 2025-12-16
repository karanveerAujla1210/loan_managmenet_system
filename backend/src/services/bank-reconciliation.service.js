const BankReconciliation = require('../models/bank-reconciliation.model');
const Payment = require('../models/payment.model');
const Loan = require('../models/loan.model');
const AuditLog = require('../models/audit-log.model');
const moment = require('moment');

class BankReconciliationService {
  static async matchPayments(bankStatements) {
    const results = { exactMatches: [], semiMatches: [], looseMatches: [], unmatched: [] };

    for (const stmt of bankStatements) {
      let matched = false;

      // Step 1: Exact match (UTR + Amount + Date ±1 day)
      if (stmt.utr) {
        const exactMatch = await Payment.findOne({
          utr: stmt.utr,
          amount: stmt.amount,
          createdAt: {
            $gte: moment(stmt.transactionDate).subtract(1, 'day').toDate(),
            $lte: moment(stmt.transactionDate).add(1, 'day').toDate()
          }
        });

        if (exactMatch) {
          await BankReconciliation.create({
            ...stmt,
            matchedPaymentId: exactMatch._id,
            matchedLoanId: exactMatch.loanId,
            status: 'MATCHED',
            matchType: 'EXACT'
          });
          results.exactMatches.push(stmt);
          matched = true;
          continue;
        }
      }

      // Step 2: Semi match (Amount + Date ±1 day)
      const semiMatch = await Payment.findOne({
        amount: stmt.amount,
        createdAt: {
          $gte: moment(stmt.transactionDate).subtract(1, 'day').toDate(),
          $lte: moment(stmt.transactionDate).add(1, 'day').toDate()
        }
      });

      if (semiMatch) {
        await BankReconciliation.create({
          ...stmt,
          matchedPaymentId: semiMatch._id,
          matchedLoanId: semiMatch.loanId,
          status: 'REVIEW',
          matchType: 'SEMI'
        });
        results.semiMatches.push(stmt);
        matched = true;
        continue;
      }

      // Step 3: Loose match (Amount + Date ±2 days)
      const looseMatch = await Payment.findOne({
        amount: stmt.amount,
        createdAt: {
          $gte: moment(stmt.transactionDate).subtract(2, 'days').toDate(),
          $lte: moment(stmt.transactionDate).add(2, 'days').toDate()
        }
      });

      if (looseMatch) {
        await BankReconciliation.create({
          ...stmt,
          matchedPaymentId: looseMatch._id,
          matchedLoanId: looseMatch.loanId,
          status: 'REVIEW',
          matchType: 'LOOSE'
        });
        results.looseMatches.push(stmt);
        matched = true;
      }

      if (!matched) {
        await BankReconciliation.create({
          ...stmt,
          status: 'UNMATCHED'
        });
        results.unmatched.push(stmt);
      }
    }

    return results;
  }

  static async reconcilePayments(reconciliationIds, userId) {
    const reconciliations = await BankReconciliation.updateMany(
      { _id: { $in: reconciliationIds } },
      { status: 'RECONCILED', resolvedBy: userId, resolvedAt: new Date() }
    );

    for (const id of reconciliationIds) {
      const recon = await BankReconciliation.findById(id);
      if (recon.matchedPaymentId) {
        await Payment.findByIdAndUpdate(recon.matchedPaymentId, { reconciled: true });
      }
    }

    return reconciliations;
  }

  static async lockReconciliationDay(date, userId) {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    await BankReconciliation.updateMany(
      { statementDate: { $gte: startOfDay, $lte: endOfDay }, status: 'RECONCILED' },
      { status: 'LOCKED', resolvedBy: userId }
    );

    await AuditLog.create({
      action: 'RECONCILIATION_LOCKED',
      entity: 'RECONCILIATION',
      entityId: null,
      userId,
      changes: { after: { date, status: 'LOCKED' } },
      status: 'SUCCESS'
    });
  }
}

module.exports = BankReconciliationService;
