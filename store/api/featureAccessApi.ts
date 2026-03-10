import { baseApi } from "./baseApi";

export interface FeatureAccessPlan {
  id: number;
  name: string;
  price: string;
  billing_cycle: string;
}

export interface FeatureRow {
  id: number;
  name: string;
  description: string;
  values: Record<string, string | boolean>;
}

export interface FeatureAccessResponse {
  plans: FeatureAccessPlan[];
  features: FeatureRow[];
}

export const featureAccessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatureAccess: builder.query<FeatureAccessResponse, void>({
      query: () => `/subscriptions/feature-access/`,
      providesTags: ["FeatureAccess"],
    }),
    updateFeatureAccess: builder.mutation<void, { featureId: number; planId: number; value: string | boolean }>({
      query: ({ featureId, planId, value }) => ({
        url: `/subscriptions/feature-access/${featureId}/`,
        method: "PATCH",
        body: { plan_id: planId, value },
      }),
      invalidatesTags: ["FeatureAccess"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFeatureAccessQuery,
  useUpdateFeatureAccessMutation,
} = featureAccessApi;
