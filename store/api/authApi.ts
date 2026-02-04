import { baseApi } from "./baseApi";
import type {
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/accounts/login/",
        method: "POST",
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }),
    }),

    // Google Login
    googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
      query: (data) => ({
        url: "/accounts/login/google/",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }),
    }),

    // Step 1: Send OTP for forgot password
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (data) => ({
        url: "/accounts/send-otp/",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }),
    }),

    // Step 2: Verify OTP for forgot password
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/accounts/verify-otp/",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }),
    }),

    // Step 3: Reset password
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/accounts/forget-password/",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }),
    }),

    // Change Password
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "/accounts/change-password/",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
