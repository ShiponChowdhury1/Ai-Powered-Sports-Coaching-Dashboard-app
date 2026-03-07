import { baseApi } from "./baseApi";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  plan: {
    id: number;
    name: string;
    price: number;
    plan_type: string;
    billing_cycle: string;
    start_date: string | null;
    end_date: string | null;
  } | null;
  role: string;
  approved_claims_count: number;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
  goals: string[];
  skill_level: string | null;
  sport: string | null;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiUser[], { search?: string }>({
      query: (params) => ({
        url: "/accounts/users/",
        params: params?.search ? { search: params.search } : undefined,
      }),
      providesTags: ["User"],
    }),

    getUser: builder.query<ApiUser, number>({
      query: (userId) => `/accounts/users/${userId}/`,
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<ApiUser, { userId: number; data: Partial<ApiUser> }>({
      query: ({ userId, data }) => ({
        url: `/accounts/users/${userId}/update/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `/accounts/users/${userId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
