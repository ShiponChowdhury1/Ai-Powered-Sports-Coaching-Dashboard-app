import axiosInstance from "./axiosInstance";

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  type: "Video" | "Article" | "Exercise";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  thumbnail?: string;
  views: number;
  likes: number;
  status: "Published" | "Draft" | "Archived";
  createdAt: string;
  updatedAt: string;
}

export interface TrainingContentResponse {
  content: TrainingContent[];
  total: number;
  page: number;
  limit: number;
}

export const trainingApi = {
  getContent: async (filters?: Record<string, unknown>): Promise<TrainingContentResponse> => {
    const response = await axiosInstance.get("/training", { params: filters });
    return response.data;
  },

  getContentById: async (id: string): Promise<TrainingContent> => {
    const response = await axiosInstance.get(`/training/${id}`);
    return response.data;
  },

  createContent: async (data: Partial<TrainingContent>): Promise<TrainingContent> => {
    const response = await axiosInstance.post("/training", data);
    return response.data;
  },

  updateContent: async (id: string, data: Partial<TrainingContent>): Promise<TrainingContent> => {
    const response = await axiosInstance.put(`/training/${id}`, data);
    return response.data;
  },

  deleteContent: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/training/${id}`);
  },

  publishContent: async (id: string): Promise<TrainingContent> => {
    const response = await axiosInstance.patch(`/training/${id}/publish`);
    return response.data;
  },
};
