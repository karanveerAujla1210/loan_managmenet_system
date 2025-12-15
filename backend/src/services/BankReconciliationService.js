const BankReconciliation = require('../models/BankReconciliationModel');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

class BankReconciliationService {
  // Create reconciliation from bank statement
  async createReconciliation(reconciliationDate, account, transactions, userId) {
    const reconciliation = new BankReconciliation({
      reconciliationDate,
      account,
      status: 'IN_PROGRESS',
      transactions: transactions.map(t => ({
        bankUTR: t.utr,
        bankAmount: t.amount,
        bankDate: t.date,
        bankMode: t.mode,
        matchStatus: 'PENDING_CONFIRMATION',
      })),
    });

    reconciliation.auditLog.push({
      action: 'RECONCILIATION_CREATED',
      user: userId,
      details: { transactionCount: transactions.length },
    });

    await reconciliation.save();
    return reconciliation;
  }

  // Auto-match bank transactions with CRM payments
  async autoMatch(reconciliationId, userId) {
    const reconciliation = await BankReconciliation.findById(reconciliationId);

    for (let i = 0; i < reconciliation.transactions.length; i++) {
      const bankTx = reconciliation.transactions[i];

      // Search for matching payment
      const payment = await Payment.findOne({
        referenceNumber: bankTx.bankUTR,
        amount: bankTx.bankAmount,
        paymentDate: {
          $gte: new Date(bankTx.bankDate.getTime() - 86400000), // ±1 day
          $lte: new Date(bankTx.bankDate.getTime() + 86400000),
        },
      });

      if (payment) {
        bankTx.crmPaymentId = payment._id;
        bankTx.crmAmount = payment.amount;
        bankTx.crmDate = payment.paymentDate;
        bankTx.matchStatus = 'MATCHED';
      } else {
        bankTx.matchStatus = 'UNLINKED_PAYMENT';
      }
    }

    reconciliation.auditLog.push({
      action: 'AUTO_MATCH_COMPLETED',
      user: userId,
      details: {},
    });

    await reconciliation.save();
    return reconciliation;
  }

  // Manually link unmatched payment
  async linkPayment(reconciliationId, transactionIndex, loanId, userId) {
    const reconciliation = await BankReconciliation.findById(reconciliationId);
    const bankTx = reconciliation.transactions[transactionIndex];

    // Create new payment record
    const payment = new Payment({
      loanId,
      amount: bankTx.bankAmount,
      paymentDate: bankTx.bankDate,
      mode: bankTx.bankMode,
      referenceNumber: bankTx.bankUTR,
      status: 'CONFIRMED',
    });

    await payment.save();

    // Update transaction
    bankTx.crmPaymentId = payment._id;
    bankTx.matchStatus = 'MATCHED';
    bankTx.resolution = {
      action: 'LINKED_TO_LOAN',
      linkedLoanId: loanId,
      resolvedBy: userId,
      resolvedAt: new Date(),
    };

    reconciliation.auditLog.push({
      action: 'PAYMENT_LINKED',
      user: userId,
      details: { loanId, bankUTR: bankTx.bankUTR },
    });

    await reconciliation.save();
    return reconciliation;
  }

  // Flag fraud alert
  async flagFraud(reconciliationId, transactionIndex, reason, userId) {
    const reconciliation = await BankReconciliation.findById(reconciliationId);
    const bankTx = reconciliation.transactions[transactionIndex];

    bankTx.matchStatus = 'FRAUD_ALERT';
    bankTx.resolution = {
      action: 'FRAUD_FLAGGED',
      resolvedBy: userId,
      resolvedAt: new Date(),
      note: reason,
    };

    reconciliation.auditLog.push({
      action: 'FRAUD_ALERT_RAISED',
      user: userId,
      details: { bankUTR: bankTx.bankUTR, reason },
    });

    await reconciliation.save();
    return reconciliation;
  }

  // Finalize reconciliation
  async finalizeReconciliation(reconciliationId, userId) {
    const reconciliation = await BankReconciliation.findById(reconciliationId);

    // Calculate summary
    let totalBankAmount = 0;
    let totalCRMAmount = 0;
    let matchedCount = 0;
    let unmatchedCount = 0;

    reconciliation.transactions.forEach(tx => {
      totalBankAmount += tx.bankAmount;
      if (tx.matchStatus === 'MATCHED') {
        totalCRMAmount += tx.crmAmount;
        matchedCount++;
      } else {
        unmatchedCount++;
      }
    });

    reconciliation.summary = {
      totalBankAmount,
      totalCRMAmount,
      matchedCount,
      unmatchedCount,
      discrepancyAmount: totalBankAmount - totalCRMAmount,
    };

    reconciliation.status = 'RECONCILED';
    reconciliation.lockedAt = new Date();
    reconciliation.lockedBy = userId;

    reconciliation.auditLog.push({
      action: 'RECONCILIATION_FINALIZED',
      user: userId,
      details: reconciliation.summary,
    });

    await reconciliation.save();
    return reconciliation;
  }

  // Get reconciliation details
  async getReconciliation(reconciliationId) {
    return BankReconciliation.findById(reconciliationId)
      .populate('transactions.crmPaymentId')
      .populate('lockedBy');
  }

  // List reconciliations
  async listReconciliations(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.account) query.account = filters.account;
    if (filters.dateFrom) {
      query.reconciliationDate = {
        $gte: new Date(filters.dateFrom),
      };
    }

    return BankReconciliation.find(query).sort({ reconciliationDate: -1 });
  }
}

module.exports = new BankReconciliationService();
