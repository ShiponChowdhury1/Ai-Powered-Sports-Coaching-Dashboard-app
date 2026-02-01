import axiosInstance from "./axiosInstance";

export interface User {
  id: string;
  name: string;
  email: string;
  sport: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  plan: "Free" | "Monthly" | "3-Month" | "Yearly" | "School";
  status: "Active" | "Suspended" | "Inactive";
  videos: number;
  engagement: number;
  avatar?: string;
  createdAt: string;
  lastActive: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UsersFilters {
  status?: string;
  plan?: string;
  sport?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const usersApi = {
  getUsers: async (filters?: UsersFilters): Promise<UsersResponse> => {
    const response = await axiosInstance.get("/users", { params: filters });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  suspendUser: async (id: string): Promise<User> => {
    const response = await axiosInstance.patch(`/users/${id}/suspend`);
    return response.data;
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await axiosInstance.patch(`/users/${id}/activate`);
    return response.data;
  },
};
