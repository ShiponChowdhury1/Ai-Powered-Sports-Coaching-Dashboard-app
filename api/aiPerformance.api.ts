import axiosInstance from "./axiosInstance";

export interface AIPerformanceMetrics {
  totalAnalyses: number;
  successRate: number;
  avgProcessingTime: number;
  failedAnalyses: number;
}

export interface AIFailure {
  id: string;
  videoId: string;
  videoTitle: string;
  errorType: string;
  errorMessage: string;
  timestamp: string;
  resolved: boolean;
}

export const aiPerformanceApi = {
  getMetrics: async (): Promise<AIPerformanceMetrics> => {
    const response = await axiosInstance.get("/ai/metrics");
    return response.data;
  },

  getFailures: async (filters?: Record<string, unknown>): Promise<{ failures: AIFailure[]; total: number }> => {
    const response = await axiosInstance.get("/ai/failures", { params: filters });
    return response.data;
  },

  retryAnalysis: async (videoId: string): Promise<void> => {
    await axiosInstance.post(`/ai/retry/${videoId}`);
  },

  resolveFailure: async (failureId: string): Promise<AIFailure> => {
    const response = await axiosInstance.patch(`/ai/failures/${failureId}/resolve`);
    return response.data;
  },
};
