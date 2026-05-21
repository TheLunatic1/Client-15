import axiosClient from './axios';

export const getUsers = async () => {
  const response = await axiosClient.get('/api/users');
  return response.data;
};

export const updateUser = async (id: string, data: { role?: string, status?: string }) => {
  const response = await axiosClient.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosClient.delete(`/api/users/${id}`);
  return response.data;
};

// Saved Businesses
export const checkSavedStatus = async (businessId: string) => {
  const response = await axiosClient.get(`/api/users/saved-status/${businessId}`);
  return response.data; // { isSaved: boolean }
};

export const saveBusiness = async (businessId: string) => {
  const response = await axiosClient.post(`/api/users/saved/${businessId}`);
  return response.data; // { isSaved: true }
};

export const unsaveBusiness = async (businessId: string) => {
  const response = await axiosClient.delete(`/api/users/saved/${businessId}`);
  return response.data; // { isSaved: false }
};

export const getSavedBusinesses = async () => {
  const response = await axiosClient.get(`/api/users/saved`);
  return response.data;
};
