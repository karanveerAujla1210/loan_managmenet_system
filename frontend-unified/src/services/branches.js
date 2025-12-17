import axiosInstance from '../utils/axiosInstance';

export const getBranches = async () => {
  try {
    const response = await axiosInstance.get('/branches');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch branches:', error);
    return [];
  }
};

export const getBranchById = async (branchId) => {
  try {
    const response = await axiosInstance.get(`/branches/${branchId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch branch:', error);
    return null;
  }
};
