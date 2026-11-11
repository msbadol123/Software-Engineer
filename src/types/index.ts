export type Platform = 'Windows' | 'macOS' | 'Linux' | 'Web' | 'Multi-platform' | 'Cross-Platform';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order?: number;
  software_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SoftwareImage {
  id: string;
  software_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

export interface Software {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  version: string;
  category_id: string;
  category_name?: string;
  platform: Platform | string;
  system_requirements: string;
  is_paid: boolean;
  price: number;
  currency: string;
  developer_name: string;
  developer_url?: string;
  thumbnail_url: string;
  screenshots?: string[];
  download_url?: string; // Validated HTTPS / Google Drive download link
  download_count: number;
  is_published: boolean;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface DownloadRecord {
  id: string;
  software_id: string;
  software_title?: string;
  software_version?: string;
  software_thumbnail?: string;
  user_id?: string;
  user_email?: string;
  ip_hash?: string;
  download_date: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AdSetting {
  id: string;
  slot_key: 'homepage_top' | 'homepage_middle' | 'homepage_bottom' | 'software_details' | 'sidebar' | 'footer';
  slot_name: string;
  is_enabled: boolean;
  ad_type: 'banner_728x90' | 'banner_300x250' | 'banner_468x60' | 'native' | 'social_bar';
  zone_id: string;
  ad_script?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id?: string;
  site_name: string;
  logo_url?: string;
  favicon_url?: string;
  hero_headline: string;
  hero_subheadline: string;
  contact_email: string;
  social_github?: string;
  social_twitter?: string;
  default_theme: 'system' | 'light' | 'dark';
}

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  isAdmin: boolean;
  role?: 'user' | 'admin' | 'super_admin';
}

export type SoftwareFilter = {
  searchQuery: string;
  categorySlug: string;
  platform: string;
  pricing: 'all' | 'free' | 'paid';
  sortBy: 'popular' | 'latest' | 'featured' | 'name';
};
