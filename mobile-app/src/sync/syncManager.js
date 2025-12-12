import db from '../db/schema';
import apiClient from '../api/axios';
import { reconcilePaymentResponse } from '../utils/reconcile';
import dayjs from 'dayjs';

class SyncManager {
  constructor() {
    this.isRunning = false;
    this.maxConcurrent = 3;
    this.maxRetries = 5;
  }

  async startSync() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting sync...');

    try {
      await this.processSyncQueue();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async processSyncQueue() {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM sync_queue 
           WHERE status = 'pending' AND attempts < ?
           ORDER BY created_at ASC LIMIT ?`,
          [this.maxRetries, this.maxConcurrent],
          async (_, { rows }) => {
            const items = rows._array;
            
            if (items.length === 0) {
              resolve();
              return;
            }

            const promises = items.map(item => this.processQueueItem(item));
            
            try {
              await Promise.allSettled(promises);
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  async processQueueItem(item) {
    const payload = JSON.parse(item.payload);
    
    try {
      let response;
      
      switch (item.type) {
        case 'payment':
          response = await this.syncPayment(payload);
          break;
        case 'ptp':
          response = await this.syncPTP(payload);
          break;
        case 'note':
          response = await this.syncNote(payload);
          break;
        default:
          throw new Error(`Unknown sync type: ${item.type}`);
      }

      await this.markQueueItemSuccess(item.id, response);
      
    } catch (error) {
      await this.markQueueItemError(item.id, error);
    }
  }

  async syncPayment(payload) {
    const response = await apiClient.post(`/collections/${payload.loanId}/payment`, {
      clientRef: payload.clientRef,
      amount: payload.amount,
      date: payload.date,
      mode: payload.mode,
      agentId: payload.agentId,
      notes: payload.notes,
      attachment: payload.attachment
    });

    // Reconcile payment response with local data
    await reconcilePaymentResponse(payload.loanId, response.data);
    
    return response.data;
  }

  async syncPTP(payload) {
    const response = await apiClient.post(`/collections/${payload.loanId}/ptp`, {
      clientRef: payload.clientRef,
      promiseDate: payload.promiseDate,
      amount: payload.amount,
      note: payload.note,
      agentId: payload.agentId
    });

    // Update local PTP record
    await this.updateLocalRecord('ptps', payload.clientRef, {
      status: 'synced',
      backend_ref: response.data.id
    });

    return response.data;
  }

  async syncNote(payload) {
    const response = await apiClient.post(`/collections/${payload.loanId}/note`, {
      clientRef: payload.clientRef,
      text: payload.text,
      agentId: payload.agentId
    });

    // Update local note record
    await this.updateLocalRecord('notes', payload.clientRef, {
      status: 'synced',
      backend_ref: response.data.id
    });

    return response.data;
  }

  async markQueueItemSuccess(queueId, response) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE sync_queue SET 
           status = 'completed',
           last_attempt_at = ?
           WHERE id = ?`,
          [dayjs().toISOString(), queueId],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  async markQueueItemError(queueId, error) {
    const isRetryable = this.isRetryableError(error);
    const status = isRetryable ? 'pending' : 'failed';
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE sync_queue SET 
           attempts = attempts + 1,
           status = ?,
           error_message = ?,
           last_attempt_at = ?
           WHERE id = ?`,
          [status, error.message, dayjs().toISOString(), queueId],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  isRetryableError(error) {
    if (!error.response) return true; // Network error
    const status = error.response.status;
    return status >= 500 || status === 429; // Server errors or rate limiting
  }

  async updateLocalRecord(table, clientRef, updates) {
    return new Promise((resolve, reject) => {
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE ${table} SET ${setClause} WHERE client_ref = ?`,
          [...values, clientRef],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  async getSyncStatus() {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT 
             COUNT(*) as total,
             SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
             SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
           FROM sync_queue`,
          [],
          (_, { rows }) => resolve(rows._array[0]),
          (_, error) => reject(error)
        );
      });
    });
  }
}

export default new SyncManager();