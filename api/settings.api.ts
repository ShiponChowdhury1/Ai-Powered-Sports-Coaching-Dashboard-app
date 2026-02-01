import axiosInstance from "./axiosInstance";

export interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    supportEmail: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
  };
  integrations: {
    stripeEnabled: boolean;
    googleAnalyticsId: string;
    slackWebhook: string;
  };
}

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const response = await axiosInstance.get("/settings");
    return response.data;
  },

  updateGeneralSettings: async (data: Settings["general"]): Promise<Settings["general"]> => {
    const response = await axiosInstance.put("/settings/general", data);
    return response.data;
  },

  updateNotificationSettings: async (data: Settings["notifications"]): Promise<Settings["notifications"]> => {
    const response = await axiosInstance.put("/settings/notifications", data);
    return response.data;
  },

  updateSecuritySettings: async (data: Settings["security"]): Promise<Settings["security"]> => {
    const response = await axiosInstance.put("/settings/security", data);
    return response.data;
  },

  updateIntegrationSettings: async (data: Settings["integrations"]): Promise<Settings["integrations"]> => {
    const response = await axiosInstance.put("/settings/integrations", data);
    return response.data;
  },
};
