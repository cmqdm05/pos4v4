import { api } from '../api';

export interface Notification {
  _id: string;
  recipient: string;
  recipientModel: 'User' | 'Staff';
  message: string;
  type: 'system' | 'alert' | 'info';
  read: boolean;
  store?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  message: string;
  type?: 'system' | 'alert' | 'info';
  store?: string;
  recipientId?: string;
  recipientModel?: 'User' | 'Staff';
}

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => 'notifications',
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
    createSystemNotification: builder.mutation<Notification, CreateNotificationRequest>({
      query: (data) => ({
        url: 'notifications/system',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useCreateSystemNotificationMutation,
} = notificationApi;