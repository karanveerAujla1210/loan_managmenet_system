import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

/**
 * Promise Service
 * Handles promise-to-pay tracking and follow-up
 */

/**
 * Record a promise to pay on a loan
 */
export const recordPromise = async (loanId, promiseData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/loans/${loanId}/promise`,
      {
        promiseToPayDate: promiseData.promiseDate,
        promiseAmount: promiseData.amount,
        remarks: promiseData.remarks || 'Promise recorded',
      }
    );
    return {
      success: true,
      data: response.data,
      message: 'Promise recorded successfully'
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to record promise');
  }
};

/**
 * Mark a promised payment as honored (collector confirmed payment received)
 */
export const markPromiseHonored = async (loanId) => {
  try {
    const response = await axios.put(
      `${API_BASE}/loans/${loanId}/promise/honored`,
      { status: 'honored' }
    );
    return {
      success: true,
      data: response.data,
      message: 'Promise marked as honored'
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark promise honored');
  }
};

/**
 * Mark a promised payment as broken (due date passed, no payment received)
 */
export const markPromiseBroken = async (loanId, reason) => {
  try {
    const response = await axios.put(
      `${API_BASE}/loans/${loanId}/promise/broken`,
      { status: 'broken', reason }
    );
    return {
      success: true,
      data: response.data,
      message: 'Promise marked as broken'
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark promise broken');
  }
};

/**
 * Get promise history for a loan
 */
export const getPromiseHistory = async (loanId) => {
  try {
    const response = await axios.get(`${API_BASE}/loans/${loanId}/promise/history`);
    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch promise history');
  }
};

/**
 * Get all loans with promises due today
 */
export const getPromisesDueToday = async () => {
  try {
    const response = await axios.get(`${API_BASE}/promises/due-today`);
    return {
      success: true,
      data: response.data || [],
      count: response.data?.length || 0,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch promises due today');
  }
};

/**
 * Get promise analytics (fulfillment rates by collector)
 */
export const getPromiseAnalytics = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/promises/analytics`, { params: filters });
    return {
      success: true,
      data: response.data || {},
      stats: response.data?.stats || [],
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch promise analytics');
  }
};
