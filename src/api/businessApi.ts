import axiosClient from './axios';

// ── Public ──────────────────────────────────────────────────────
export const getApprovedBusinesses = async () => {
  const res = await axiosClient.get('/api/businesses');
  return res.data;
};

export const getBusinessById = async (id: string) => {
  const res = await axiosClient.get(`/api/businesses/${id}`);
  return res.data;
};

export const getBusinessesByFilter = async (params: {
  category?: string;
  location?: string;
  search?: string;
}) => {
  const res = await axiosClient.get('/api/businesses', { params });
  return res.data;
};

// ── Tradie ───────────────────────────────────────────────────────
export const getMyListings = async () => {
  const res = await axiosClient.get('/api/businesses/my/listings');
  return res.data;
};

export const createBusiness = async (data: any) => {
  const res = await axiosClient.post('/api/businesses', data);
  return res.data;
};

export const updateBusiness = async (id: string, data: any) => {
  const res = await axiosClient.put(`/api/businesses/${id}`, data);
  return res.data;
};

export const deleteBusiness = async (id: string) => {
  const res = await axiosClient.delete(`/api/businesses/${id}`);
  return res.data;
};

// ── Admin ────────────────────────────────────────────────────────
export const getAdminAllBusinesses = async (status?: 'pending' | 'approved' | 'rejected') => {
  const params = status ? { status } : {};
  const res = await axiosClient.get('/api/businesses/admin/all', { params });
  return res.data;
};

export const updateBusinessStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected' | 'pending_delete',
  rejectionReason?: string
) => {
  const body: { status: string; rejectionReason?: string } = { status };
  if (rejectionReason?.trim()) {
    body.rejectionReason = rejectionReason.trim();
  }
  const res = await axiosClient.patch(`/api/businesses/${id}/status`, body);
  return res.data;
};

export const adminDeleteBusiness = async (id: string) => {
  const res = await axiosClient.delete(`/api/businesses/${id}`);
  return res.data;
};

// ── Gallery ──────────────────────────────────────────────────────
export const addGalleryImage = async (
  businessId: string,
  data: { url: string; title?: string }
) => {
  const res = await axiosClient.post(`/api/businesses/${businessId}/gallery`, data);
  return res.data;
};

export const removeGalleryImage = async (businessId: string, imageId: string) => {
  const res = await axiosClient.delete(`/api/businesses/${businessId}/gallery/${imageId}`);
  return res.data;
};
