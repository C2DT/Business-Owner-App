-- CELL 3 of 4 — Submit calendar-access requests to selected people
-- Allows an active sponsor-upline person OR the active partner of someone
-- in that upline. Every selected person receives their own approval request.

create or replace function public.submit_calendar_access_request(
  p_upline_user_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  requester uuid := auth.uid();
  new_request_id uuid;
  invalid_count integer;
begin
  if requester is null then
    raise exception 'You must be signed in.';
  end if;

  if p_upline_user_ids is null
     or cardinality(p_upline_user_ids) = 0 then
    raise exception 'Select at least one upline or partner.';
  end if;

  with recursive upline(user_id, path) as (
    select sr.sponsor_user_id,
           array[requester, sr.sponsor_user_id]::uuid[]
      from public.sponsor_relationships sr
     where sr.user_id = requester
       and sr.status = 'active'

    union all

    select sr.sponsor_user_id,
           u.path || sr.sponsor_user_id
      from public.sponsor_relationships sr
      join upline u on sr.user_id = u.user_id
     where sr.status = 'active'
       and not sr.sponsor_user_id = any(u.path)
  ),
  allowed(user_id) as (
    select user_id from upline

    union

    select partner.user_id
      from upline u
      join public.business_partnership_members leader
        on leader.user_id = u.user_id
       and leader.membership_status = 'active'
      join public.business_partnerships bp
        on bp.id = leader.partnership_id
       and bp.status = 'active'
      join public.business_partnership_members partner
        on partner.partnership_id = bp.id
       and partner.membership_status = 'active'
     where partner.user_id <> u.user_id
  )
  select count(*)
    into invalid_count
    from unnest(p_upline_user_ids) as selected(user_id)
   where not exists (
     select 1 from allowed where allowed.user_id = selected.user_id
   );

  if invalid_count > 0 then
    raise exception
      'One or more selected people are not in your active upline or an active upline partnership.';
  end if;

  insert into public.calendar_access_requests(requester_user_id)
  values (requester)
  returning id into new_request_id;

  insert into public.calendar_access_request_recipients(
    request_id,
    upline_user_id,
    status
  )
  select new_request_id, person_id, 'pending'
    from (
      select distinct unnest(p_upline_user_ids) as person_id
    ) selected_people;

  return new_request_id;
end;
$function$;

revoke all on function public.submit_calendar_access_request(uuid[]) from public;
grant execute on function public.submit_calendar_access_request(uuid[]) to authenticated;
