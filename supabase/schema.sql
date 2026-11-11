-- ==============================================================================
-- SOFTWARE ENGINEER — COMPLETE DATABASE SCHEMA & SECURITY POLICIES
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE platform_type AS ENUM ('Windows', 'macOS', 'Linux', 'Web', 'Multi-platform', 'Cross-Platform');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Admins Table (Stores authorized admin accounts)
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'Code',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Software Table
CREATE TABLE IF NOT EXISTS public.software (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0.0',
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    platform TEXT NOT NULL DEFAULT 'Cross-Platform',
    system_requirements TEXT,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    price NUMERIC(10, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    developer_name TEXT NOT NULL DEFAULT 'Independent Developer',
    developer_url TEXT,
    thumbnail_url TEXT NOT NULL,
    download_url TEXT, -- Validated HTTPS or Google Drive URL (hidden for paid software from public)
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Software Images & Screenshots Table
CREATE TABLE IF NOT EXISTS public.software_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    software_id UUID NOT NULL REFERENCES public.software(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Downloads History Table
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    software_id UUID NOT NULL REFERENCES public.software(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_hash TEXT,
    user_agent TEXT,
    download_date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Adsterra Ads Settings Table
CREATE TABLE IF NOT EXISTS public.ads_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_key TEXT NOT NULL UNIQUE, -- 'homepage_top', 'homepage_middle', 'homepage_bottom', 'software_details', 'sidebar', 'footer'
    slot_name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    ad_type TEXT NOT NULL DEFAULT 'banner_728x90', -- 'banner_728x90', 'banner_300x250', 'banner_468x60', 'native', 'social_bar'
    zone_id TEXT, -- Approved Adsterra Zone ID
    ad_script TEXT, -- Controlled Adsterra tag script (sanitized & configured by admin)
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'Software Engineer',
    logo_url TEXT,
    favicon_url TEXT,
    hero_headline TEXT NOT NULL DEFAULT 'Discover the Best Software for Your Needs',
    hero_subheadline TEXT NOT NULL DEFAULT 'Vetted developer tools, productivity suites, system utilities, and creative software with verified high-speed downloads.',
    contact_email TEXT DEFAULT 'contact@softwareengineer.dev',
    social_github TEXT,
    social_twitter TEXT,
    default_theme TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_software_category ON public.software(category_id);
CREATE INDEX IF NOT EXISTS idx_software_slug ON public.software(slug);
CREATE INDEX IF NOT EXISTS idx_software_published ON public.software(is_published);
CREATE INDEX IF NOT EXISTS idx_software_featured ON public.software(is_featured);
CREATE INDEX IF NOT EXISTS idx_software_paid ON public.software(is_paid);
CREATE INDEX IF NOT EXISTS idx_software_created ON public.software(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_software ON public.downloads(software_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON public.downloads(download_date DESC);

-- ==============================================================================
-- SECURITY HELPER FUNCTIONS
-- ==============================================================================

-- Function to check if the executing user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
    );
$$;

-- Trigger function to handle automatic profile creation on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = NOW();
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to update software download count atomically
CREATE OR REPLACE FUNCTION public.increment_software_download_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.software
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = new.software_id;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_software_downloaded ON public.downloads;
CREATE TRIGGER on_software_downloaded
    AFTER INSERT ON public.downloads
    FOR EACH ROW EXECUTE FUNCTION public.increment_software_download_count();

-- Procedure to promote a user to admin (used during setup)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
    IF target_user_id IS NULL THEN
        RETURN 'Error: User with provided email not found in auth.users.';
    END IF;

    INSERT INTO public.admins (user_id, role)
    VALUES (target_user_id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

    RETURN 'Success: User ' || target_email || ' (' || target_user_id || ') is now an admin.';
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Admins Policies
CREATE POLICY "Admins can view admins list"
    ON public.admins FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can manage admins"
    ON public.admins FOR ALL
    USING (public.is_admin());

-- 3. Categories Policies
CREATE POLICY "Categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify categories"
    ON public.categories FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Software Policies
CREATE POLICY "Published software is viewable by public"
    ON public.software FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Only admins can insert software"
    ON public.software FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update software"
    ON public.software FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete software"
    ON public.software FOR DELETE
    USING (public.is_admin());

-- 5. Software Images Policies
CREATE POLICY "Software images readable by everyone"
    ON public.software_images FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify software images"
    ON public.software_images FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. Downloads Policies
CREATE POLICY "Users can view their own downloads"
    ON public.downloads FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone can record a verified download"
    ON public.downloads FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.software
            WHERE id = software_id AND is_published = true AND is_paid = false
        )
    );

-- 7. Ads Settings Policies
CREATE POLICY "Ads settings readable by public"
    ON public.ads_settings FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify ads settings"
    ON public.ads_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8. Site Settings Policies
CREATE POLICY "Site settings readable by public"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Only admins can update site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- DEFAULT SEED DATA
-- ==============================================================================
INSERT INTO public.site_settings (site_name, hero_headline, hero_subheadline, contact_email)
VALUES (
    'Software Engineer',
    'Discover the Best Software for Your Needs',
    'Vetted developer tools, productivity suites, system utilities, and creative software with verified high-speed downloads.',
    'contact@softwareengineer.dev'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.ads_settings (slot_key, slot_name, is_enabled, ad_type, zone_id)
VALUES
    ('homepage_top', 'Homepage Top Banner (728x90)', false, 'banner_728x90', ''),
    ('homepage_middle', 'Homepage Middle Banner (728x90)', false, 'banner_728x90', ''),
    ('homepage_bottom', 'Homepage Bottom Banner (728x90)', false, 'banner_728x90', ''),
    ('software_details', 'Software Details Sidebar (300x250)', false, 'banner_300x250', ''),
    ('sidebar', 'General Sidebar Unit (300x250)', false, 'banner_300x250', ''),
    ('footer', 'Footer Sticky Banner (728x90)', false, 'banner_728x90', '')
ON CONFLICT (slot_key) DO NOTHING;
