// Notification Types
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
  priority: "LOW" | "MEDIUM" | "HIGH";
  is_read: boolean;
  link: string | null;
  created_at: string;
  read_at: string | null;
}

export interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}
