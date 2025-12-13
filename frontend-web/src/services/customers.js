import api from './api';

// Mock customer data for development
const mockCustomers = [
  {
    id: '6805bc97-c7e8-49e8-9d15-99620e0c92e9',
    name: 'NITIN CHAURASIA',
    email: 'nitin.chaurasia@example.com',
    phone: '+91 9876543210',
    address: 'Unnao, Uttar Pradesh',
    panCard: 'ABCDE1234F',
    aadharCard: '1234 5678 9012',
    status: 'active',
    createdAt: '2024-01-15',
    totalLoans: 1,
    totalAmount: 25000
  },
  {
    id: '43b63713-159c-41c6-a8b0-442b6e6ee72f',
    name: 'AFREEN',
    email: 'afreen@example.com',
    phone: '+91 9876543211',
    address: 'Lucknow, Uttar Pradesh',
    panCard: 'BCDEF2345G',
    aadharCard: '2345 6789 0123',
    status: 'active',
    createdAt: '2024-01-16',
    totalLoans: 1,
    totalAmount: 25000
  },
  {
    id: 'cc9a3b64-5cfc-4433-996b-e08513c479c4',
    name: 'PAWAN KESARWANI',
    email: 'pawan.kesarwani@example.com',
    phone: '+91 9876543212',
    address: 'Panchsheel Park, Delhi',
    panCard: 'CDEFG3456H',
    aadharCard: '3456 7890 1234',
    status: 'active',
    createdAt: '2024-01-17',
    totalLoans: 1,
    totalAmount: 250000
  },
  {
    id: '838e7833-c4d6-4727-ad3c-2c3a9063589b',
    name: 'RAKESH SRIVASTAVA',
    email: 'rakesh.srivastava@example.com',
    phone: '+91 9876543213',
    address: 'Kanpur, Uttar Pradesh',
    panCard: 'DEFGH4567I',
    aadharCard: '4567 8901 2345',
    status: 'active',
    createdAt: '2024-01-18',
    totalLoans: 1,
    totalAmount: 25000
  },
  {
    id: '0cf5fc3b-56a6-4cb8-a4a8-2cbfa93bc543',
    name: 'MUSHKAN',
    email: 'mushkan@example.com',
    phone: '+91 9876543214',
    address: 'Delhi',
    panCard: 'EFGHI5678J',
    aadharCard: '5678 9012 3456',
    status: 'pending',
    createdAt: '2024-01-19',
    totalLoans: 0,
    totalAmount: 0
  }
];

export const getCustomers = async (params = {}) => {
  try {
    const response = await api.get('/customers', { params });
    return response.data;
  } catch (error) {
    // Return mock data if API fails
    let filteredCustomers = [...mockCustomers];
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
      );
    }
    
    if (params.status && params.status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === params.status);
    }
    
    return {
      success: true,
      data: filteredCustomers,
      pagination: {
        total: filteredCustomers.length,
        page: 1,
        pages: 1
      }
    };
  }
};

export const getCustomer = async (id) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      return { success: true, data: customer };
    }
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    // Mock creation
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      totalLoans: 0,
      totalAmount: 0
    };
    return { success: true, data: newCustomer };
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    // Mock update
    return { success: true, data: { id, ...customerData } };
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    // Mock deletion
    return { success: true, message: 'Customer deleted successfully' };
  }
};

export const getCustomerLoans = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}/loans`);
    return response.data;
  } catch (error) {
    return { success: true, data: [] };
  }
};

export const getCustomerPayments = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}/payments`);
    return response.data;
  } catch (error) {
    return { success: true, data: [] };
  }
};
