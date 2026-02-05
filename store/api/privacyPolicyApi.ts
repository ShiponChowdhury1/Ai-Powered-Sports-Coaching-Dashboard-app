import { baseApi } from "./baseApi";
import type { PrivacyPolicy, TermsConditions } from "@/types/privacy-policy.types";

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

    // Get terms & conditions
    getTermsConditions: builder.query<TermsConditions, void>({
      query: () => ({
        url: "/content/admin/terms-conditions/update/",
        method: "GET",
      }),
      providesTags: ["TermsConditions"],
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useGetTermsConditionsQuery,
} = contentApi;
