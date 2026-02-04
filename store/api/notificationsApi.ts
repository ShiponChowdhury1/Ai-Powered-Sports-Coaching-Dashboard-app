import { baseApi } from "./baseApi";
import type { Notification } from "@/types/notifications.types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications
    getNotifications: builder.query<Notification[], { unreadOnly?: boolean }>({
      query: ({ unreadOnly = true }) => ({
        url: `/notifications/${unreadOnly ? "?unread_only=true" : ""}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}/mark-as-read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: `/notifications/mark-all-as-read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
