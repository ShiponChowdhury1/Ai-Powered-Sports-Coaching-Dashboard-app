import axiosInstance from "./axiosInstance";

export interface DashboardStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  total_subscribers: number;
  active_subscribers: number;
  recent_activities: RecentActivity[];
}

export interface RecentActivity {
  id: number;
  user: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  regular_users: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ReportData {
  report_type: string;
  date_from: string;
  date_to: string;
  data: Record<string, unknown>;
  generated_at: string;
  generated_by: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get("/dashboard/stats/");
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await axiosInstance.get("/dashboard/stats/users/");
    return response.data;
  },

  getUserRegistrationChart: async (days: number = 30): Promise<ChartData> => {
    const response = await axiosInstance.get("/dashboard/stats/chart/users/", {
      params: { days },
    });
    return response.data;
  },

  getReport: async (
    reportType: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<ReportData> => {
    const response = await axiosInstance.get("/dashboard/reports/", {
      params: {
        report_type: reportType,
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      },
    });
    return response.data;
  },
};
