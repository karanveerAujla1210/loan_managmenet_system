import axiosInstance from '../utils/axiosInstance';

const getKPIs = async () => {
  try {
    const response = await axiosInstance.get('/api/dashboard/kpis');
    return response.data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    throw error;
  }
};

export default { getKPIs };
