import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SupportTicket, supportApi } from "@/api/support.api";

interface SupportState {
  tickets: SupportTicket[];
  selectedTicket: (SupportTicket & { responses: { id: string; ticketId: string; message: string; respondedBy: string; createdAt: string }[] }) | null;
  total: number;
  page: number;
  limit: number;
  filters: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

const initialState: SupportState = {
  tickets: [],
  selectedTicket: null,
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
  loading: false,
  error: null,
  actionLoading: false,
};

export const fetchTickets = createAsyncThunk(
  "support/fetchTickets",
  async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await supportApi.getTickets(filters);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tickets");
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  "support/fetchTicketById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await supportApi.getTicketById(id);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch ticket");
    }
  }
);

export const respondToTicket = createAsyncThunk(
  "support/respondToTicket",
  async ({ id, message }: { id: string; message: string }, { rejectWithValue }) => {
    try {
      const response = await supportApi.respondToTicket(id, message);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to respond to ticket");
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "support/updateTicketStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await supportApi.updateTicketStatus(id, status);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update ticket status");
    }
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedTicket: (state, action: PayloadAction<SupportState["selectedTicket"]>) => {
      state.selectedTicket = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      .addCase(respondToTicket.fulfilled, (state, action) => {
        if (state.selectedTicket) {
          state.selectedTicket.responses.push(action.payload);
        }
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.selectedTicket && state.selectedTicket.id === action.payload.id) {
          state.selectedTicket = { ...state.selectedTicket, ...action.payload };
        }
      });
  },
});

export const { setFilters, clearFilters, setSelectedTicket, clearError } = supportSlice.actions;
export default supportSlice.reducer;
