
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'seeker', -- 'seeker', 'employer', 'admin'
  avatar_url text,
  city text,
  country text,
  subscription_tier text default 'free',
  
  -- Store complex objects as JSONB for flexibility
  skills jsonb default '[]'::jsonb,
  experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  preferences jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- JOBS TABLE
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  employer_id uuid references public.profiles(id) not null,
  title text not null,
  company text not null,
  location text, -- Onsite, Remote, Hybrid
  city text,
  country text,
  salary_range text,
  job_type text, -- Full-time, etc.
  
  -- Job Details
  description text,
  requirements text,
  responsibilities text,
  benefits jsonb default '[]'::jsonb,
  status text default 'active', -- active, closed, draft
  
  is_premium boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Policies for Jobs
create policy "Jobs are viewable by everyone." on public.jobs
  for select using (true);

create policy "Employers can insert jobs." on public.jobs
  for insert with check (auth.uid() = employer_id);

create policy "Employers can update own jobs." on public.jobs
  for update using (auth.uid() = employer_id);

-- APPLICATIONS TABLE
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  candidate_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'applied',
  
  cover_letter text,
  resume_url text,
  video_pitch_url text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(job_id, candidate_id) -- Prevent duplicate applications
);

-- Enable RLS
alter table public.applications enable row level security;

-- Policies for Applications
create policy "Candidates can view their own applications." on public.applications
  for select using (auth.uid() = candidate_id);

create policy "Employers can view applications for their jobs." on public.applications
  for select using (
    exists (
      select 1 from public.jobs
      where public.jobs.id = public.applications.job_id
      and public.jobs.employer_id = auth.uid()
    )
  );

create policy "Candidates can insert applications." on public.applications
  for insert with check (auth.uid() = candidate_id);
