import axiosInstance from "./axiosInstance";

export interface DashboardStats {
  totalUsers: number;
  totalUsersChange: number;
  activeSubscribers: number;
  activeSubscribersChange: number;
  totalVideos: number;
  totalVideosChange: number;
  monthlyRevenue: number;
  monthlyRevenueChange: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface VideoUploadData {
  month: string;
  uploads: number;
}

export interface SubscriptionDistribution {
  plan: string;
  count: number;
}

export interface QuickAction {
  id: string;
  type: "flagged_videos" | "ai_failures" | "support_tickets" | "failed_payments";
  title: string;
  count: number;
  action: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get("/dashboard/stats");
    return response.data;
  },

  getUserGrowth: async (period: string): Promise<UserGrowthData[]> => {
    const response = await axiosInstance.get("/dashboard/user-growth", { params: { period } });
    return response.data;
  },

  getVideoUploads: async (period: string): Promise<VideoUploadData[]> => {
    const response = await axiosInstance.get("/dashboard/video-uploads", { params: { period } });
    return response.data;
  },

  getSubscriptionDistribution: async (): Promise<SubscriptionDistribution[]> => {
    const response = await axiosInstance.get("/dashboard/subscription-distribution");
    return response.data;
  },

  getQuickActions: async (): Promise<QuickAction[]> => {
    const response = await axiosInstance.get("/dashboard/quick-actions");
    return response.data;
  },
};
