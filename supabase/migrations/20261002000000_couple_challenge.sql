-- ==========================================
-- COUPLE CHALLENGE PROGRESS TABLE & POLICIES
-- ==========================================

create table if not exists public.couple_challenge_progress (
  id uuid primary key default gen_random_uuid(),
  couple_key text not null unique,
  user_a_id uuid references auth.users(id) not null,
  user_b_id uuid references auth.users(id) not null,
  current_day int not null default 1,
  completed_days jsonb not null default '[]',
  last_completed_at timestamptz,
  started_at timestamptz default now()
);

alter table public.couple_challenge_progress enable row level security;

create policy "Couple members can read their shared progress"
  on public.couple_challenge_progress for select
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "Couple members can update their shared progress"
  on public.couple_challenge_progress for update
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "Couple members can insert their own progress row"
  on public.couple_challenge_progress for insert
  with check (auth.uid() = user_a_id or auth.uid() = user_b_id);
