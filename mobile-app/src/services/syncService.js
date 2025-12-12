import { useDatabase } from '../contexts/DatabaseContext';
import { paymentService, collectionService } from './api';
import { v4 as uuidv4 } from 'uuid';

class SyncService {
  constructor(db) {
    this.db = db;
  }

  // Generate unique client reference
  generateClientRef() {
    return `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Store payment offline
  async storePaymentOffline(loanId, amount, paymentMethod, reference) {
    return new Promise((resolve, reject) => {
      const clientRef = this.generateClientRef();
      const createdAt = new Date().toISOString();
      
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO payments (clientRef, loanId, amount, paymentMethod, reference, createdAt, synced) VALUES (?, ?, ?, ?, ?, ?, 0)',
          [clientRef, loanId, amount, paymentMethod, reference, createdAt],
          (_, result) => resolve({ clientRef, id: result.insertId }),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Store note offline
  async storeNoteOffline(loanId, description) {
    return new Promise((resolve, reject) => {
      const clientRef = this.generateClientRef();
      const createdAt = new Date().toISOString();
      
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO notes (clientRef, loanId, description, createdAt, synced) VALUES (?, ?, ?, ?, 0)',
          [clientRef, loanId, description, createdAt],
          (_, result) => resolve({ clientRef, id: result.insertId }),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Store PTP offline
  async storePTPOffline(loanId, ptpDate, ptpAmount, notes) {
    return new Promise((resolve, reject) => {
      const clientRef = this.generateClientRef();
      const createdAt = new Date().toISOString();
      
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO ptps (clientRef, loanId, ptpDate, ptpAmount, notes, createdAt, synced) VALUES (?, ?, ?, ?, ?, ?, 0)',
          [clientRef, loanId, ptpDate, ptpAmount, notes, createdAt],
          (_, result) => resolve({ clientRef, id: result.insertId }),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Sync pending payments
  async syncPayments() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM payments WHERE synced = 0',
          [],
          async (_, { rows }) => {
            const payments = rows._array;
            const results = [];
            
            for (const payment of payments) {
              try {
                await paymentService.create({
                  loanId: payment.loanId,
                  amount: payment.amount,
                  paymentMethod: payment.paymentMethod,
                  reference: payment.reference,
                  clientRef: payment.clientRef
                });
                
                // Mark as synced
                await this.markPaymentSynced(payment.id);
                results.push({ success: true, payment });
              } catch (error) {
                results.push({ success: false, payment, error });
              }
            }
            
            resolve(results);
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  // Sync pending notes
  async syncNotes() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM notes WHERE synced = 0',
          [],
          async (_, { rows }) => {
            const notes = rows._array;
            const results = [];
            
            for (const note of notes) {
              try {
                await collectionService.addNote({
                  loanId: note.loanId,
                  description: note.description
                });
                
                // Mark as synced
                await this.markNoteSynced(note.id);
                results.push({ success: true, note });
              } catch (error) {
                results.push({ success: false, note, error });
              }
            }
            
            resolve(results);
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  // Sync pending PTPs
  async syncPTPs() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM ptps WHERE synced = 0',
          [],
          async (_, { rows }) => {
            const ptps = rows._array;
            const results = [];
            
            for (const ptp of ptps) {
              try {
                await collectionService.createPTP({
                  loanId: ptp.loanId,
                  ptpDate: ptp.ptpDate,
                  ptpAmount: ptp.ptpAmount,
                  notes: ptp.notes
                });
                
                // Mark as synced
                await this.markPTPSynced(ptp.id);
                results.push({ success: true, ptp });
              } catch (error) {
                results.push({ success: false, ptp, error });
              }
            }
            
            resolve(results);
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  // Mark payment as synced
  async markPaymentSynced(id) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'UPDATE payments SET synced = 1 WHERE id = ?',
          [id],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Mark note as synced
  async markNoteSynced(id) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'UPDATE notes SET synced = 1 WHERE id = ?',
          [id],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Mark PTP as synced
  async markPTPSynced(id) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'UPDATE ptps SET synced = 1 WHERE id = ?',
          [id],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Sync all pending data
  async syncAll() {
    try {
      const [paymentResults, noteResults, ptpResults] = await Promise.all([
        this.syncPayments(),
        this.syncNotes(),
        this.syncPTPs()
      ]);
      
      return {
        payments: paymentResults,
        notes: noteResults,
        ptps: ptpResults
      };
    } catch (error) {
      throw error;
    }
  }

  // Get pending sync count
  async getPendingSyncCount() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT 
            (SELECT COUNT(*) FROM payments WHERE synced = 0) as payments,
            (SELECT COUNT(*) FROM notes WHERE synced = 0) as notes,
            (SELECT COUNT(*) FROM ptps WHERE synced = 0) as ptps
          `,
          [],
          (_, { rows }) => {
            const result = rows._array[0];
            const total = result.payments + result.notes + result.ptps;
            resolve({ ...result, total });
          },
          (_, error) => reject(error)
        );
      });
    });
  }
}

export default SyncService;