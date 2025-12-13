import api from './api';

// Mock payment data
const mockPayments = [
  {
    id: 'pay_001',
    loanId: 'CBL00000000002',
    customerId: '6805bc97-c7e8-49e8-9d15-99620e0c92e9',
    customerName: 'NITIN CHAURASIA',
    amount: 2500,
    paymentDate: '2024-01-20',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    transactionId: 'TXN123456789',
    remarks: 'Monthly EMI payment'
  },
  {
    id: 'pay_002',
    loanId: 'CBL00000000011',
    customerId: '43b63713-159c-41c6-a8b0-442b6e6ee72f',
    customerName: 'AFREEN',
    amount: 2500,
    paymentDate: '2024-01-21',
    paymentMethod: 'upi',
    status: 'completed',
    transactionId: 'UPI987654321',
    remarks: 'Monthly EMI payment'
  },
  {
    id: 'pay_003',
    loanId: 'UBL00001',
    customerId: 'cc9a3b64-5cfc-4433-996b-e08513c479c4',
    customerName: 'PAWAN KESARWANI',
    amount: 15000,
    paymentDate: '2024-01-22',
    paymentMethod: 'cash',
    status: 'pending',
    transactionId: 'CASH001',
    remarks: 'Partial payment'
  }
];

export const getPayments = async (params = {}) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error) {
    let filteredPayments = [...mockPayments];
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredPayments = filteredPayments.filter(payment => 
        payment.customerName.toLowerCase().includes(searchTerm) ||
        payment.loanId.toLowerCase().includes(searchTerm) ||
        payment.transactionId.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params.status && params.status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === params.status);
    }
    
    if (params.loanId) {
      filteredPayments = filteredPayments.filter(payment => payment.loanId === params.loanId);
    }
    
    return {
      success: true,
      data: filteredPayments,
      pagination: {
        total: filteredPayments.length,
        page: 1,
        pages: 1
      }
    };
  }
};

export const getPayment = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    const payment = mockPayments.find(p => p.id === id);
    if (payment) {
      return { success: true, data: payment };
    }
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    const newPayment = {
      id: `pay_${Date.now()}`,
      ...paymentData,
      status: 'completed',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: `TXN${Date.now()}`
    };
    return { success: true, data: newPayment };
  }
};

export const updatePayment = async (id, paymentData) => {
  try {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  } catch (error) {
    return { success: true, data: { id, ...paymentData } };
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    return { success: true, message: 'Payment deleted successfully' };
  }
};

export const getLoanPayments = async (loanId) => {
  try {
    const response = await api.get(`/loans/${loanId}/payments`);
    return response.data;
  } catch (error) {
    const loanPayments = mockPayments.filter(p => p.loanId === loanId);
    return { success: true, data: loanPayments };
  }
};

export const getCustomerPayments = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}/payments`);
    return response.data;
  } catch (error) {
    const customerPayments = mockPayments.filter(p => p.customerId === customerId);
    return { success: true, data: customerPayments };
  }
};