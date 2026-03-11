import { baseApi } from "./baseApi";
import { SubscribersResponse, SubscribersListParams } from "@/types/subscribers.types";

export const subscribersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<SubscribersResponse, SubscribersListParams>({
      query: ({ page = 1, search = "" }) => {
        const params: Record<string, string | number> = { page };
        if (search) {
          params.search = search;
        }
        return {
          url: `/subscribers/list/`,
          params,
        };
      },
      providesTags: ["Subscribers"],
    }),
    deleteSubscriber: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subscribers/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscribers"],
    }),
    toggleSubscriberStatus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subscribers/${id}/toggle-status/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subscribers"],
    }),
    sendMessage: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `/subscribers/send-message/`,
        method: "POST",
        body: formData,
      }),
    }),
    sendPromotion: builder.mutation<{ message: string }, { id: number; subject: string; message: string; html_message?: string }>({
      query: ({ id, subject, message, html_message }) => ({
        url: `/subscribers/${id}/send-promotion/`,
        method: "POST",
        body: { subject, message, html_message },
      }),
    }),
    bulkSendPromotion: builder.mutation<
      { message: string; total_targeted: number; sent_successfully: number; failed_count: number; failed_emails: string[] },
      { subscriber_ids: number[]; subject: string; message: string; html_message?: string }
    >({
      query: (body) => ({
        url: `/subscribers/bulk-send-promotion/`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSubscribersQuery,
  useDeleteSubscriberMutation,
  useToggleSubscriberStatusMutation,
  useSendMessageMutation,
  useSendPromotionMutation,
  useBulkSendPromotionMutation,
} = subscribersApi;
