import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Subscription, Payment, subscriptionsApi } from "@/api/subscriptions.api";

interface SubscriptionsState {
  subscriptions: Subscription[];
  payments: Payment[];
  selectedSubscription: Subscription | null;
  total: number;
  page: number;
  limit: number;
  filters: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  payments: [],
  selectedSubscription: null,
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
  loading: false,
  error: null,
  actionLoading: false,
};

export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.getSubscriptions(filters);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subscriptions");
    }
  }
);

export const fetchPayments = createAsyncThunk(
  "subscriptions/fetchPayments",
  async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.getPayments(filters);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payments");
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "subscriptions/cancelSubscription",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.cancelSubscription(id);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to cancel subscription");
    }
  }
);

export const refundPayment = createAsyncThunk(
  "subscriptions/refundPayment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.refundPayment(id);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to refund payment");
    }
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.selectedSubscription = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.subscriptions;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      });
  },
});

export const { setFilters, clearFilters, setSelectedSubscription, clearError } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
