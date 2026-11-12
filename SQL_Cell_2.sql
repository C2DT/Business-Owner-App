-- CELL 2 of 4 — Upline and active spouse/partner directory
-- Returns each person individually. It does not merge or infer shared calendars.

create or replace function public.get_my_team_facilitators()
returns table (
  id uuid,
  first_name text,
  last_name text,
  full_name text,
  depth integer
)
language sql
stable
security definer
set search_path = ''
as $function$
with recursive upline(user_id, depth, path) as (
  select sr.sponsor_user_id,
         1,
         array[(select auth.uid()), sr.sponsor_user_id]::uuid[]
    from public.sponsor_relationships sr
   where sr.user_id = (select auth.uid())
     and sr.status = 'active'

  union all

  select sr.sponsor_user_id,
         u.depth + 1,
         u.path || sr.sponsor_user_id
    from public.sponsor_relationships sr
    join upline u on sr.user_id = u.user_id
   where sr.status = 'active'
     and not sr.sponsor_user_id = any(u.path)
),
candidates as (
  select user_id, depth from upline

  union

  select partner.user_id, u.depth
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
),
ranked as (
  select user_id, min(depth) as depth
    from candidates
   group by user_id
)
select p.user_id as id,
       p.first_name,
       p.last_name,
       coalesce(
         nullif(p.display_name, ''),
         concat_ws(' ', p.first_name, p.last_name)
       ) as full_name,
       ranked.depth
  from ranked
  join public.profiles p on p.user_id = ranked.user_id
 order by ranked.depth, full_name;
$function$;

revoke all on function public.get_my_team_facilitators() from public;
grant execute on function public.get_my_team_facilitators() to authenticated;
