import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  DashboardStats, 
  UserGrowthData, 
  VideoUploadData, 
  SubscriptionDistribution, 
  QuickAction,
  dashboardApi 
} from "@/api/dashboard.api";

interface DashboardState {
  stats: DashboardStats | null;
  userGrowth: UserGrowthData[];
  videoUploads: VideoUploadData[];
  subscriptionDistribution: SubscriptionDistribution[];
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  userGrowth: [],
  videoUploads: [],
  subscriptionDistribution: [],
  quickActions: [],
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

export const fetchUserGrowth = createAsyncThunk(
  "dashboard/fetchUserGrowth",
  async (period: string, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getUserGrowth(period);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user growth");
    }
  }
);

export const fetchVideoUploads = createAsyncThunk(
  "dashboard/fetchVideoUploads",
  async (period: string, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getVideoUploads(period);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch video uploads");
    }
  }
);

export const fetchSubscriptionDistribution = createAsyncThunk(
  "dashboard/fetchSubscriptionDistribution",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getSubscriptionDistribution();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subscription distribution");
    }
  }
);

export const fetchQuickActions = createAsyncThunk(
  "dashboard/fetchQuickActions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getQuickActions();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch quick actions");
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
      .addCase(fetchUserGrowth.fulfilled, (state, action) => {
        state.userGrowth = action.payload;
      })
      .addCase(fetchVideoUploads.fulfilled, (state, action) => {
        state.videoUploads = action.payload;
      })
      .addCase(fetchSubscriptionDistribution.fulfilled, (state, action) => {
        state.subscriptionDistribution = action.payload;
      })
      .addCase(fetchQuickActions.fulfilled, (state, action) => {
        state.quickActions = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
