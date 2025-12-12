import db from '../db/schema';
import { generateClientRef, generateLocalId } from '../utils/idempotency';
import syncManager from '../sync/syncManager';
import dayjs from 'dayjs';

export const recordPayment = async (loanId, paymentData, agentId) => {
  const clientRef = generateClientRef();
  const localId = generateLocalId();
  
  const payment = {
    localId,
    loanId,
    amount: paymentData.amount,
    date: paymentData.date || dayjs().toISOString(),
    mode: paymentData.mode,
    agentId,
    notes: paymentData.notes,
    attachmentPath: paymentData.attachmentPath,
    clientRef,
    status: 'queued'
  };

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Insert payment record
      tx.executeSql(
        `INSERT INTO payments 
         (local_id, loan_id, amount, date, mode, agent_id, notes, attachment_path, client_ref, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payment.localId,
          payment.loanId,
          payment.amount,
          payment.date,
          payment.mode,
          payment.agentId,
          payment.notes,
          payment.attachmentPath,
          payment.clientRef,
          payment.status
        ]
      );

      // Add to sync queue
      tx.executeSql(
        `INSERT INTO sync_queue (type, payload, client_ref)
         VALUES (?, ?, ?)`,
        [
          'payment',
          JSON.stringify({
            clientRef: payment.clientRef,
            loanId: payment.loanId,
            amount: payment.amount,
            date: payment.date,
            mode: payment.mode,
            agentId: payment.agentId,
            notes: payment.notes,
            attachment: payment.attachmentPath
          }),
          payment.clientRef
        ]
      );

      // Mark loan as dirty
      tx.executeSql(
        `UPDATE loans SET is_dirty = 1 WHERE loan_id = ?`,
        [payment.loanId]
      );

    }, reject, () => {
      resolve(payment);
      // Try immediate sync
      syncManager.startSync().catch(console.error);
    });
  });
};

export const recordPTP = async (loanId, ptpData, agentId) => {
  const clientRef = generateClientRef();
  const localId = generateLocalId();
  
  const ptp = {
    localId,
    loanId,
    promiseDate: ptpData.promiseDate,
    amount: ptpData.amount,
    note: ptpData.note,
    agentId,
    clientRef,
    status: 'queued'
  };

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Insert PTP record
      tx.executeSql(
        `INSERT INTO ptps 
         (local_id, loan_id, promise_date, amount, note, agent_id, client_ref, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ptp.localId,
          ptp.loanId,
          ptp.promiseDate,
          ptp.amount,
          ptp.note,
          ptp.agentId,
          ptp.clientRef,
          ptp.status
        ]
      );

      // Add to sync queue
      tx.executeSql(
        `INSERT INTO sync_queue (type, payload, client_ref)
         VALUES (?, ?, ?)`,
        [
          'ptp',
          JSON.stringify({
            clientRef: ptp.clientRef,
            loanId: ptp.loanId,
            promiseDate: ptp.promiseDate,
            amount: ptp.amount,
            note: ptp.note,
            agentId: ptp.agentId
          }),
          ptp.clientRef
        ]
      );

    }, reject, () => {
      resolve(ptp);
      syncManager.startSync().catch(console.error);
    });
  });
};

export const recordNote = async (loanId, noteText, agentId) => {
  const clientRef = generateClientRef();
  const localId = generateLocalId();
  
  const note = {
    localId,
    loanId,
    text: noteText,
    timestamp: dayjs().toISOString(),
    agentId,
    clientRef,
    status: 'queued'
  };

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Insert note record
      tx.executeSql(
        `INSERT INTO notes 
         (local_id, loan_id, text, timestamp, agent_id, client_ref, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          note.localId,
          note.loanId,
          note.text,
          note.timestamp,
          note.agentId,
          note.clientRef,
          note.status
        ]
      );

      // Add to sync queue
      tx.executeSql(
        `INSERT INTO sync_queue (type, payload, client_ref)
         VALUES (?, ?, ?)`,
        [
          'note',
          JSON.stringify({
            clientRef: note.clientRef,
            loanId: note.loanId,
            text: note.text,
            agentId: note.agentId
          }),
          note.clientRef
        ]
      );

    }, reject, () => {
      resolve(note);
      syncManager.startSync().catch(console.error);
    });
  });
};

export const getAgentLoans = (agentId, filter = 'all') => {
  return new Promise((resolve, reject) => {
    let whereClause = 'WHERE agent_id = ?';
    let params = [agentId];

    if (filter === 'due_today') {
      whereClause += ' AND DATE(next_due_date) = DATE(?)';
      params.push(dayjs().format('YYYY-MM-DD'));
    } else if (filter === 'overdue') {
      whereClause += ' AND DATE(next_due_date) < DATE(?)';
      params.push(dayjs().format('YYYY-MM-DD'));
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM loans ${whereClause} ORDER BY next_due_date ASC`,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const getLoanDetails = (loanId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Get loan info
      tx.executeSql(
        'SELECT * FROM loans WHERE loan_id = ?',
        [loanId],
        (_, { rows }) => {
          if (rows.length === 0) {
            reject(new Error('Loan not found'));
            return;
          }
          
          const loan = rows._array[0];
          
          // Get schedule
          tx.executeSql(
            'SELECT * FROM schedule WHERE loan_id = ? ORDER BY inst_no',
            [loanId],
            (_, scheduleRows) => {
              loan.schedule = scheduleRows._array;
              
              // Get payments
              tx.executeSql(
                'SELECT * FROM payments WHERE loan_id = ? ORDER BY date DESC',
                [loanId],
                (_, paymentRows) => {
                  loan.payments = paymentRows._array;
                  
                  // Get PTPs
                  tx.executeSql(
                    'SELECT * FROM ptps WHERE loan_id = ? ORDER BY created_at DESC',
                    [loanId],
                    (_, ptpRows) => {
                      loan.ptps = ptpRows._array;
                      
                      // Get notes
                      tx.executeSql(
                        'SELECT * FROM notes WHERE loan_id = ? ORDER BY timestamp DESC',
                        [loanId],
                        (_, noteRows) => {
                          loan.notes = noteRows._array;
                          resolve(loan);
                        },
                        (_, error) => reject(error)
                      );
                    },
                    (_, error) => reject(error)
                  );
                },
                (_, error) => reject(error)
              );
            },
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};