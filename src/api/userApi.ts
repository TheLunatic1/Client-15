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
