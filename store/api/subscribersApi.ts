import { baseApi } from "./baseApi";
import { SubscribersResponse, SubscribersListParams } from "@/types/subscribers.types";

export const subscribersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<SubscribersResponse, SubscribersListParams>({
      query: ({ page = 1, search = "" }) => {
        const params: any = { page };
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
  }),
  overrideExisting: true,
});

export const {
  useGetSubscribersQuery,
  useDeleteSubscriberMutation,
  useToggleSubscriberStatusMutation,
} = subscribersApi;
