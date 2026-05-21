import axiosClient from './axios';

export interface ReviewAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface Review {
  _id: string;
  business: string;
  reviewer: ReviewAuthor;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewApi = {
  getReviews: async (businessId: string): Promise<Review[]> => {
    const res = await axiosClient.get<Review[]>(`/api/reviews/business/${businessId}`);
    return res.data;
  },

  postReview: async (businessId: string, data: { rating: number; comment: string }): Promise<Review> => {
    const res = await axiosClient.post<Review>(`/api/reviews/business/${businessId}`, data);
    return res.data;
  },

  deleteReview: async (reviewId: string): Promise<{ message: string }> => {
    const res = await axiosClient.delete<{ message: string }>(`/api/reviews/${reviewId}`);
    return res.data;
  },
};
