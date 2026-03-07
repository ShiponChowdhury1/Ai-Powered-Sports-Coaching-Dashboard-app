import { baseApi } from "./baseApi";

export interface SubscriptionPlan {
  id: number;
  name: string;
  plan_type: string;
  description: string;
  price: string;
  billing_cycle: string;
  features: Record<string, unknown>;
  max_users: number;
  max_storage_gb: number;
  is_active: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  cancelled_subscriptions: number;
  total_revenue: number;
  monthly_revenue: number;
  by_plan: Record<string, number>;
}

export interface UserSubscription {
  id: number;
  user: number;
  plan: number;
  plan_name: string;
  plan_type: string;
  plan_price: string;
  billing_cycle: string;
  status: string;
  start_date: string;
  end_date: string | null;
  is_auto_renew: boolean;
  next_billing_date: string | null;
  last_payment_date: string | null;
  cancelled_at: string | null;
  cancellation_reason: string;
  created_at: string;
  updated_at: string;
}

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => "/subscriptions/plans/",
      providesTags: ["Subscription"],
    }),

    getSubscriptionStats: builder.query<SubscriptionStats, void>({
      query: () => "/subscriptions/admin/stats/",
      providesTags: ["Subscription"],
    }),

    getAllSubscriptions: builder.query<UserSubscription[], void>({
      query: () => "/subscriptions/admin/all/",
      providesTags: ["Subscription"],
    }),

    createPlan: builder.mutation<SubscriptionPlan, Partial<SubscriptionPlan>>({
      query: (data) => ({
        url: "/subscriptions/admin/plans/create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updatePlan: builder.mutation<SubscriptionPlan, { planId: number; data: Partial<SubscriptionPlan> }>({
      query: ({ planId, data }) => ({
        url: `/subscriptions/admin/plans/${planId}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    deletePlan: builder.mutation<void, number>({
      query: (planId) => ({
        url: `/subscriptions/admin/plans/${planId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionStatsQuery,
  useGetAllSubscriptionsQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = subscriptionsApi;
