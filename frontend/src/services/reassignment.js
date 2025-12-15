import api from './api';

/**
 * Reassign a case to a different collector
 */
export const reassignCase = async (loanId, newCollectorId, reason = '') => {
  try {
    const response = await api.post(`/loans/${loanId}/reassign`, {
      newCollectorId,
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error reassigning case:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
