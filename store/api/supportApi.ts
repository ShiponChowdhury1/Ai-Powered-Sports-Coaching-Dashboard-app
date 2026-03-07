import { baseApi } from "./baseApi";

export interface SupportTicket {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  replies_count: number;
  created_at: string;
  updated_at: string;
}

export interface TicketReply {
  id: number;
  ticket: number;
  user: number;
  user_name: string;
  user_email: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
}

export interface SupportTicketDetail extends SupportTicket {
  replies: TicketReply[];
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<SupportTicket[], { status?: string; priority?: string }>({
      query: (params) => ({
        url: "/content/admin/tickets/",
        params,
      }),
      providesTags: ["Support"],
    }),

    getTicketDetail: builder.query<SupportTicketDetail, number>({
      query: (ticketId) => `/content/admin/tickets/${ticketId}/`,
      providesTags: ["Support"],
    }),

    replyToTicket: builder.mutation<TicketReply, { ticketId: number; message: string }>({
      query: ({ ticketId, message }) => ({
        url: `/content/admin/tickets/${ticketId}/reply/`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Support"],
    }),

    updateTicketStatus: builder.mutation<SupportTicket, { ticketId: number; status: string; resolution_note?: string }>({
      query: ({ ticketId, ...body }) => ({
        url: `/content/admin/tickets/${ticketId}/status/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketDetailQuery,
  useReplyToTicketMutation,
  useUpdateTicketStatusMutation,
} = supportApi;
