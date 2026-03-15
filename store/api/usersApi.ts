import { baseApi } from "./baseApi";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  plan?: {
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

type UsersApiResponse =
  | ApiUser[]
  | {
      results?: ApiUser[];
      data?: ApiUser[];
      users?: ApiUser[];
      items?: ApiUser[];
      payload?: {
        results?: ApiUser[];
        data?: ApiUser[];
        users?: ApiUser[];
        items?: ApiUser[];
      };
    };

const extractUsersArray = (response: UsersApiResponse): ApiUser[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.items)) return response.items;

  const payload = response?.payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;

  return [];
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiUser[], { search?: string }>({
      query: (params) => ({
        url: "/dashboard/users/",
        params: params?.search ? { search: params.search } : undefined,
      }),
      transformResponse: (response: UsersApiResponse): ApiUser[] => {
        const users = extractUsersArray(response);
        if (users.length === 0) {
          console.warn("Unexpected users API response shape", response);
        }
        return users;
      },
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
