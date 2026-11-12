-- CELL 4 of 4 — Verification queries (read-only)

-- Confirm each user's Google connection is stored independently.
select
  p.user_id,
  coalesce(
    nullif(p.display_name, ''),
    concat_ws(' ', p.first_name, p.last_name)
  ) as person,
  g.connected_email,
  g.updated_at
from public.profiles p
left join public.google_calendar_connections g
  on g.user_id = p.user_id
where p.user_id in (
  'ce9b9a8e-66ae-4464-ad6c-7d7f51bd8884', -- Dylan
  'a12fd3c3-4977-414b-873a-eb27df74a9a1'  -- Ashley
)
order by person;

-- Confirm individual approvals and their current statuses.
select
  car.requester_user_id,
  rec.upline_user_id as approved_person_id,
  rec.status,
  car.created_at as request_created_at,
  rec.responded_at
from public.calendar_access_requests car
join public.calendar_access_request_recipients rec
  on rec.request_id = car.id
order by car.created_at desc, rec.created_at desc
limit 100;

-- Confirm centralized booking records by booking destination.
select
  booking_mode,
  count(*) as booking_count
from public.calendar_booking_records
group by booking_mode
order by booking_mode;
