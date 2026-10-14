-- =====================================================================
-- CHAT-IMAGES PRIVATE STORAGE BUCKET & AVATARS STORAGE BUCKET MIGRATION
-- =====================================================================

-- 1. Create 'chat-images' private storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-images',
  'chat-images',
  false,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
on conflict (id) do update set public = false;

-- 2. 'chat-images' RLS Policies (couple members only, folder = couple_key)
create policy "Couple members can read chat images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

create policy "Couple members can insert chat images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

create policy "Uploader can update chat images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

create policy "Uploader can delete chat images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = public.get_auth_couple_key()
  );

-- 3. Create 'avatars' public storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
on conflict (id) do update set public = true;

-- 4. 'avatars' RLS Policies
create policy "Public can read avatars"
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
