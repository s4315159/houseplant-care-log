-- =============================================================================
--  Houseplant Care & Watering Log — Database schema
-- =============================================================================
--  Run this script once in your Supabase project:
--    Supabase dashboard > SQL Editor > New query > paste > Run.
--
--  It creates the "plants" table and Row Level Security (RLS) policies that
--  guarantee each user can only ever see and modify their OWN plants, even
--  though the frontend uses the public anon key.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. The plants table
-- ---------------------------------------------------------------------------
create table if not exists public.plants (
  id          uuid primary key default gen_random_uuid(),
  -- Links every plant to the authenticated user who created it.
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null,                 -- plant name / species
  location    text not null,                 -- room location, e.g. "Living room"
  status      text not null default 'Healthy'
              check (status in ('Healthy', 'Needs Watering', 'Dormant')),
  notes       text,                          -- optional care instructions
  created_at  timestamptz not null default now()  -- used as "date added"
);

-- Index to speed up the common "all of my plants, newest first" query.
create index if not exists plants_user_id_created_at_idx
  on public.plants (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.plants enable row level security;

-- SELECT: a user may read only rows they own.
create policy "Users can view their own plants"
  on public.plants for select
  using (auth.uid() = user_id);

-- INSERT: a user may only create rows assigned to themselves.
create policy "Users can insert their own plants"
  on public.plants for insert
  with check (auth.uid() = user_id);

-- UPDATE: a user may only modify rows they own.
create policy "Users can update their own plants"
  on public.plants for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: a user may only delete rows they own.
create policy "Users can delete their own plants"
  on public.plants for delete
  using (auth.uid() = user_id);
