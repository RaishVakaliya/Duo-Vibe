-- ==========================================
-- CHAT MESSAGES TABLE & POLICIES
-- ==========================================
-- couple_key uses the same convention as couple_challenge_progress:
-- alphabetically sorted concatenation of both partner user IDs joined by "_"

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  couple_key text not null,
  sender_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Composite index for efficient ordered fetching by couple
create index if not exists chat_messages_couple_key_idx
  on public.chat_messages(couple_key, created_at desc);

alter table public.chat_messages enable row level security;

-- 1. Couple members can read messages in their couple_key bucket
--    We derive partner_id from the profiles table (same as getPartnerId in the app).
--    Falls back to couples table if profile.partner_id is NULL (matches app logic).
create policy "Couple members can read their messages"
  on public.chat_messages for select
  using (
    auth.uid() = sender_id
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

-- 2. Sender can insert messages (must match their own auth id)
create policy "Sender can insert messages to their couple"
  on public.chat_messages for insert
  with check (auth.uid() = sender_id);

-- 3. Recipient (not sender) can mark messages as read
create policy "Recipient can mark messages as read"
  on public.chat_messages for update
  using (auth.uid() != sender_id);
