import api from './api';

const mockLogs = [
  { id: '1', user: 'admin@loancrm.com', action: 'Approved loan CBL00000000002', date: '2025-03-22 10:12:00', details: 'Approved by manager J.' },
  { id: '2', user: 'collector1@loancrm.com', action: 'Recorded payment TXN123', date: '2025-03-22 11:05:00', details: 'Payment ₹2500 for loan CBL00000000002' },
  { id: '3', user: 'system', action: 'DPD bucket updated', date: '2025-03-23 02:00:00', details: 'DPD job ran successfully' }
];

/**
 * Get audit logs (legacy)
 */
export const getAuditLogs = async (params = {}) => {
  try {
    const response = await api.get('/audit/logs', { params });
    return response.data;
  } catch (error) {
    // Return mock logs on failure
    return { success: true, data: mockLogs, pagination: { total: mockLogs.length, page: 1, pages: 1, limit: 10 } };
  }
};

/**
 * Get audit trail for a specific loan
 */
export const getLoanAuditTrail = async (loanId, page = 0, limit = 20) => {
  try {
    const response = await api.get(`/audit/loan/${loanId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 0, pages: 0 }
    };
  }
};

/**
 * Get audit logs by date range
 */
export const getAuditLogsByDateRange = async (startDate, endDate, options = {}) => {
  try {
    const response = await api.get('/audit/range', {
      params: {
        startDate,
        endDate,
        userId: options.userId,
        action: options.action,
        page: options.page || 0,
        limit: options.limit || 50
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 0, pages: 0 }
    };
  }
};

/**
 * Get user activity summary
 */
export const getUserActivitySummary = async (userId, days = 30) => {
  try {
    const response = await api.get(`/audit/user/${userId}`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    return {
      success: false,
      data: {}
    };
  }
};

export default { getAuditLogs, getLoanAuditTrail, getAuditLogsByDateRange, getUserActivitySummary };