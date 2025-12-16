/**
 * Import Service
 * Handles API calls for import flow
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const importService = {
  /**
   * Step 1: Validate loans
   */
  validateLoans: async (rows) => {
    const response = await fetch(`${API_BASE}/import/loans/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ rows })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Validation failed');
    }

    return response.json();
  },

  /**
   * Step 2: Preview loans
   */
  previewLoans: async (normalized) => {
    const response = await fetch(`${API_BASE}/import/loans/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ normalized })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Preview failed');
    }

    return response.json();
  },

  /**
   * Step 3: Confirm loans import
   */
  confirmLoans: async (normalized) => {
    const response = await fetch(`${API_BASE}/import/loans/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ normalized })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Import failed');
    }

    return response.json();
  },

  /**
   * Step 1: Validate payments
   */
  validatePayments: async (rows) => {
    const response = await fetch(`${API_BASE}/import/payments/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ rows })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Validation failed');
    }

    return response.json();
  },

  /**
   * Step 2: Confirm payments import
   */
  confirmPayments: async (normalized) => {
    const response = await fetch(`${API_BASE}/import/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ normalized })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Import failed');
    }

    return response.json();
  }
};
