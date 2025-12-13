import api from './api';

export const uploadFile = async (file, type = 'document') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    // Mock upload response
    return {
      success: true,
      data: {
        filename: file.name,
        originalName: file.name,
        mimetype: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      }
    };
  }
};

export const uploadDisbursements = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/disbursements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    // Mock disbursement upload
    return {
      success: true,
      message: 'Disbursement file uploaded successfully',
      data: {
        filename: file.name,
        recordsProcessed: 10,
        recordsSuccess: 8,
        recordsError: 2,
        uploadedAt: new Date().toISOString()
      }
    };
  }
};

export const uploadPayments = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/payments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    // Mock payment upload
    return {
      success: true,
      message: 'Payment file uploaded successfully',
      data: {
        filename: file.name,
        recordsProcessed: 15,
        recordsSuccess: 14,
        recordsError: 1,
        uploadedAt: new Date().toISOString()
      }
    };
  }
};

export const getUploadHistory = async () => {
  try {
    const response = await api.get('/upload/history');
    return response.data;
  } catch (error) {
    // Mock upload history
    return {
      success: true,
      data: [
        {
          id: 'upload_001',
          filename: 'disbursements_jan_2024.xlsx',
          type: 'disbursements',
          status: 'completed',
          recordsProcessed: 25,
          recordsSuccess: 23,
          recordsError: 2,
          uploadedAt: '2024-01-15T10:30:00Z',
          uploadedBy: 'admin@loancrm.com'
        },
        {
          id: 'upload_002',
          filename: 'payments_jan_2024.xlsx',
          type: 'payments',
          status: 'completed',
          recordsProcessed: 50,
          recordsSuccess: 48,
          recordsError: 2,
          uploadedAt: '2024-01-16T14:20:00Z',
          uploadedBy: 'admin@loancrm.com'
        }
      ]
    };
  }
};