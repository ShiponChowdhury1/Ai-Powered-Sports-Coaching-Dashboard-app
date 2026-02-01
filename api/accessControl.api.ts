import axiosInstance from "./axiosInstance";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const accessControlApi = {
  getRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get("/roles");
    return response.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: Partial<Role>): Promise<Role> => {
    const response = await axiosInstance.post("/roles", data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<Role>): Promise<Role> => {
    const response = await axiosInstance.put(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },

  getPermissions: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get("/permissions");
    return response.data;
  },

  assignRole: async (userId: string, roleId: string): Promise<void> => {
    await axiosInstance.post(`/users/${userId}/roles`, { roleId });
  },
};
