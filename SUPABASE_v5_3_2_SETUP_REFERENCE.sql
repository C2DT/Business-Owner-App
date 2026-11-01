-- IBO App v5.3.1: private per-user cloud backup for app sections
-- Run this in Supabase SQL Editor before publishing the updated index.html.
-- This table stores each user's app sections as JSONB. It does not grant upline access.

create table if not exists public.user_app_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  data_key text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint user_app_state_pkey primary key (user_id, data_key),
  constraint user_app_state_data_key_length check (char_length(data_key) between 1 and 120)
);

alter table public.user_app_state enable row level security;

drop policy if exists "Users can read their own app state" on public.user_app_state;
create policy "Users can read their own app state"
  on public.user_app_state for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own app state" on public.user_app_state;
create policy "Users can insert their own app state"
  on public.user_app_state for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own app state" on public.user_app_state;
create policy "Users can update their own app state"
  on public.user_app_state for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.user_app_state from anon, public;
grant select, insert, update on table public.user_app_state to authenticated;

create index if not exists user_app_state_updated_at_idx
  on public.user_app_state (user_id, updated_at desc);

-- Intentionally no DELETE policy: cloud backups are not silently erased by a client.
