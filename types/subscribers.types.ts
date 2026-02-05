export interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface SubscribersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Subscriber[];
}

export interface SubscribersListParams {
  page?: number;
  search?: string;
}
