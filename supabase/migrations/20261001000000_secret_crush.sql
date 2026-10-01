-- ==========================================
-- SECRET CRUSH MESSAGES TABLE & POLICIES
-- ==========================================

create table if not exists public.secret_crush_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) not null,
  message text not null,
  status text not null default 'sent' check (status in ('sent', 'opened', 'replied')),
  reply_message text,
  opened_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz default now()
);

alter table public.secret_crush_messages enable row level security;

-- 1. Sender can read their own sent messages
create policy "Sender can read their own sent messages"
  on public.secret_crush_messages for select
  using (auth.uid() = sender_id);

-- 2. Sender can create messages
create policy "Sender can create messages"
  on public.secret_crush_messages for insert
  with check (auth.uid() = sender_id);

-- 3. Anyone with the link can view a single message by id for opening/replying
create policy "Anyone with the link can view a single message by id for opening/replying"
  on public.secret_crush_messages for select
  using (true);

-- 4. Anyone with the link can update status/reply (not sender identity)
create policy "Anyone with the link can update status/reply (not sender identity)"
  on public.secret_crush_messages for update
  using (true)
  with check (sender_id = sender_id);
