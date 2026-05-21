import axiosClient from './axios';

export interface NotificationSender {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface NotificationItem {
  _id: string;
  recipient: string;
  sender?: NotificationSender;
  type: 'business_pending' | 'business_approved' | 'business_rejected' | 'business_deleted' | 'general';
  title: string;
  message: string;
  rejectionReason?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await axiosClient.get<NotificationItem[]>('/api/notifications');
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosClient.get<{ count: number }>('/api/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await axiosClient.patch<NotificationItem>(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await axiosClient.patch<{ message: string }>('/api/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete<{ message: string }>(`/api/notifications/${id}`);
    return response.data;
  },
};
