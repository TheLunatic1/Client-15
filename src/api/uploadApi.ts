import axiosClient from './axios';
import { compressImage } from '../utils/imageCompression';

/**
 * Upload a single image file to the server.
 * Returns the public URL string to store in the database.
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Compress image to ensure it is under 0.8MB to avoid Nginx 1MB default payload limit
  const compressedFile = await compressImage(file, 0.8);

  const formData = new FormData();
  formData.append('image', compressedFile);

  const response = await axiosClient.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.url as string;
};