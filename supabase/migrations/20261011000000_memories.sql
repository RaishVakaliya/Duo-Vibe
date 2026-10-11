-- ==========================================
-- MEMORIES & MEMORY REACTIONS TABLE & STORAGE MIGRATION
-- ==========================================

-- 1. Helper function to derive current couple_key for authenticated user
create or replace function public.get_auth_couple_key()
returns text
language sql
stable
security definer
set search_path = public
as $$
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
  where p.id = auth.uid();
$$;

-- 2. Add anniversary_date to couples table
alter table public.couples add column if not exists anniversary_date date;

-- 3. Drop legacy dummy memories table if exists
drop table if exists public.memory_reactions cascade;
drop table if exists public.memories cascade;

-- 4. Create memories table
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  couple_key text not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  kind text not null default 'photo' check (kind in ('photo', 'result')),
  title text not null,
  note text,
  memory_date date not null default current_date,
  image_path text,          -- storage path, null for result memories
  payload jsonb,            -- used by kind='result' (e.g. {"type":"love_match","score":87})
  created_at timestamptz default now()
);

create index memories_couple_idx on public.memories(couple_key, memory_date desc);

-- 5. Create memory_reactions table
create table public.memory_reactions (
  memory_id uuid references public.memories(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (memory_id, user_id)
);

-- 6. Enable RLS
alter table public.memories enable row level security;
alter table public.memory_reactions enable row level security;

-- 7. Memories RLS Policies
create policy "Couple members can select memories"
  on public.memories for select
  to authenticated
  using (couple_key = public.get_auth_couple_key());

create policy "Couple members can insert memories"
  on public.memories for insert
  to authenticated
  with check (
    auth.uid() = created_by
    and couple_key = public.get_auth_couple_key()
  );

create policy "Creator can update memories"
  on public.memories for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Creator can delete memories"
  on public.memories for delete
  to authenticated
  using (auth.uid() = created_by);

-- 8. Memory Reactions RLS Policies
create policy "Couple members can select reactions"
  on public.memory_reactions for select
  to authenticated
  using (
    exists (
      select 1 from public.memories m
      where m.id = memory_reactions.memory_id
        and m.couple_key = public.get_auth_couple_key()
    )
  );

create policy "Couple members can insert their own reaction"
  on public.memory_reactions for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.memories m
      where m.id = memory_reactions.memory_id
        and m.couple_key = public.get_auth_couple_key()
    )
  );

create policy "Couple members can delete their own reaction"
  on public.memory_reactions for delete
  to authenticated
  using (auth.uid() = user_id);

-- 9. Realtime Publication
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.memory_reactions;

-- 10. Storage bucket and policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memories',
  'memories',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
on conflict (id) do update set public = false;

create policy "Couple members can read memory files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

create policy "Couple members can insert memory files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

create policy "Uploader can update memory files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

create policy "Uploader can delete memory files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );
