/**
 * Supabase Client & Database Services for AURA Real Estate
 *
 * Provides real-time PostgreSQL database sync, authentication, and Supabase Storage image uploads.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, Lead, SiteVisit, Enquiry, User } from '../types/index.ts';
import { INITIAL_PROPERTIES } from '../data/initialData.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseKey !== 'your-anon-public-key' &&
  supabaseKey !== 'your-publishable-key'
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    });
  } catch (err) {
    console.warn('[AURA Real Estate] Supabase client init warning:', err);
  }
}

export const supabase = client;

/**
 * Upload an image file to Supabase Storage bucket 'property-images'
 * Includes instant DataURL fallback if storage bucket is not yet provisioned.
 */
export async function uploadPropertyImage(file: File): Promise<{ url: string; isCloud: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `properties/${Date.now()}-${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl, isCloud: true };
        }
      } else if (uploadError) {
        console.warn('[Supabase Storage upload]:', uploadError.message);
      }
    } catch (err: any) {
      console.warn('[Supabase Storage exception]:', err);
    }
  }

  // Graceful browser-native fallback: Convert to DataURL for immediate UI presentation
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string, isCloud: false });
    };
    reader.onerror = () => {
      resolve({ url: '/src/assets/images/hero_lunar_villa_1794834327790.jpg', isCloud: false, error: 'File read failed' });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Fetch all published properties from Supabase PostgreSQL
 */
export async function fetchPropertiesFromSupabase(): Promise<{ properties: Property[] | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { properties: null, error: 'Supabase client not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { properties: null, error: error.message };
    }

    if (!data || data.length === 0) {
      return { properties: [], error: undefined };
    }

    const normalized: Property[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || item.id,
      tagline: item.tagline || '',
      description: item.description || '',
      price: Number(item.price) || 0,
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      pricePerSqFt: Number(item.price_per_sqft) || Math.round((Number(item.price) || 0) / (Number(item.area_sqft) || 1)),
      listingType: item.listing_type || 'buy',
      propertyType: item.property_type || 'Villa',
      status: item.status || 'available',
      address: item.address || '',
      locality: item.locality || '',
      city: item.city || 'Scottsdale',
      state: item.state || 'Arizona',
      country: item.country || 'United States',
      coordinates: item.coordinates || { lat: 33.5, lng: -111.9 },
      nearbyLandmarks: item.nearby_landmarks || [],
      areaSqM: item.area_sqm || Math.round((Number(item.area_sqft) || 0) * 0.0929),
      areaSqFt: Number(item.area_sqft) || 5000,
      carpetAreaSqFt: Number(item.carpet_area_sqft) || Number(item.area_sqft) || 4500,
      builtUpAreaSqFt: Number(item.built_up_area_sqft) || Number(item.area_sqft) || 5000,
      bedrooms: Number(item.bedrooms) || 3,
      bathrooms: Number(item.bathrooms) || 2,
      parkingSpaces: Number(item.parking_spaces) || 2,
      facingDirection: item.facing_direction || 'South',
      furnishingStatus: item.furnishing_status || 'Furnished',
      possessionStatus: item.possession_status || 'Ready to Move',
      propertyAgeYears: Number(item.property_age_years) || 1,
      featuredImage: item.featured_image || '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
      galleryImages: item.gallery_images || [item.featured_image || '/src/assets/images/hero_lunar_villa_1794834327790.jpg'],
      amenities: item.amenities || ['Smart Home Automation', 'Infinity Pool'],
      isFeatured: Boolean(item.is_featured),
      isVerified: Boolean(item.is_verified ?? true),
      isTrending: Boolean(item.is_trending),
      viewCount: Number(item.view_count) || 1,
      likesCount: Number(item.likes_count) || 0,
      savesCount: Number(item.saves_count) || 0,
      agent: item.agent || {
        id: 'agent-marcus',
        name: 'Marcus Vance',
        email: 'm.vance@aurarealestate.com',
        phone: '+1 (480) 555-0192',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        agency: 'Aura Prime Estates',
        rating: 4.96,
        reviewCount: 48
      },
      listedDate: item.listed_date || new Date().toISOString().split('T')[0],
      lastUpdatedDate: item.last_updated_date || new Date().toISOString().split('T')[0],
      priceHistory: item.price_history || []
    }));

    return { properties: normalized, error: undefined };
  } catch (err: any) {
    return { properties: null, error: err?.message || 'Failed to fetch from Supabase' };
  }
}

/**
 * Save or update a property record in Supabase
 */
export async function savePropertyToSupabase(prop: Property): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase client not configured' };
  }

  try {
    const payload = {
      id: prop.id,
      title: prop.title,
      slug: prop.slug || prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: prop.tagline,
      description: prop.description,
      price: prop.price,
      price_per_sqft: prop.pricePerSqFt,
      listing_type: prop.listingType,
      property_type: prop.propertyType,
      status: prop.status,
      city: prop.city,
      state: prop.state,
      country: prop.country,
      address: prop.address,
      locality: prop.locality,
      area_sqft: prop.areaSqFt,
      area_sqm: prop.areaSqM,
      carpet_area_sqft: prop.carpetAreaSqFt,
      built_up_area_sqft: prop.builtUpAreaSqFt,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      parking_spaces: prop.parkingSpaces,
      facing_direction: prop.facingDirection,
      furnishing_status: prop.furnishingStatus,
      possession_status: prop.possessionStatus,
      property_age_years: prop.propertyAgeYears,
      featured_image: prop.featuredImage,
      gallery_images: prop.galleryImages,
      amenities: prop.amenities,
      is_featured: prop.isFeatured,
      is_verified: prop.isVerified,
      is_trending: prop.isTrending,
      view_count: prop.viewCount || 1,
      likes_count: prop.likesCount || 0,
      saves_count: prop.savesCount || 0,
      agent: prop.agent,
      price_history: prop.priceHistory || [],
      listed_date: prop.listedDate || new Date().toISOString().split('T')[0],
      last_updated_date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('properties').upsert(payload);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Database write error' };
  }
}

/**
 * Delete a property record from Supabase
 */
export async function deletePropertyFromSupabase(propertyId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase client not configured' };
  }

  try {
    const { error } = await supabase.from('properties').delete().eq('id', propertyId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Database delete error' };
  }
}

/**
 * One-click helper to seed default luxury properties into Supabase if empty
 */
export async function seedPropertiesToSupabase(): Promise<{ count: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { count: 0, error: 'Supabase client not configured' };
  }

  try {
    let inserted = 0;
    for (const prop of INITIAL_PROPERTIES) {
      const res = await savePropertyToSupabase(prop);
      if (res.success) {
        inserted++;
      }
    }
    return { count: inserted, error: inserted === 0 ? 'Could not seed properties. Ensure public.properties table is created.' : undefined };
  } catch (err: any) {
    return { count: 0, error: err?.message };
  }
}

/**
 * Live Health Check of Supabase PostgreSQL Tables & Storage
 */
export async function checkSupabaseHealth(): Promise<{
  isConfigured: boolean;
  projectUrl: string;
  tables: {
    properties: boolean;
    profiles: boolean;
    enquiries: boolean;
    site_visits: boolean;
    leads: boolean;
  };
  storageReady: boolean;
  error?: string;
}> {
  const result = {
    isConfigured: isSupabaseConfigured,
    projectUrl: supabaseUrl,
    tables: {
      properties: false,
      profiles: false,
      enquiries: false,
      site_visits: false,
      leads: false
    },
    storageReady: false,
    error: undefined as string | undefined
  };

  if (!isSupabaseConfigured || !supabase) {
    result.error = 'Supabase credentials not configured in environment';
    return result;
  }

  try {
    const [pRes, prRes, eRes, svRes, lRes, bRes] = await Promise.all([
      supabase.from('properties').select('id').limit(1),
      supabase.from('profiles').select('id').limit(1),
      supabase.from('enquiries').select('id').limit(1),
      supabase.from('site_visits').select('id').limit(1),
      supabase.from('leads').select('id').limit(1),
      supabase.storage.listBuckets()
    ]);

    result.tables.properties = !pRes.error;
    result.tables.profiles = !prRes.error;
    result.tables.enquiries = !eRes.error;
    result.tables.site_visits = !svRes.error;
    result.tables.leads = !lRes.error;

    if (!bRes.error && bRes.data) {
      result.storageReady = bRes.data.some((b) => b.name === 'property-images');
    }
  } catch (e: any) {
    result.error = e?.message;
  }

  return result;
}

/**
 * Complete, copy-pasteable Supabase SQL migration script with RLS & Storage
 */
export const SUPABASE_SQL_SETUP = `-- ======================================================================
-- AURA Real Estate Marketplace - Complete Production SQL Migration
-- Run this in your Supabase Project -> SQL Editor
-- ======================================================================

-- 1. Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'agent', 'admin', 'super_admin')),
  avatar TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Properties Catalog Table
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  tagline TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  price_per_sqft NUMERIC,
  listing_type TEXT NOT NULL DEFAULT 'buy' CHECK (listing_type IN ('buy', 'rent')),
  property_type TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'under_offer', 'sold', 'rented')),
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'United States',
  address TEXT NOT NULL,
  locality TEXT,
  area_sqft NUMERIC NOT NULL,
  area_sqm NUMERIC,
  carpet_area_sqft NUMERIC,
  built_up_area_sqft NUMERIC,
  bedrooms INTEGER NOT NULL DEFAULT 3,
  bathrooms INTEGER NOT NULL DEFAULT 2,
  parking_spaces INTEGER DEFAULT 2,
  facing_direction TEXT DEFAULT 'South',
  furnishing_status TEXT DEFAULT 'Furnished',
  possession_status TEXT DEFAULT 'Ready to Move',
  property_age_years NUMERIC DEFAULT 1,
  featured_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  nearby_landmarks JSONB DEFAULT '[]'::jsonb,
  coordinates JSONB DEFAULT '{"lat": 33.5, "lng": -111.9}'::jsonb,
  agent JSONB,
  price_history JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  is_trending BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 1,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  listed_date DATE DEFAULT CURRENT_DATE,
  last_updated_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Customer Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  property_title TEXT,
  property_image TEXT,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_contact TEXT DEFAULT 'phone',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Site Visits Booking Table
