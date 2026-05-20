import axiosClient from './axios';

type RawLocation = any;
type LocationShape = {
  _id?: string;
  id?: string;
  city: string;
  region: string;
  createdAt?: string;
  updatedAt?: string;
};

const mapLocation = (item: RawLocation): LocationShape => ({
  _id: item._id ?? item.id,
  id: item._id ?? item.id,
  city: item.city ?? item.name ?? '',
  region: item.region ?? '',
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getLocations = async (): Promise<LocationShape[]> => {
  const response = await axiosClient.get('/api/locations');
  const data = response.data;
  if (Array.isArray(data)) return data.map(mapLocation);
  // If API returns an object with items property
  if (Array.isArray(data?.items)) return data.items.map(mapLocation);
  return [];
};

export const createLocation = async (location: { city: string; region: string }) => {
  const response = await axiosClient.post('/api/locations', location);
  return mapLocation(response.data);
};

export const updateLocation = async (id: string, location: { city: string; region: string }) => {
  const response = await axiosClient.put(`/api/locations/${id}`, location);
  return mapLocation(response.data);
};

export const deleteLocation = async (id: string) => {
  const response = await axiosClient.delete(`/api/locations/${id}`);
  return response.data;
};
