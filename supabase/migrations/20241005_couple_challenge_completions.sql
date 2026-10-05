-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Per-user independent completion tracking for Couple Challenge
-- + Shared session tables for 21 Questions
-- ─────────────────────────────────────────────────────────────────────────────
-- Creates `couple_challenge_completions` — one row per (progress_id, user_id, day).
-- The parent `couple_challenge_progress` row continues to hold `current_day` and
-- `started_at` but the `completed_days` JSONB column is now unused (kept for
-- backward-compat; will be cleaned up in a future migration).
-- Day N+1 unlocks only after BOTH partners have a completion row for day N.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.couple_challenge_completions (
  id            uuid primary key default gen_random_uuid(),
  progress_id   uuid not null references public.couple_challenge_progress(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  day           smallint not null check (day >= 1 and day <= 30),
  completed_at  timestamptz not null default now(),

  -- Each user can complete a given day only once per couple journey
  unique (progress_id, user_id, day)
);

-- Index for fast per-progress lookups (used by realtime filter too)
create index if not exists idx_ccc_progress_id
  on public.couple_challenge_completions (progress_id);

-- Index for per-user lookups (e.g. "has this user done day N?")
create index if not exists idx_ccc_user_day
  on public.couple_challenge_completions (progress_id, user_id, day);

-- Enable Row-Level Security
alter table public.couple_challenge_completions enable row level security;

-- Policy: a user can see completions that belong to their couple's progress row
create policy "Users can view their couple's completions"
  on public.couple_challenge_completions
  for select
  using (
    progress_id in (
      select id from public.couple_challenge_progress
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

-- Policy: a user can insert their own completion rows only
create policy "Users can insert own completions"
  on public.couple_challenge_completions
  for insert
  with check (
    user_id = auth.uid()
    and progress_id in (
      select id from public.couple_challenge_progress
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

-- Enable Realtime for this table
alter publication supabase_realtime add table public.couple_challenge_completions;

-- ─── 21 Questions shared session table ───────────────────────────────────────
-- Creates `twenty_one_questions_sessions` for shared couple Q&A sessions.
-- One session per couple_key; both partners answer independently; answers
-- revealed side-by-side once both have answered each question.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.twenty_one_questions_sessions (
  id            uuid primary key default gen_random_uuid(),
  couple_key    text not null unique,
  question_ids  jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  reset_at      timestamptz
);

create index if not exists idx_tqs_couple_key
  on public.twenty_one_questions_sessions (couple_key);

alter table public.twenty_one_questions_sessions enable row level security;

create policy "Authenticated users can manage 21Q session"
  on public.twenty_one_questions_sessions
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ─── 21 Questions per-user answers ───────────────────────────────────────────

create table if not exists public.twenty_one_questions_answers (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.twenty_one_questions_sessions(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  answer      text not null,
  answered_at timestamptz not null default now(),

  unique (session_id, user_id, question_id)
);

create index if not exists idx_tqa_session_user
  on public.twenty_one_questions_answers (session_id, user_id);

alter table public.twenty_one_questions_answers enable row level security;

create policy "Authenticated users can view 21Q answers"
  on public.twenty_one_questions_answers
  for select
  using (auth.uid() is not null);

create policy "Users can insert own 21Q answers"
  on public.twenty_one_questions_answers
  for insert
  with check (user_id = auth.uid());

create policy "Users can update own 21Q answers"
  on public.twenty_one_questions_answers
  for update
  using (user_id = auth.uid());

-- Enable Realtime
alter publication supabase_realtime add table public.twenty_one_questions_sessions;
alter publication supabase_realtime add table public.twenty_one_questions_answers;
