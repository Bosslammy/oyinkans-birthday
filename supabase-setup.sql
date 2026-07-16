-- ════════════════════════════════════════════════════════════════════
-- Run this once in your Supabase project → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════════

-- Table: wishes (from the Wishes page)
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Table: gallery_photos (from the Gallery upload)
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null,
  uploader_name text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table wishes enable row level security;
alter table gallery_photos enable row level security;

-- This site auto-publishes, so anyone with the link can insert AND read.
-- That's expected — only share the link with people you trust.
create policy "Public can add wishes" on wishes
  for insert to anon with check (true);

create policy "Public can read wishes" on wishes
  for select to anon using (true);

create policy "Public can add gallery photos" on gallery_photos
  for insert to anon with check (true);

create policy "Public can read gallery photos" on gallery_photos
  for select to anon using (true);

-- ════════════════════════════════════════════════════════════════════
-- After running the above, create two STORAGE buckets from the
-- Storage tab in the dashboard (not this SQL editor):
--   1. wish-photos     → Public bucket: ON
--   2. gallery-photos  → Public bucket: ON
--
-- Then come back here and run the policies below so people can
-- actually upload into those buckets (public = readable, but
-- uploading needs its own policy):
-- ════════════════════════════════════════════════════════════════════

create policy "Public can upload wish photos" on storage.objects
  for insert to anon with check (bucket_id = 'wish-photos');

create policy "Public can view wish photos" on storage.objects
  for select to anon using (bucket_id = 'wish-photos');

create policy "Public can upload gallery photos" on storage.objects
  for insert to anon with check (bucket_id = 'gallery-photos');

create policy "Public can view gallery photos" on storage.objects
  for select to anon using (bucket_id = 'gallery-photos');
