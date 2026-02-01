import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Role, Permission, accessControlApi } from "@/api/accessControl.api";

interface AccessControlState {
  roles: Role[];
  permissions: Permission[];
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

const initialState: AccessControlState = {
  roles: [],
  permissions: [],
  selectedRole: null,
  loading: false,
  error: null,
  actionLoading: false,
};

export const fetchRoles = createAsyncThunk(
  "accessControl/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getRoles();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch roles");
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "accessControl/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getPermissions();
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch permissions");
    }
  }
);

export const createRole = createAsyncThunk(
  "accessControl/createRole",
  async (data: Partial<Role>, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.createRole(data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to create role");
    }
  }
);

export const updateRole = createAsyncThunk(
  "accessControl/updateRole",
  async ({ id, data }: { id: string; data: Partial<Role> }, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.updateRole(id, data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to update role");
    }
  }
);

export const deleteRole = createAsyncThunk(
  "accessControl/deleteRole",
  async (id: string, { rejectWithValue }) => {
    try {
      await accessControlApi.deleteRole(id);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Failed to delete role");
    }
  }
);

const accessControlSlice = createSlice({
  name: "accessControl",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      .addCase(createRole.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      });
  },
});

export const { setSelectedRole, clearError } = accessControlSlice.actions;
export default accessControlSlice.reducer;
