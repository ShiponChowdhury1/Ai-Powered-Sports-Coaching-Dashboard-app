import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  if (typeof document === 'undefined') return null;
  const name = 'csrftoken';
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
  return cookieValue || null;
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include', // Important for CSRF cookies
  prepareHeaders: (headers, { getState }) => {
    // Get CSRF token from cookie
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }
    
    // Get auth token from localStorage only for protected routes
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    
    // Only set Authorization header if token exists and is valid
    if (token && token.trim() !== "" && token !== "null" && token !== "undefined") {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Auth", "User", "Dashboard", "Training", "Subscription", "Support", "Notification"],
  endpoints: () => ({}),
});
