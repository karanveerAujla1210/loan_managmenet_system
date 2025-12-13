import api from './api';

const mockLogs = [
  { id: '1', user: 'admin@loancrm.com', action: 'Approved loan CBL00000000002', date: '2025-03-22 10:12:00', details: 'Approved by manager J.' },
  { id: '2', user: 'collector1@loancrm.com', action: 'Recorded payment TXN123', date: '2025-03-22 11:05:00', details: 'Payment ₹2500 for loan CBL00000000002' },
  { id: '3', user: 'system', action: 'DPD bucket updated', date: '2025-03-23 02:00:00', details: 'DPD job ran successfully' }
];

export const getAuditLogs = async (params = {}) => {
  try {
    const response = await api.get('/audit/logs', { params });
    return response.data;
  } catch (error) {
    // Return mock logs on failure
    return { success: true, data: mockLogs, pagination: { total: mockLogs.length, page: 1, pages: 1, limit: 10 } };
  }
};

export default { getAuditLogs };