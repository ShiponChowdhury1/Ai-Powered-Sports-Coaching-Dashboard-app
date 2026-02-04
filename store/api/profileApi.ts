import { baseApi } from "./baseApi";
import type { UserProfile, UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile.types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/accounts/profile/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: "/accounts/profile/update/",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;
