import axiosInstance from "./axiosInstance";

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: "Free" | "Monthly" | "3-Month" | "Yearly" | "School";
  status: "Active" | "Cancelled" | "Expired" | "Trial";
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: string;
  autoRenew: boolean;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  userId: string;
  userName: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  paymentDate: string;
  paymentMethod: string;
  invoiceId: string;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export const subscriptionsApi = {
  getSubscriptions: async (filters?: Record<string, unknown>): Promise<SubscriptionsResponse> => {
    const response = await axiosInstance.get("/subscriptions", { params: filters });
    return response.data;
  },

  getSubscriptionById: async (id: string): Promise<Subscription> => {
    const response = await axiosInstance.get(`/subscriptions/${id}`);
    return response.data;
  },

  cancelSubscription: async (id: string): Promise<Subscription> => {
    const response = await axiosInstance.patch(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  getPayments: async (filters?: Record<string, unknown>): Promise<PaymentsResponse> => {
    const response = await axiosInstance.get("/payments", { params: filters });
    return response.data;
  },

  refundPayment: async (id: string): Promise<Payment> => {
    const response = await axiosInstance.post(`/payments/${id}/refund`);
    return response.data;
  },
};
