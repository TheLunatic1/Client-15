import axiosClient from './axios';

export const getAdminStats = async () => {
  const res = await axiosClient.get('/api/stats/admin');
  return res.data;
};

export const getTradieStats = async () => {
  const res = await axiosClient.get('/api/stats/tradie');
  return res.data;
};
