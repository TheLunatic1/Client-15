import axiosClient from './axios';

export const getBlogs = async () => {
  const response = await axiosClient.get('/api/blogs');
  return response.data;
};

export const getBlogById = async (id: string) => {
  const response = await axiosClient.get(`/api/blogs/${id}`);
  return response.data;
};

export const createBlog = async (blog: any) => {
  const response = await axiosClient.post('/api/blogs', blog);
  return response.data;
};

export const updateBlog = async (id: string, blog: any) => {
  const response = await axiosClient.put(`/api/blogs/${id}`, blog);
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await axiosClient.delete(`/api/blogs/${id}`);
  return response.data;
};
