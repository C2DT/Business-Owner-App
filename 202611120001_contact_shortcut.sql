-- IBO iPhone Contact Shortcut: one-time pairing + atomic Customer/Prospect import.
-- Run in Supabase SQL Editor. Does not alter iboPIPV2 or the existing prospects table.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.contact_shortcut_pairings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_shortcut_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  label text not null default 'iPhone Contact Import',
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists contact_shortcut_pairings_user_idx
  on public.contact_shortcut_pairings(user_id, created_at desc);
create index if not exists contact_shortcut_tokens_user_idx
  on public.contact_shortcut_tokens(user_id, created_at desc);

alter table public.contact_shortcut_pairings enable row level security;
alter table public.contact_shortcut_tokens enable row level security;
revoke all on public.contact_shortcut_pairings from anon, authenticated;
revoke all on public.contact_shortcut_tokens from anon, authenticated;
grant all on public.contact_shortcut_pairings to service_role;
grant all on public.contact_shortcut_tokens to service_role;

-- Signed-in app creates a short-lived, single-use pairing code.
create or replace function public.create_contact_shortcut_pairing()
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_code text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  update public.contact_shortcut_pairings
     set consumed_at = coalesce(consumed_at, now())
   where user_id = auth.uid() and consumed_at is null;
  v_code := upper(encode(gen_random_bytes(16), 'hex'));
  insert into public.contact_shortcut_pairings(user_id, code_hash)
  values (auth.uid(), encode(digest(v_code, 'sha256'), 'hex'));
  return v_code;
end;
$$;
revoke all on function public.create_contact_shortcut_pairing() from public, anon;
grant execute on function public.create_contact_shortcut_pairing() to authenticated;

