import db from '../db/schema';
import dayjs from 'dayjs';

export const reconcilePaymentResponse = (loanId, paymentResponse) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Update loan outstanding amount
      if (paymentResponse.loan) {
        tx.executeSql(
          `UPDATE loans SET 
           outstanding_amount = ?, 
           last_synced_at = ?,
           is_dirty = 0
           WHERE loan_id = ?`,
          [
            paymentResponse.loan.outstandingAmount,
            dayjs().toISOString(),
            loanId
          ]
        );
      }

      // Update schedule with payment allocation
      if (paymentResponse.allocation) {
        paymentResponse.allocation.forEach(alloc => {
          tx.executeSql(
            `UPDATE schedule SET 
             paid_amount = paid_amount + ?,
             status = CASE 
               WHEN paid_amount + ? >= amount THEN 'paid'
               ELSE 'partial'
             END
             WHERE loan_id = ? AND inst_no = ?`,
            [alloc.amount, alloc.amount, loanId, alloc.installmentNo]
          );
        });
      }

      // Mark payment as synced
      if (paymentResponse.transactionId) {
        tx.executeSql(
          `UPDATE payments SET 
           status = 'synced',
           backend_ref = ?
           WHERE client_ref = ?`,
          [paymentResponse.transactionId, paymentResponse.clientRef]
        );
      }
    }, reject, resolve);
  });
};

export const reconcileLoanData = (serverLoan) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO loans 
         (loan_id, backend_id, customer_name, customer_phone, principal, 
          status, agent_id, dpd, bucket, outstanding_amount, next_due_date, last_synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          serverLoan.loanId,
          serverLoan.id,
          serverLoan.customerName,
          serverLoan.customerPhone,
          serverLoan.principal,
          serverLoan.status,
          serverLoan.agentId,
          serverLoan.dpd,
          serverLoan.bucket,
          serverLoan.outstandingAmount,
          serverLoan.nextDueDate,
          dayjs().toISOString()
        ]
      );

      // Update schedule if provided
      if (serverLoan.schedule) {
        serverLoan.schedule.forEach(inst => {
          tx.executeSql(
            `INSERT OR REPLACE INTO schedule 
             (loan_id, inst_no, due_date, amount, status, paid_amount)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              serverLoan.loanId,
              inst.installmentNo,
              inst.dueDate,
              inst.amount,
              inst.status,
              inst.paidAmount || 0
            ]
          );
        });
      }
    }, reject, resolve);
  });
};