import axiosInstance from "./axiosInstance";

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  respondedBy: string;
  createdAt: string;
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
}

export const supportApi = {
  getTickets: async (filters?: Record<string, unknown>): Promise<TicketsResponse> => {
    const response = await axiosInstance.get("/support/tickets", { params: filters });
    return response.data;
  },

  getTicketById: async (id: string): Promise<SupportTicket & { responses: TicketResponse[] }> => {
    const response = await axiosInstance.get(`/support/tickets/${id}`);
    return response.data;
  },

  respondToTicket: async (id: string, message: string): Promise<TicketResponse> => {
    const response = await axiosInstance.post(`/support/tickets/${id}/respond`, { message });
    return response.data;
  },

  updateTicketStatus: async (id: string, status: string): Promise<SupportTicket> => {
    const response = await axiosInstance.patch(`/support/tickets/${id}/status`, { status });
    return response.data;
  },

  assignTicket: async (id: string, assigneeId: string): Promise<SupportTicket> => {
    const response = await axiosInstance.patch(`/support/tickets/${id}/assign`, { assigneeId });
    return response.data;
  },
};