-- Exchange code for an opaque token. Called only by the Edge Function service role.
create or replace function public.exchange_contact_shortcut_pairing(p_code_hash text, p_token_hash text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_user uuid;
begin
  select user_id into v_user
    from public.contact_shortcut_pairings
   where code_hash = p_code_hash
     and consumed_at is null
     and expires_at > now()
   for update;
  if v_user is null then raise exception 'Pairing code is invalid, expired, or already used'; end if;
  update public.contact_shortcut_pairings set consumed_at = now()
   where code_hash = p_code_hash;
  insert into public.contact_shortcut_tokens(user_id, token_hash)
  values (v_user, p_token_hash);
  return v_user;
end;
$$;
revoke all on function public.exchange_contact_shortcut_pairing(text,text) from public, anon, authenticated;
grant execute on function public.exchange_contact_shortcut_pairing(text,text) to service_role;

-- Import into the existing iboOutreachV5 payload. Row lock prevents two devices
-- from overwriting each other's concurrent contact additions. Only contacts[] changes.
create or replace function public.apply_contact_shortcut_import(
  p_token_hash text,
  p_name text,
  p_phone text,
  p_list_type text,
  p_duplicate_action text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_payload jsonb;
  v_contacts jsonb;
  v_contact jsonb;
  v_existing jsonb;
  v_phone_key text;
  v_existing_key text;
  v_category text;
  v_new jsonb;
  v_now timestamptz := now();
  v_id text;
begin
  select user_id into v_user
    from public.contact_shortcut_tokens
   where token_hash = p_token_hash and revoked_at is null;
  if v_user is null then raise exception 'Shortcut is not connected. Reconnect it in IBO App.'; end if;

  if length(trim(coalesce(p_name,''))) = 0 then raise exception 'Contact name is required'; end if;
  if length(regexp_replace(coalesce(p_phone,''), '\D', '', 'g')) < 7 then raise exception 'A valid phone number is required'; end if;
  if p_list_type is null or p_list_type not in ('customer','prospect') then raise exception 'Choose Customer or Prospect'; end if;
  v_category := case when p_list_type = 'customer' then 'potential' else 'C list in person' end;
  v_phone_key := regexp_replace(p_phone, '\D', '', 'g');

  -- Lock the user's existing app-state row, or create an empty compatible payload.
  select payload into v_payload
    from public.user_app_state
   where user_id = v_user and data_key = 'iboOutreachV5'
   for update;
  if not found then
    v_payload := jsonb_build_object('contacts','[]'::jsonb,'settings','{}'::jsonb,'assignments','[]'::jsonb,'currentPlanSessionId',null);
    insert into public.user_app_state(user_id,data_key,payload,updated_at)
    values(v_user,'iboOutreachV5',v_payload,v_now)
    on conflict (user_id,data_key) do nothing;
    select payload into v_payload from public.user_app_state
     where user_id=v_user and data_key='iboOutreachV5' for update;
  end if;
  if jsonb_typeof(v_payload) <> 'object' then raise exception 'Existing contact backup has an unexpected format'; end if;
  if v_payload ? 'contacts' and jsonb_typeof(v_payload->'contacts') <> 'array' then
    raise exception 'Existing contact list has an unexpected format; no data was changed';
  end if;
  v_contacts := coalesce(v_payload->'contacts', '[]'::jsonb);

  for v_contact in select value from jsonb_array_elements(v_contacts) loop
    v_existing_key := regexp_replace(coalesce(v_contact->>'phone',''), '\D', '', 'g');
    if v_existing_key <> '' and (v_existing_key = v_phone_key or (length(v_existing_key)>=10 and length(v_phone_key)>=10 and right(v_existing_key,10)=right(v_phone_key,10))) then
      v_existing := v_contact; exit;
    end if;
  end loop;

  update public.contact_shortcut_tokens set last_used_at=v_now where token_hash=p_token_hash;

  if v_existing is not null then
    if coalesce(v_existing->>'listType','customer') = p_list_type and coalesce(v_existing->>'category','') = v_category then
      return jsonb_build_object('status','already_exists','name',coalesce(v_existing->>'name',p_name),'listType',p_list_type,'category',v_category);
    end if;
    if p_duplicate_action is distinct from 'update' then
      return jsonb_build_object('status','duplicate','name',coalesce(v_existing->>'name',p_name),'currentListType',coalesce(v_existing->>'listType','customer'),'currentCategory',coalesce(v_existing->>'category',''),'requestedListType',p_list_type,'requestedCategory',v_category,'contactId',v_existing->>'id');
    end if;
    v_contacts := (
      select coalesce(jsonb_agg(
        case when value->>'id'=v_existing->>'id'
          then value || jsonb_build_object('listType',p_list_type,'category',v_category,'status','active',
            'history',coalesce(value->'history','[]'::jsonb) || jsonb_build_array(jsonb_build_object('date',v_now,'action','Classification updated from iPhone Shortcut')))
          else value end
      ),'[]'::jsonb) from jsonb_array_elements(v_contacts)
    );
    v_payload := jsonb_set(v_payload,'{contacts}',v_contacts,true);
    update public.user_app_state set payload=v_payload,updated_at=v_now
     where user_id=v_user and data_key='iboOutreachV5';
    return jsonb_build_object('status','updated','name',coalesce(v_existing->>'name',p_name),'listType',p_list_type,'category',v_category);
  end if;

  v_id := 'c' || replace(gen_random_uuid()::text,'-','');
  v_new := jsonb_build_object(
    'id',v_id,'name',trim(p_name),'phone',trim(p_phone),'birthday','','category',v_category,
    'listType',p_list_type,'status','active','notes','','history','[]'::jsonb,
    'callbackDate','','callbackDateTime','','followupDateTime','','cnaDateTime','','meetingDate','',
    'createdAt',v_now
  );
  v_contacts := jsonb_build_array(v_new) || v_contacts;
  v_payload := jsonb_set(v_payload,'{contacts}',v_contacts,true);
  update public.user_app_state set payload=v_payload,updated_at=v_now
   where user_id=v_user and data_key='iboOutreachV5';
  return jsonb_build_object('status','created','id',v_id,'name',trim(p_name),'listType',p_list_type,'category',v_category);
end;
$$;
revoke all on function public.apply_contact_shortcut_import(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.apply_contact_shortcut_import(text,text,text,text,text) to service_role;

create or replace function public.revoke_contact_shortcut_tokens()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  update public.contact_shortcut_tokens set revoked_at=now()
   where user_id=auth.uid() and revoked_at is null;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
revoke all on function public.revoke_contact_shortcut_tokens() from public, anon;
grant execute on function public.revoke_contact_shortcut_tokens() to authenticated;
