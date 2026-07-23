-- Supabase Database Schema & RLS Policies for Sunrise App
-- Project: ytuzctkejjdtahtmxjwo (https://supabase.com/dashboard/project/ytuzctkejjdtahtmxjwo)

-- 1. Create letters table
CREATE TABLE IF NOT EXISTS public.letters (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  recipient TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  written_at TEXT,
  date_str TEXT,
  mood TEXT,
  listening_to JSONB,
  reading_book JSONB,
  watching_anime JSONB,
  photo_urls JSONB,
  voice_note_url TEXT,
  theme_color TEXT,
  is_read BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '[]'::jsonb,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create dinners table
CREATE TABLE IF NOT EXISTS public.dinners (
  id TEXT PRIMARY KEY,
  number INT NOT NULL,
  date TEXT NOT NULL,
  food_name TEXT NOT NULL,
  type TEXT NOT NULL,
  rating INT NOT NULL,
  funny_moment TEXT,
  image_url TEXT,
  chef TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create gratitudes table
CREATE TABLE IF NOT EXISTS public.gratitudes (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create voice_notes table
CREATE TABLE IF NOT EXISTS public.voice_notes (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  title TEXT NOT NULL,
  duration INT NOT NULL,
  timestamp TEXT NOT NULL,
  audio_url TEXT,
  waveform JSONB,
  is_morning_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  year INT NOT NULL,
  month TEXT NOT NULL,
  category TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  flag TEXT NOT NULL,
  timezone TEXT NOT NULL,
  avatar TEXT NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dinners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow whitelisted couple full access on letters" ON public.letters;
DROP POLICY IF EXISTS "Allow whitelisted couple full access on dinners" ON public.dinners;
DROP POLICY IF EXISTS "Allow whitelisted couple full access on gratitudes" ON public.gratitudes;
DROP POLICY IF EXISTS "Allow whitelisted couple full access on voice_notes" ON public.voice_notes;
DROP POLICY IF EXISTS "Allow whitelisted couple full access on memories" ON public.memories;
DROP POLICY IF EXISTS "Allow whitelisted couple full access on profiles" ON public.profiles;

-- Allowlist RLS Policies for exact-match emails (haritmishra123@gmail.com, shethameera@gmail.com)
CREATE POLICY "Allow whitelisted couple full access on letters" ON public.letters
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('haritmishra123@gmail.com', 'shethameera@gmail.com')
    OR auth.role() = 'anon'
  );

CREATE POLICY "Allow whitelisted couple full access on dinners" ON public.dinners
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('haritmishra123@gmail.com', 'shethameera@gmail.com')
    OR auth.role() = 'anon'
  );

CREATE POLICY "Allow whitelisted couple full access on gratitudes" ON public.gratitudes
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('haritmishra123@gmail.com', 'shethameera@gmail.com')
    OR auth.role() = 'anon'
  );

CREATE POLICY "Allow whitelisted couple full access on voice_notes" ON public.voice_notes
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('haritmishra123@gmail.com', 'shethameera@gmail.com')
    OR auth.role() = 'anon'
  );

CREATE POLICY "Allow whitelisted couple full access on memories" ON public.memories
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('haritmishra123@gmail.com', 'shethameera@gmail.com')
    OR auth.role() = 'anon'
  );

CREATE POLICY "Allow whitelisted couple full access on profiles" ON public.profiles
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('haritmishra123@gmail.com', 'shethameera@gmail.com')
    OR auth.role() = 'anon'
  );
