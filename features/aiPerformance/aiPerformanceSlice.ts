import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AIPerformanceMetrics, AIFailure, aiPerformanceApi } from "@/api/aiPerformance.api";

interface AIPerformanceState {
  metrics: AIPerformanceMetrics | null;
  failures: AIFailure[];
  total: number;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

const initialState: AIPerformanceState = {
  metrics: null,
  failures: [],
  total: 0,
  loading: false,
  error: null,
  actionLoading: false,
};

export const fetchAIMetrics = createAsyncThunk(
  "aiPerformance/fetchMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiPerformanceApi.getMetrics();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch AI metrics");
    }
  }
);

export const fetchAIFailures = createAsyncThunk(
  "aiPerformance/fetchFailures",
  async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await aiPerformanceApi.getFailures(filters);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch AI failures");
    }
  }
);

export const retryAnalysis = createAsyncThunk(
  "aiPerformance/retryAnalysis",
  async (videoId: string, { rejectWithValue }) => {
    try {
      await aiPerformanceApi.retryAnalysis(videoId);
      return videoId;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to retry analysis");
    }
  }
);

export const resolveFailure = createAsyncThunk(
  "aiPerformance/resolveFailure",
  async (failureId: string, { rejectWithValue }) => {
    try {
      const response = await aiPerformanceApi.resolveFailure(failureId);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to resolve failure");
    }
  }
);

const aiPerformanceSlice = createSlice({
  name: "aiPerformance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchAIMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAIFailures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIFailures.fulfilled, (state, action) => {
        state.loading = false;
        state.failures = action.payload.failures;
        state.total = action.payload.total;
      })
      .addCase(fetchAIFailures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resolveFailure.fulfilled, (state, action) => {
        const index = state.failures.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.failures[index] = action.payload;
        }
      });
  },
});

export const { clearError } = aiPerformanceSlice.actions;
export default aiPerformanceSlice.reducer;
