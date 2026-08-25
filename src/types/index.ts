// User & Auth
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  country_code: string;
  language: string;
  currency: string;
  timezone: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Subscription
export interface SubscriptionPlan {
  id: string;
  name: string;
  duration_months: number;
  description: string;
  video_quality: string[];
  max_devices: number;
  features: string[];
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  next_billing_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

// Pricing
export interface CountryPricing {
  id: string;
  country_code: string;
  country_name: string;
  currency: string;
  monthly_price: number;
  quarterly_price?: number;
  annual_price?: number;
  tax_included: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Payment
export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  gateway: 'stripe' | 'mercado_pago' | 'paypal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  payment_date: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'wallet';
  token: string; // Tokenized data from payment gateway
  last_four: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  created_at: string;
}

// Content
export interface Movie {
  id: string;
  title: string;
  original_title: string;
  synopsis: string;
  poster_url: string;
  banner_url: string;
  trailer_url?: string;
  release_year: number;
  country_of_origin: string;
  director: string;
  cast: string[];
  genres: string[];
  age_rating: string;
  duration_minutes: number;
  video_quality: string[];
  languages: string[];
  subtitles: string[];
  availability_date: string;
  licensing_status: 'active' | 'expired' | 'pending';
  license_start_date: string;
  license_end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  title: string;
  original_title: string;
  synopsis: string;
  poster_url: string;
  banner_url: string;
  trailer_url?: string;
  release_year: number;
  country_of_origin: string;
  creator: string;
  cast: string[];
  genres: string[];
  age_rating: string;
  total_seasons: number;
  video_quality: string[];
  languages: string[];
  subtitles: string[];
  availability_date: string;
  licensing_status: 'active' | 'expired' | 'pending';
  license_start_date: string;
  license_end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  series_id: string;
  season_number: number;
  title: string;
  synopsis: string;
  release_date: string;
  poster_url: string;
  episode_count: number;
  created_at: string;
}

export interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  synopsis: string;
  duration_minutes: number;
  air_date: string;
  thumbnail_url: string;
  video_url: string;
  video_quality: string[];
  languages: string[];
  subtitles: string[];
  created_at: string;
}

// License & Regional Rights
export interface License {
  id: string;
  content_id: string;
  content_type: 'movie' | 'series';
  distributor: string;
  license_type: string;
  start_date: string;
  end_date: string;
  authorized_countries: string[];
  authorized_quality: string[];
  platform: string;
  created_at: string;
  updated_at: string;
}

export interface ContentRegion {
  id: string;
  content_id: string;
  content_type: 'movie' | 'series';
  country_code: string;
  region: string;
  is_available: boolean;
  created_at: string;
}

// User Activity
export interface WatchHistory {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'movie' | 'series' | 'episode';
  watched_at: string;
  duration_watched_seconds: number;
  total_duration_seconds: number;
  resume_at_seconds: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'movie' | 'series';
  added_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'movie' | 'series';
  added_at: string;
}

// Devices
export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_type: 'web' | 'mobile' | 'tablet' | 'smart_tv';
  device_id: string;
  ip_address: string;
  last_used: string;
  is_active: boolean;
  created_at: string;
}

// Cinema Releases
export interface CinemaRelease {
  id: string;
  movie_id: string;
  cinema_release_date: string;
  cinehub_availability_date: string;
  country: string;
  distributor: string;
  license: string;
  authorized_region: string;
  status: 'scheduled' | 'theatrical' | 'available' | 'expired';
  created_at: string;
  updated_at: string;
}

// Admin
export interface AdminUser {
  id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'support';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// Analytics
export interface ContentAnalytics {
  id: string;
  content_id: string;
  content_type: 'movie' | 'series';
  total_views: number;
  completed_views: number;
  total_watch_time_minutes: number;
  unique_viewers: number;
  average_rating: number;
  date: string;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
  created_by: string;
  created_at: string;
}
