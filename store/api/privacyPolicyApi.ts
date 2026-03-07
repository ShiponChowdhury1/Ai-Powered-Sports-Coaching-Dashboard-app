import { baseApi } from "./baseApi";
import type { 
  PrivacyPolicy, 
  TermsConditions, 
  UpdateContentPageRequest, 
  UpdateContentPageResponse 
} from "@/types/privacy-policy.types";

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get privacy policy
    getPrivacyPolicy: builder.query<PrivacyPolicy, void>({
      query: () => ({
        url: "/content/admin/privacy-policy/update/",
        method: "GET",
      }),
      providesTags: ["PrivacyPolicy"],
    }),

    // Update privacy policy
    updatePrivacyPolicy: builder.mutation<UpdateContentPageResponse, UpdateContentPageRequest>({
      query: (data) => ({
        url: "/content/admin/privacy-policy/update/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),

    // Get terms & conditions
    getTermsConditions: builder.query<TermsConditions, void>({
      query: () => ({
        url: "/content/admin/terms-conditions/update/",
        method: "GET",
      }),
      providesTags: ["TermsConditions"],
    }),

    // Update terms & conditions
    updateTermsConditions: builder.mutation<UpdateContentPageResponse, UpdateContentPageRequest>({
      query: (data) => ({
        url: "/content/admin/terms-conditions/update/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TermsConditions"],
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsConditionsQuery,
  useUpdateTermsConditionsMutation,
} = contentApi;
