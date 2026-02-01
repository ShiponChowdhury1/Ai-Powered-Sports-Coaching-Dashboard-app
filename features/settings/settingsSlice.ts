import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Settings, settingsApi } from "@/api/settings.api";

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
  saveLoading: false,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsApi.getSettings();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch settings");
    }
  }
);

export const updateGeneralSettings = createAsyncThunk(
  "settings/updateGeneral",
  async (data: Settings["general"], { rejectWithValue }) => {
    try {
      const response = await settingsApi.updateGeneralSettings(data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update general settings");
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  "settings/updateNotifications",
  async (data: Settings["notifications"], { rejectWithValue }) => {
    try {
      const response = await settingsApi.updateNotificationSettings(data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update notification settings");
    }
  }
);

export const updateSecuritySettings = createAsyncThunk(
  "settings/updateSecurity",
  async (data: Settings["security"], { rejectWithValue }) => {
    try {
      const response = await settingsApi.updateSecuritySettings(data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update security settings");
    }
  }
);

export const updateIntegrationSettings = createAsyncThunk(
  "settings/updateIntegrations",
  async (data: Settings["integrations"], { rejectWithValue }) => {
    try {
      const response = await settingsApi.updateIntegrationSettings(data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update integration settings");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGeneralSettings.pending, (state) => {
        state.saveLoading = true;
      })
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.saveLoading = false;
        if (state.settings) {
          state.settings.general = action.payload;
        }
      })
      .addCase(updateGeneralSettings.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        if (state.settings) {
          state.settings.notifications = action.payload;
        }
      })
      .addCase(updateSecuritySettings.fulfilled, (state, action) => {
        if (state.settings) {
          state.settings.security = action.payload;
        }
      })
      .addCase(updateIntegrationSettings.fulfilled, (state, action) => {
        if (state.settings) {
          state.settings.integrations = action.payload;
        }
      });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