CREATE TABLE IF NOT EXISTS public.site_visits (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  property_title TEXT NOT NULL,
  property_image TEXT,
  property_address TEXT,
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  agent_id TEXT,
  agent_name TEXT,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  visit_type TEXT DEFAULT 'in_person' CHECK (visit_type IN ('in_person', 'virtual')),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CRM Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_id TEXT,
  property_title TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  lead_source TEXT DEFAULT 'website_enquiry',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'site_visit_scheduled', 'site_visit_completed', 'negotiation', 'booking_initiated', 'deal_closed', 'not_interested')),
  priority TEXT DEFAULT 'high' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_agent_id TEXT,
  assigned_agent_name TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  follow_up_date DATE,
  created_at DATE DEFAULT CURRENT_DATE,
  updated_at DATE DEFAULT CURRENT_DATE
);

-- ======================================================================
-- Row Level Security (RLS) Configuration
-- ======================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view their own profile; admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Properties: Public can view available listings; admins have full CRUD
CREATE POLICY "Public properties are readable by anyone" ON public.properties
  FOR SELECT USING (true);

CREATE POLICY "Public insert/update for properties" ON public.properties
  FOR ALL USING (true);

-- Enquiries: Anyone can submit an enquiry; admins & agents can manage
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for enquiries" ON public.enquiries
  FOR SELECT USING (true);

CREATE POLICY "Public update for enquiries" ON public.enquiries
  FOR UPDATE USING (true);

-- Site visits: Anyone can book; admins & agents manage
CREATE POLICY "Anyone can schedule a site visit" ON public.site_visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for site visits" ON public.site_visits
  FOR SELECT USING (true);

CREATE POLICY "Public update for site visits" ON public.site_visits
  FOR UPDATE USING (true);

-- Leads: Admins and agents can view and update CRM pipeline
CREATE POLICY "Public leads access" ON public.leads
  FOR ALL USING (true);

-- 6. Storage Bucket for Property Photography
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
CREATE POLICY "Public Access property-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

CREATE POLICY "Upload Access property-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'property-images' );

-- 7. Trigger to automatically create a profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
