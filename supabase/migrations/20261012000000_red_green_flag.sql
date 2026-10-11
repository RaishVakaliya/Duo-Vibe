-- ==============================================================================
-- RED FLAG OR GREEN FLAG GAME MIGRATION
-- ==============================================================================

-- 1. Solo Votes Table (Anonymous aggregation for community percentages)
create table if not exists public.flag_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  statement_id text not null,
  vote text not null check (vote in ('red', 'green')),
  created_at timestamptz default now(),
  unique (user_id, statement_id)
);

alter table public.flag_votes enable row level security;

create policy "Users can select own solo votes"
  on public.flag_votes for select
  using (auth.uid() = user_id);

create policy "Users can insert own solo votes"
  on public.flag_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own solo votes"
  on public.flag_votes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own solo votes"
  on public.flag_votes for delete
  using (auth.uid() = user_id);

create index if not exists idx_flag_votes_statement_id on public.flag_votes (statement_id);
create index if not exists idx_flag_votes_user_id on public.flag_votes (user_id);


-- 2. Partner Game Sessions Table
create table if not exists public.flag_sessions (
  id uuid primary key default gen_random_uuid(),
  couple_key text not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  statement_ids jsonb not null,           -- 20 statement ids
  created_at timestamptz default now()
);

alter table public.flag_sessions enable row level security;

create policy "Couple members can select their flag sessions"
  on public.flag_sessions for select
  using (couple_key = public.get_auth_couple_key());

create policy "Couple members can insert flag sessions"
  on public.flag_sessions for insert
  with check (auth.uid() = created_by and couple_key = public.get_auth_couple_key());

create policy "Creator can delete flag session"
  on public.flag_sessions for delete
  using (auth.uid() = created_by);

create index if not exists idx_flag_sessions_couple_key on public.flag_sessions (couple_key);


-- 3. Partner Answers Table
create table if not exists public.flag_answers (
  session_id uuid references public.flag_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  statement_id text not null,
  vote text not null check (vote in ('red', 'green')),
  created_at timestamptz default now(),
  primary key (session_id, user_id, statement_id)
);

alter table public.flag_answers enable row level security;

create policy "Users can select own flag answers"
  on public.flag_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own flag answers"
  on public.flag_answers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own flag answers"
  on public.flag_answers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own flag answers"
  on public.flag_answers for delete
  using (auth.uid() = user_id);

create index if not exists idx_flag_answers_session_id on public.flag_answers (session_id);
create index if not exists idx_flag_answers_user_id on public.flag_answers (user_id);


-- 4. RPC get_flag_stats: Community Red/Green Counts (Min 20 votes threshold)
create or replace function public.get_flag_stats(p_statement_ids text[])
returns table (
  statement_id text,
  total_votes bigint,
  red_votes bigint,
  green_votes bigint,
  red_percentage int,
  green_percentage int
)
language sql
security definer
set search_path = public
as $$
  select
    v.statement_id,
    count(*)::bigint as total_votes,
    count(*) filter (where v.vote = 'red')::bigint as red_votes,
    count(*) filter (where v.vote = 'green')::bigint as green_votes,
    round((count(*) filter (where v.vote = 'red')::numeric / count(*)::numeric) * 100)::int as red_percentage,
    round((count(*) filter (where v.vote = 'green')::numeric / count(*)::numeric) * 100)::int as green_percentage
  from public.flag_votes v
  where v.statement_id = any(p_statement_ids)
  group by v.statement_id
  having count(*) >= 20;
$$;


-- 5. RPC get_flag_results: Merged answers ONLY when both partners have completed
create or replace function public.get_flag_results(p_session_id uuid)
returns table (
  statement_id text,
  my_vote text,
  partner_vote text,
  is_agreement boolean,
  partner_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_key text;
  v_partner_id uuid;
  v_my_count int;
  v_partner_count int;
  v_total_statements int;
  v_current_user uuid := auth.uid();
begin
  if v_current_user is null then
    return;
  end if;

  -- Verify session belongs to authenticated couple
  select s.couple_key, jsonb_array_length(s.statement_ids)
  into v_couple_key, v_total_statements
  from public.flag_sessions s
  where s.id = p_session_id;

  if v_couple_key is null or v_couple_key <> public.get_auth_couple_key() then
    return;
  end if;

  -- Determine partner's user ID from couples table
  select
    case
      when c.user1_id = v_current_user then c.user2_id
      else c.user1_id
    end
  into v_partner_id
  from public.couples c
  where (c.user1_id = v_current_user or c.user2_id = v_current_user)
    and c.status = 'connected'
  limit 1;

  if v_partner_id is null then
    return;
  end if;

  -- Both partners must have answered all 20 statements
  select count(distinct a.statement_id)
  into v_my_count
  from public.flag_answers a
  where a.session_id = p_session_id and a.user_id = v_current_user;

  select count(distinct a.statement_id)
  into v_partner_count
  from public.flag_answers a
  where a.session_id = p_session_id and a.user_id = v_partner_id;

  if v_my_count < v_total_statements or v_partner_count < v_total_statements then
    return;
  end if;

  -- Return merged answers
  return query
  select
    my_a.statement_id,
    my_a.vote as my_vote,
    part_a.vote as partner_vote,
    (my_a.vote = part_a.vote) as is_agreement,
    v_partner_id as partner_id
  from public.flag_answers my_a
  join public.flag_answers part_a
    on my_a.session_id = part_a.session_id
   and my_a.statement_id = part_a.statement_id
   and part_a.user_id = v_partner_id
  where my_a.session_id = p_session_id
    and my_a.user_id = v_current_user;
end;
$$;


-- 6. Add to Realtime Publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'flag_sessions'
  ) then
    alter publication supabase_realtime add table public.flag_sessions;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'flag_answers'
  ) then
    alter publication supabase_realtime add table public.flag_answers;
  end if;
end;
$$;
