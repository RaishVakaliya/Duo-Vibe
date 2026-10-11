-- =============================================================================
-- Migration: Connect Hub Tables (About Them & Upcoming Plans)
-- 1. partner_notes (private owner-only notes about partner)
-- 2. couple_plans (shared couple upcoming plans)
-- 3. update delete_user_account() to cascade new tables
-- =============================================================================

-- 1. partner_notes table (Private to owner)
create table if not exists public.partner_notes (
  owner_id uuid references auth.users(id) on delete cascade not null,
  field_key text not null,
  value jsonb not null,
  updated_at timestamptz default now(),
  primary key (owner_id, field_key)
);

alter table public.partner_notes enable row level security;

-- Policy: Only owner can access their private notes
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'partner_notes' and policyname = 'owner only'
  ) then
    create policy "owner only" on public.partner_notes for all
      using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
  end if;
end $$;

-- 2. couple_plans table (Shared plans between partners)
create table if not exists public.couple_plans (
  id uuid primary key default gen_random_uuid(),
  couple_key text not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  title text not null check (char_length(title) <= 60),
  kind text not null default 'other' check (kind in ('date','trip','anniversary','birthday','call','other')),
  starts_at timestamptz not null,
  all_day boolean not null default false,
  note text check (char_length(note) <= 200),
  done_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists couple_plans_idx on public.couple_plans(couple_key, starts_at);

alter table public.couple_plans enable row level security;

-- Select policy: couple members can read plans
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'couple_plans' and policyname = 'Couple members can select plans'
  ) then
    create policy "Couple members can select plans"
      on public.couple_plans for select
      using (
        auth.uid() = created_by
        or couple_key = (
          select
            least(auth.uid()::text, coalesce(
              p.partner_id::text,
              (select
                case
                  when c.user1_id = auth.uid() then c.user2_id::text
                  else c.user1_id::text
                end
               from public.couples c
               where (c.user1_id = auth.uid() or c.user2_id = auth.uid())
                 and c.status = 'connected'
               limit 1)
            )) || '_' || greatest(auth.uid()::text, coalesce(
              p.partner_id::text,
              (select
                case
                  when c.user1_id = auth.uid() then c.user2_id::text
                  else c.user1_id::text
                end
               from public.couples c
               where (c.user1_id = auth.uid() or c.user2_id = auth.uid())
                 and c.status = 'connected'
               limit 1)
            ))
          from public.profiles p
          where p.id = auth.uid()
        )
      );
  end if;
end $$;

-- Insert policy: requires created_by = auth.uid()
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'couple_plans' and policyname = 'Users can insert own plans'
  ) then
    create policy "Users can insert own plans"
      on public.couple_plans for insert
      with check (auth.uid() = created_by);
  end if;
end $$;

-- Update policy: either partner can update (edit or mark done)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'couple_plans' and policyname = 'Couple members can update plans'
  ) then
    create policy "Couple members can update plans"
      on public.couple_plans for update
      using (
        auth.uid() = created_by
        or couple_key = (
          select
            least(auth.uid()::text, coalesce(
              p.partner_id::text,
              (select
                case
                  when c.user1_id = auth.uid() then c.user2_id::text
                  else c.user1_id::text
                end
               from public.couples c
               where (c.user1_id = auth.uid() or c.user2_id = auth.uid())
                 and c.status = 'connected'
               limit 1)
            )) || '_' || greatest(auth.uid()::text, coalesce(
              p.partner_id::text,
              (select
                case
                  when c.user1_id = auth.uid() then c.user2_id::text
                  else c.user1_id::text
                end
               from public.couples c
               where (c.user1_id = auth.uid() or c.user2_id = auth.uid())
                 and c.status = 'connected'
               limit 1)
            ))
          from public.profiles p
          where p.id = auth.uid()
        )
      );
  end if;
end $$;

-- Delete policy: only the creator can delete
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'couple_plans' and policyname = 'Only creator can delete plans'
  ) then
    create policy "Only creator can delete plans"
      on public.couple_plans for delete
      using (auth.uid() = created_by);
  end if;
end $$;

-- Enable Realtime for couple_plans (do NOT add partner_notes to realtime)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'couple_plans'
  ) then
    alter publication supabase_realtime add table public.couple_plans;
  end if;
end $$;

-- 3. Update delete_user_account() to cascade partner_notes and couple_plans
create or replace function public.delete_user_account()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('success', false, 'error', 'Not authenticated');
  end if;

  -- 1. Delete private partner notes owned by user
  delete from public.partner_notes where owner_id = v_user_id;

  -- 2. Delete couple plans created by user
  delete from public.couple_plans where created_by = v_user_id;

  -- 3. Unlink any partner who has this user as partner_id
  update public.profiles
  set partner_id = null,
      updated_at = now()
  where partner_id = v_user_id;

  -- 4. Delete couple records
  delete from public.couples
  where user1_id = v_user_id or user2_id = v_user_id;

  -- 5. Delete from flag tables
  delete from public.flag_answers where user_id = v_user_id;
  delete from public.flag_votes where user_id = v_user_id;
  delete from public.flag_sessions where user_id = v_user_id or partner_id = v_user_id;

  -- 6. Delete memories and reactions
  delete from public.memory_reactions where user_id = v_user_id;
  delete from public.memories where created_by = v_user_id;

  -- 7. Delete chat messages
  delete from public.chat_messages where sender_id = v_user_id;

  -- 8. Delete quiz answers & sessions
  delete from public.quiz_answers
  where session_id in (
    select id from public.quiz_sessions
    where answerer_id = v_user_id or reviewer_id = v_user_id
  );
  delete from public.quiz_sessions
  where answerer_id = v_user_id or reviewer_id = v_user_id;

  -- 9. Delete 21 questions answers
  delete from public.twenty_one_questions_answers where user_id = v_user_id;

  -- 10. Delete couple challenge completions & progress
  delete from public.couple_challenge_completions where user_id = v_user_id;
  delete from public.couple_challenge_progress where user_a_id = v_user_id or user_b_id = v_user_id;

  -- 11. Delete secret crush messages
  delete from public.secret_crush_messages where sender_id = v_user_id;

  -- 12. Delete daily spark answers
  delete from public.spark_answers where user_id = v_user_id;

  -- 13. Delete user from profiles table
  delete from public.profiles where id = v_user_id;

  -- 14. Delete auth user from auth.users (cascades remaining auth rows)
  delete from auth.users where id = v_user_id;

  return json_build_object('success', true);
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;

grant execute on function public.delete_user_account() to authenticated;
