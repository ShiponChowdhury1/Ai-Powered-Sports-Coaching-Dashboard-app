// Content Page Types (Privacy Policy, Terms & Conditions, etc.)
export interface ContentPage {
  id: number;
  page_type: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string;
  is_published: boolean;
  published_at: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentPageResponse {
  data: ContentPage;
  message?: string;
}

// Type aliases for specific content types
export type PrivacyPolicy = ContentPage;
export type TermsConditions = ContentPage;
