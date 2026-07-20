-- 우리집 자산흐름 v3: 로그인 없는 기기 등록·공유·변경 로그
-- Supabase Dashboard > SQL Editor에서 전체 실행

create extension if not exists pgcrypto;

create table if not exists public.cf_spaces (
  space_code text primary key,
  secret_hash text not null,
  state jsonb not null default '{}'::jsonb,
  version bigint not null default 0,
  updated_at timestamptz not null default now(),
  updated_by text not null default 'system',
  updated_device text
);

create table if not exists public.cf_audit_logs (
  id bigint generated always as identity primary key,
  space_code text not null references public.cf_spaces(space_code) on delete cascade,
  actor text not null,
  device_id text,
  action text not null check (action in ('create','update','delete','connect','system')),
  entity_type text not null,
  entity_id text,
  summary text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cf_audit_logs_space_created_idx
  on public.cf_audit_logs(space_code, created_at desc);

alter table public.cf_spaces enable row level security;
alter table public.cf_audit_logs enable row level security;

create or replace function public.cf_create_space(
  p_space_code text,
  p_secret_hash text,
  p_actor text,
  p_device_id text,
  p_initial_state jsonb
)
returns table(space_code text, version bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if trim(p_space_code) = '' or trim(p_secret_hash) = '' then
    raise exception '공유코드가 올바르지 않습니다.';
  end if;

  insert into public.cf_spaces(space_code, secret_hash, state, version, updated_by, updated_device)
  values (upper(trim(p_space_code)), p_secret_hash, coalesce(p_initial_state, '{}'::jsonb), 1, trim(p_actor), p_device_id);

  insert into public.cf_audit_logs(space_code, actor, device_id, action, entity_type, summary, after_data)
  values (upper(trim(p_space_code)), trim(p_actor), p_device_id, 'create', 'space', '공유공간 생성', p_initial_state);

  return query select upper(trim(p_space_code)), 1::bigint;
end;
$$;

create or replace function public.cf_read_space(
  p_space_code text,
  p_secret_hash text
)
returns table(state jsonb, version bigint, updated_at timestamptz, updated_by text)
language sql
security definer
set search_path = public
as $$
  select s.state, s.version, s.updated_at, s.updated_by
  from public.cf_spaces s
  where s.space_code = upper(trim(p_space_code))
    and s.secret_hash = p_secret_hash;
$$;

create or replace function public.cf_connect_device(
  p_space_code text,
  p_secret_hash text,
  p_actor text,
  p_device_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.cf_spaces s
    where s.space_code = upper(trim(p_space_code))
      and s.secret_hash = p_secret_hash
  ) then
    return false;
  end if;

  insert into public.cf_audit_logs(space_code, actor, device_id, action, entity_type, summary)
  values (upper(trim(p_space_code)), trim(p_actor), p_device_id, 'connect', 'device', '기기 연결');

  return true;
end;
$$;

create or replace function public.cf_write_space(
  p_space_code text,
  p_secret_hash text,
  p_expected_version bigint,
  p_state jsonb,
  p_actor text,
  p_device_id text,
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_summary text,
  p_before_data jsonb,
  p_after_data jsonb
)
returns table(version bigint, conflict boolean, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_space public.cf_spaces%rowtype;
begin
  select * into v_space
  from public.cf_spaces s
  where s.space_code = upper(trim(p_space_code))
    and s.secret_hash = p_secret_hash
  for update;

  if v_space.space_code is null then
    raise exception '공유공간을 찾을 수 없습니다.';
  end if;

  if v_space.version <> p_expected_version then
    return query select v_space.version, true, v_space.updated_at;
    return;
  end if;

  update public.cf_spaces
  set state = p_state,
      version = version + 1,
      updated_at = now(),
      updated_by = trim(p_actor),
      updated_device = p_device_id
  where space_code = v_space.space_code
  returning cf_spaces.version, cf_spaces.updated_at
  into v_space.version, v_space.updated_at;

  insert into public.cf_audit_logs(
    space_code, actor, device_id, action, entity_type, entity_id,
    summary, before_data, after_data
  ) values (
    v_space.space_code, trim(p_actor), p_device_id, p_action, p_entity_type,
    p_entity_id, p_summary, p_before_data, p_after_data
  );

  return query select v_space.version, false, v_space.updated_at;
end;
$$;

create or replace function public.cf_read_logs(
  p_space_code text,
  p_secret_hash text,
  p_limit integer default 100
)
returns table(
  id bigint,
  actor text,
  device_id text,
  action text,
  entity_type text,
  entity_id text,
  summary text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select l.id, l.actor, l.device_id, l.action, l.entity_type, l.entity_id,
         l.summary, l.before_data, l.after_data, l.created_at
  from public.cf_audit_logs l
  join public.cf_spaces s on s.space_code = l.space_code
  where l.space_code = upper(trim(p_space_code))
    and s.secret_hash = p_secret_hash
  order by l.created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 500));
$$;

revoke all on function public.cf_create_space(text,text,text,text,jsonb) from public;
revoke all on function public.cf_read_space(text,text) from public;
revoke all on function public.cf_connect_device(text,text,text,text) from public;
revoke all on function public.cf_write_space(text,text,bigint,jsonb,text,text,text,text,text,text,jsonb,jsonb) from public;
revoke all on function public.cf_read_logs(text,text,integer) from public;

grant execute on function public.cf_create_space(text,text,text,text,jsonb) to anon, authenticated;
grant execute on function public.cf_read_space(text,text) to anon, authenticated;
grant execute on function public.cf_connect_device(text,text,text,text) to anon, authenticated;
grant execute on function public.cf_write_space(text,text,bigint,jsonb,text,text,text,text,text,text,jsonb,jsonb) to anon, authenticated;
grant execute on function public.cf_read_logs(text,text,integer) to anon, authenticated;
