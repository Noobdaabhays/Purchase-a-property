/**
 * Supabase Client Configuration for Static Hosting (InfinityFree, Netlify, Vercel)
 *
 * This client enables direct browser-to-Supabase communication over HTTPS,
 * bypassing the need for a Node.js server runtime on shared hosts like InfinityFree.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
    console.info('[AURA Real Estate] Supabase client initialized successfully with project:', supabaseUrl);
  } catch (err) {
    console.warn('[AURA Real Estate] Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;

/**
 * SQL Schema migration helper reference for user Supabase SQL Editor setup
 */
export const SUPABASE_SQL_SETUP = `
-- 1. Profiles Table (Role-based access control)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'agent', 'admin')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  price_per_sqft NUMERIC,
  listing_type TEXT NOT NULL,
  property_type TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'United States',
  address TEXT NOT NULL,
  locality TEXT,
  area_sqft NUMERIC NOT NULL,
  area_sqm NUMERIC,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  parking_spaces INTEGER DEFAULT 2,
  featured_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  is_trending BOOLEAN DEFAULT false,
  listed_date DATE DEFAULT CURRENT_DATE,
  last_updated_date DATE DEFAULT CURRENT_DATE,
  view_count INTEGER DEFAULT 1,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  property_title TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_contact TEXT DEFAULT 'phone',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Site Visits Table
CREATE TABLE IF NOT EXISTS public.site_visits (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  property_title TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  visit_type TEXT DEFAULT 'in_person',
  agent_id TEXT,
  agent_name TEXT,
  status TEXT DEFAULT 'confirmed',
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
  lead_source TEXT DEFAULT 'website_enquiry',
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'high',
  assigned_agent_id TEXT,
  assigned_agent_name TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  follow_up_date DATE,
  created_at DATE DEFAULT CURRENT_DATE,
  updated_at DATE DEFAULT CURRENT_DATE
);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read for properties
CREATE POLICY "Public properties are readable by anyone" ON public.properties
  FOR SELECT USING (true);

-- Admin full access on properties
CREATE POLICY "Admins have full access to properties" ON public.properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Enquiries insert by anyone
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Site visits insert by anyone
CREATE POLICY "Anyone can book a site visit" ON public.site_visits
  FOR INSERT WITH CHECK (true);
`;
