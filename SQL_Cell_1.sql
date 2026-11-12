-- CELL 1 of 4 — Central booking statistics
-- Safe to run after the existing calendar tables are in place.
-- This table records who booked, who facilitated, and whose primary calendar was used.

create table if not exists public.calendar_booking_records (
  id uuid primary key default gen_random_uuid(),
  booking_user_id uuid not null references auth.users(id) on delete cascade,
  facilitator_user_id uuid references auth.users(id) on delete set null,
  facilitator_name text,
  calendar_owner_user_id uuid references auth.users(id) on delete set null,
  booking_reference text not null,
  google_calendar_id text,
  google_event_id text,
  google_event_link text,
  booking_mode text not null check (booking_mode in ('own','upline','ics')),
  prospect_name text,
  meeting_type text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Compatibility if the earlier experimental v5.3.73 resource migration was
-- already run: these columns are not needed by the primary-calendar design.
do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema='public' and table_name='calendar_booking_records'
       and column_name='calendar_resource_id'
  ) then
    alter table public.calendar_booking_records
      alter column calendar_resource_id drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
     where table_schema='public' and table_name='calendar_booking_records'
       and column_name='calendar_owner_user_id'
  ) then
    alter table public.calendar_booking_records
      alter column calendar_owner_user_id drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
     where table_schema='public' and table_name='calendar_booking_records'
       and column_name='google_calendar_id'
  ) then
    alter table public.calendar_booking_records
      alter column google_calendar_id drop not null;
  end if;
end $$;

alter table public.calendar_booking_records
  add column if not exists facilitator_name text,
  add column if not exists booking_reference text,
  add column if not exists prospect_name text,
  add column if not exists meeting_type text,
  add column if not exists google_calendar_id text,
  add column if not exists google_event_link text;

update public.calendar_booking_records
   set booking_reference = id::text
 where booking_reference is null;

alter table public.calendar_booking_records
  alter column booking_reference set not null;

-- Replace any earlier two-value booking_mode check with the three supported modes.
do $$
declare c record;
begin
  for c in
    select conname
      from pg_constraint
     where conrelid = 'public.calendar_booking_records'::regclass
       and contype = 'c'
       and pg_get_constraintdef(oid) ilike '%booking_mode%'
  loop
    execute format('alter table public.calendar_booking_records drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.calendar_booking_records
  add constraint calendar_booking_records_mode_check
  check (booking_mode in ('own','upline','ics'));

create unique index if not exists calendar_booking_records_booking_reference_uq
  on public.calendar_booking_records(booking_user_id, booking_reference, booking_mode);

create unique index if not exists calendar_booking_records_google_event_uq
  on public.calendar_booking_records(google_event_id)
  where google_event_id is not null;

create index if not exists idx_calendar_booking_facilitator
  on public.calendar_booking_records(facilitator_user_id, starts_at desc);

create index if not exists idx_calendar_booking_user
  on public.calendar_booking_records(booking_user_id, starts_at desc);

alter table public.calendar_booking_records enable row level security;

drop policy if exists "Users can read own or facilitated calendar bookings"
  on public.calendar_booking_records;

create policy "Users can read own or facilitated calendar bookings"
on public.calendar_booking_records
for select to authenticated
using (
  booking_user_id = (select auth.uid())
  or facilitator_user_id = (select auth.uid())
  or calendar_owner_user_id = (select auth.uid())
);

grant select on public.calendar_booking_records to authenticated;
