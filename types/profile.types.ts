// Profile Types
export interface UserProfile {
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
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  image?: File;
}

export interface UpdateProfileResponse {
  message: string;
  data: UserProfile;
}
