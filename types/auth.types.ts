// Auth API Request Types
export interface SignupStep1Request {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

export interface SignupStep2Request {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  access_token: string;
}

// Forgot Password Types
export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  otp?: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    image: string;
    phone: string;
    plan: string | null;
    role: string;
    approved_claims_count: number;
    is_active: boolean;
    date_joined: string;
    last_login: string;
  };
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Auth API Response Types  
export interface SignupStep1Response {
  message: string;
  errors?: {
    email?: string[];
    phone?: string[];
    password?: string[];
    name?: string[];
  };
}

export interface SignupStep2Response {
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user?: {
    email: string;
    name: string;
    role: string;
  };
}

// User Type
export interface User {
  email: string;
  name: string;
  role: string;
}

// API Error Type
export interface ApiError {
  data: {
    errors?: Record<string, string[]>;
    message?: string;
  };
  status: number;
}
