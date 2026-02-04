import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  forgotPasswordEmail: string | null; // Store email for forgot password flow
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  forgotPasswordEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: User;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      
      // Store tokens and user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", action.payload.accessToken);
        localStorage.setItem("refresh_token", action.payload.refreshToken);
        if (action.payload.user) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload;
    },
    clearForgotPasswordEmail: (state) => {
      state.forgotPasswordEmail = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.forgotPasswordEmail = null;
      
      // Clear tokens from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    },
    initializeAuth: (state) => {
      // Initialize auth state from localStorage
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        const userStr = localStorage.getItem("user");
        
        if (accessToken && refreshToken) {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          
          if (userStr) {
            try {
              state.user = JSON.parse(userStr);
            } catch (e) {
              console.error("Failed to parse user from localStorage");
            }
          }
        }
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  setForgotPasswordEmail,
  clearForgotPasswordEmail,
  logout,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
