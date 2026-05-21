import axiosClient from './axios';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  profileImage?: string;
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  profileImage?: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const res = await axiosClient.get<UserProfile>('/api/users/profile');
  return res.data;
};

export const updateProfile = async (data: ProfileUpdatePayload) => {
  const res = await axiosClient.put('/api/users/profile', data);
  return res.data;
};

export const updateProfileImage = async (profileImage: string) => {
  const res = await axiosClient.patch('/api/users/profile/avatar', { profileImage });
  return res.data;
};

export const getUsers = async () => {
  const response = await axiosClient.get('/api/users');
  return response.data;
};

export const updateUser = async (id: string, data: { role?: string; status?: string }) => {
  const response = await axiosClient.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosClient.delete(`/api/users/${id}`);
  return response.data;
};

export const checkSavedStatus = async (businessId: string) => {
  const response = await axiosClient.get(`/api/users/saved-status/${businessId}`);
  return response.data;
};

export const saveBusiness = async (businessId: string) => {
  const response = await axiosClient.post(`/api/users/saved/${businessId}`);
  return response.data;
};

export const unsaveBusiness = async (businessId: string) => {
  const response = await axiosClient.delete(`/api/users/saved/${businessId}`);
  return response.data;
};

export const getSavedBusinesses = async () => {
  const response = await axiosClient.get(`/api/users/saved`);
  return response.data;
};
