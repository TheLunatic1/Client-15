import axiosClient from './axios';

export const getCategories = async () => {
  const response = await axiosClient.get('/api/categories');
  return response.data;
};

export const createCategory = async (category: { name: string; slug?: string }) => {
  const response = await axiosClient.post('/api/categories', category);
  return response.data;
};

export const updateCategory = async (id: string, category: { name: string; slug?: string }) => {
  const response = await axiosClient.put(`/api/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await axiosClient.delete(`/api/categories/${id}`);
  return response.data;
};
