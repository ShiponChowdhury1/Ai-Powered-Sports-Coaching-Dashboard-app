import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TrainingContent, trainingApi } from "@/api/training.api";

interface TrainingState {
  content: TrainingContent[];
  selectedContent: TrainingContent | null;
  total: number;
  page: number;
  limit: number;
  filters: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

const initialState: TrainingState = {
  content: [],
  selectedContent: null,
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
  loading: false,
  error: null,
  actionLoading: false,
};

export const fetchTrainingContent = createAsyncThunk(
  "training/fetchContent",
  async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await trainingApi.getContent(filters);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch training content");
    }
  }
);

export const createTrainingContent = createAsyncThunk(
  "training/createContent",
  async (data: Partial<TrainingContent>, { rejectWithValue }) => {
    try {
      const response = await trainingApi.createContent(data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to create content");
    }
  }
);

export const updateTrainingContent = createAsyncThunk(
  "training/updateContent",
  async ({ id, data }: { id: string; data: Partial<TrainingContent> }, { rejectWithValue }) => {
    try {
      const response = await trainingApi.updateContent(id, data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update content");
    }
  }
);

export const deleteTrainingContent = createAsyncThunk(
  "training/deleteContent",
  async (id: string, { rejectWithValue }) => {
    try {
      await trainingApi.deleteContent(id);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to delete content");
    }
  }
);

export const publishTrainingContent = createAsyncThunk(
  "training/publishContent",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await trainingApi.publishContent(id);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to publish content");
    }
  }
);

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedContent: (state, action: PayloadAction<TrainingContent | null>) => {
      state.selectedContent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.content;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTrainingContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTrainingContent.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createTrainingContent.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.content.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTrainingContent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTrainingContent.fulfilled, (state, action) => {
        const index = state.content.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.content[index] = action.payload;
        }
      })
      .addCase(deleteTrainingContent.fulfilled, (state, action) => {
        state.content = state.content.filter((c) => c.id !== action.payload);
        state.total -= 1;
      })
      .addCase(publishTrainingContent.fulfilled, (state, action) => {
        const index = state.content.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.content[index] = action.payload;
        }
      });
  },
});

export const { setFilters, clearFilters, setSelectedContent, clearError } = trainingSlice.actions;
export default trainingSlice.reducer;
