import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  DashboardStats,
  ChartData,
  dashboardApi,
} from "@/api/dashboard.api";

interface DashboardState {
  stats: DashboardStats | null;
  userRegistrationChart: ChartData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  userRegistrationChart: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getStats();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);

export const fetchUserRegistrationChart = createAsyncThunk(
  "dashboard/fetchUserRegistrationChart",
  async (days: number = 30, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getUserRegistrationChart(days);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chart data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserRegistrationChart.fulfilled, (state, action) => {
        state.userRegistrationChart = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
