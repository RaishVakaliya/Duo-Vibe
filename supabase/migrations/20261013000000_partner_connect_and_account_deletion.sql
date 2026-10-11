-- =============================================================================
-- Migration: Partner Connect & Complete Account Deletion
-- 1. Realtime enabled on public.profiles
-- 2. Foreign key cascade/set null on profiles.partner_id
-- 3. atomic RPC: public.connect_partner_code(text)
-- 4. atomic RPC: public.delete_user_account()
-- =============================================================================

-- 1. Fix foreign key on partner_id to prevent blocking deletions
alter table public.profiles
  drop constraint if exists profiles_partner_id_fkey;

alter table public.profiles
  add constraint profiles_partner_id_fkey
  foreign key (partner_id) references public.profiles(id)
  on delete set null;

-- 2. Add delete policy for profiles so authenticated users can delete their own profile
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can delete own profile'
  ) then
    create policy "Users can delete own profile"
      on public.profiles for delete
      to authenticated
      using (auth.uid() = id);
  end if;
end $$;

-- 3. Enable Supabase Realtime on profiles table
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end $$;

-- 4. Atomic partner connection function (bypasses RLS to update both partner profiles)
create or replace function public.connect_partner_code(p_partner_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_clean_code text;
  v_partner_profile public.profiles%rowtype;
  v_now timestamptz := now();
  v_age_seconds int;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('success', false, 'message', 'Not authenticated');
  end if;

  v_clean_code := upper(trim(p_partner_code));
  if length(v_clean_code) < 4 then
    return json_build_object('success', false, 'message', 'Please enter a valid partner code.');
  end if;

  -- Find partner profile by invite_code
  select * into v_partner_profile
  from public.profiles
  where invite_code = v_clean_code
    and id != v_user_id
  limit 1;

  if v_partner_profile.id is null then
    return json_build_object('success', false, 'message', 'Invalid partner code. No partner found with this code.');
  end if;

  -- Check if code is expired (2 days = 172800 seconds)
  if v_partner_profile.updated_at is not null then
    v_age_seconds := extract(epoch from (v_now - v_partner_profile.updated_at))::int;
    if v_age_seconds > 172800 then
      return json_build_object('success', false, 'message', 'This invite code has expired. Please ask your partner to generate a fresh code.');
    end if;
  end if;

  -- Check if partner is already connected with someone else
  if v_partner_profile.partner_id is not null and v_partner_profile.partner_id != v_user_id then
    return json_build_object('success', false, 'message', 'This partner is already connected to another space.');
  end if;

  -- Atomically link both profiles
  update public.profiles
  set partner_id = v_partner_profile.id,
      updated_at = v_now
  where id = v_user_id;

  update public.profiles
  set partner_id = v_user_id,
      updated_at = v_now
  where id = v_partner_profile.id;

  -- Delete prior couple records between these two users
  delete from public.couples
  where (user1_id = v_user_id and user2_id = v_partner_profile.id)
     or (user1_id = v_partner_profile.id and user2_id = v_user_id);

  -- Insert clean connected couple record
  insert into public.couples (user1_id, user2_id, status, connected_at, created_at)
  values (v_user_id, v_partner_profile.id, 'connected', v_now, v_now);

  return json_build_object(
    'success', true,
    'message', 'Successfully connected with your partner! 💕',
    'partner_id', v_partner_profile.id,
    'partner_name', v_partner_profile.full_name
  );
exception when others then
  return json_build_object('success', false, 'message', SQLERRM);
end;
$$;

grant execute on function public.connect_partner_code(text) to authenticated;

-- 5. Complete Account Deletion Function
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

  -- 1. Unlink any partner who has this user as partner_id
  update public.profiles
  set partner_id = null,
      updated_at = now()
  where partner_id = v_user_id;

  -- 2. Delete couple records
  delete from public.couples
  where user1_id = v_user_id or user2_id = v_user_id;

  -- 3. Delete from flag tables
  delete from public.flag_answers where user_id = v_user_id;
  delete from public.flag_votes where user_id = v_user_id;
  delete from public.flag_sessions where user_id = v_user_id or partner_id = v_user_id;

  -- 4. Delete memories and reactions
  delete from public.memory_reactions where user_id = v_user_id;
  delete from public.memories where created_by = v_user_id;

  -- 5. Delete chat messages
  delete from public.chat_messages where sender_id = v_user_id;

  -- 6. Delete quiz answers & sessions
  delete from public.quiz_answers
  where session_id in (
    select id from public.quiz_sessions
    where answerer_id = v_user_id or reviewer_id = v_user_id
  );
  delete from public.quiz_sessions
  where answerer_id = v_user_id or reviewer_id = v_user_id;

  -- 7. Delete 21 questions answers
  delete from public.twenty_one_questions_answers where user_id = v_user_id;

  -- 8. Delete couple challenge completions & progress
  delete from public.couple_challenge_completions where user_id = v_user_id;
  delete from public.couple_challenge_progress where user_a_id = v_user_id or user_b_id = v_user_id;

  -- 9. Delete secret crush messages
  delete from public.secret_crush_messages where sender_id = v_user_id;

  -- 10. Delete daily spark answers
  delete from public.spark_answers where user_id = v_user_id;

  -- 11. Delete user from profiles table
  delete from public.profiles where id = v_user_id;

  -- 12. Delete auth user from auth.users (cascades remaining auth rows)
  delete from auth.users where id = v_user_id;

  return json_build_object('success', true);
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;

grant execute on function public.delete_user_account() to authenticated;
