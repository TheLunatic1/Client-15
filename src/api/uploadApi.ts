import axiosClient from './axios';

/**
 * Upload a single image file to the server.
 * Returns the public URL string to store in the database.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosClient.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.url as string;
};