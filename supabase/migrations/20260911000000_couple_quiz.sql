-- ==========================================
-- DUO VIBE: COMPLETE INITIAL DATABASE SCHEMA
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  partner_id uuid references public.profiles(id),
  invite_code text,
  relationship_type text,
  push_token text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Couples Table
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references public.profiles(id) on delete cascade not null,
  user2_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'connected')),
  connected_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Daily Sparks & Spark Answers Tables
create table if not exists public.daily_sparks (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  spark_date date not null default current_date,
  category text,
  created_at timestamptz default now()
);

create table if not exists public.spark_answers (
  id uuid primary key default gen_random_uuid(),
  spark_id uuid references public.daily_sparks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  answer text not null,
  created_at timestamptz default now()
);

-- 4. Date Ideas Table
create table if not exists public.date_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  category_color text,
  description text not null,
  location text,
  website_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 5. Memories Table
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  caption text,
  memory_date date default current_date,
  created_at timestamptz default now()
);

-- 6. Quiz Sessions Table
create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  answerer_id uuid references auth.users(id) not null,
  reviewer_id uuid references auth.users(id) not null,
  question_ids jsonb not null,
  status text not null default 'awaiting_review' check (status in ('awaiting_review', 'completed')),
  score int,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 7. Quiz Answers Table
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.quiz_sessions(id) on delete cascade not null,
  question_id text not null,
  guessed_option text not null,
  is_correct boolean
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.daily_sparks enable row level security;
alter table public.spark_answers enable row level security;
alter table public.date_ideas enable row level security;
alter table public.memories enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;

-- Profiles policies
create policy "Allow all authenticated users to read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Couples policies
create policy "Users can read their couples"
  on public.couples for select
  to authenticated
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "Users can insert couples"
  on public.couples for insert
  to authenticated
  with check (auth.uid() = user1_id);

create policy "Users can update their couples"
  on public.couples for update
  to authenticated
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Quiz Sessions policies
create policy "Users can read their own quiz sessions"
  on public.quiz_sessions for select
  to authenticated
  using (auth.uid() = answerer_id or auth.uid() = reviewer_id);

create policy "Answerer can create sessions"
  on public.quiz_sessions for insert
  to authenticated
  with check (auth.uid() = answerer_id);

create policy "Reviewer can update session status/score"
  on public.quiz_sessions for update
  to authenticated
  using (auth.uid() = reviewer_id);

-- Quiz Answers policies
create policy "Users can read answers for their sessions"
  on public.quiz_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.quiz_sessions
      where quiz_sessions.id = quiz_answers.session_id
      and (quiz_sessions.answerer_id = auth.uid() or quiz_sessions.reviewer_id = auth.uid())
    )
  );

create policy "Answerer can insert answers"
  on public.quiz_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.quiz_sessions
      where quiz_sessions.id = quiz_answers.session_id
      and quiz_sessions.answerer_id = auth.uid()
    )
  );

create policy "Reviewer can update answer correctness"
  on public.quiz_answers for update
  to authenticated
  using (
    exists (
      select 1 from public.quiz_sessions
      where quiz_sessions.id = quiz_answers.session_id
      and quiz_sessions.reviewer_id = auth.uid()
    )
  );

-- Daily Sparks & Memories & Date Ideas general read
create policy "Authenticated can read daily sparks"
  on public.daily_sparks for select
  to authenticated
  using (true);

create policy "Users can read their spark answers"
  on public.spark_answers for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their spark answers"
  on public.spark_answers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated can read date ideas"
  on public.date_ideas for select
  to authenticated
  using (true);

create policy "Users can read their memories"
  on public.memories for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their memories"
  on public.memories for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================

alter publication supabase_realtime add table public.quiz_sessions;
alter publication supabase_realtime add table public.couples;

-- ==========================================
-- AUTH PROFILE TRIGGER (Auto create profile on signup)
-- ==========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
