-- 우리집 자산흐름: Supabase 초기 스키마
-- Supabase Dashboard > SQL Editor에서 전체 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 50),
  invite_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  display_name text not null check (char_length(display_name) between 1 and 30),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id),
  unique (user_id)
);

create table if not exists public.finance_states (
  household_id uuid primary key references public.households(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  version bigint not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = auth.uid()
  );
$$;

revoke all on function public.is_household_member(uuid) from public;
grant execute on function public.is_household_member(uuid) to authenticated;

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.finance_states enable row level security;

drop policy if exists "members can read household" on public.households;
drop policy if exists "members can read members" on public.household_members;
drop policy if exists "members can read finance state" on public.finance_states;
drop policy if exists "members can update finance state" on public.finance_states;

create policy "members can read household"
on public.households for select
to authenticated
using (public.is_household_member(id));

create policy "members can read members"
on public.household_members for select
to authenticated
using (public.is_household_member(household_id));

create policy "members can read finance state"
on public.finance_states for select
to authenticated
using (public.is_household_member(household_id));

create policy "members can update finance state"
on public.finance_states for update
to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create or replace function public.create_household(
  p_name text,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_household_id uuid;
  v_invite_code text;
begin
  if v_user is null then
    raise exception '로그인이 필요합니다.';
  end if;
  if exists (select 1 from public.household_members where user_id = v_user) then
    raise exception '이미 연결된 가구가 있습니다.';
  end if;

  loop
    v_invite_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8));
    exit when not exists (select 1 from public.households where invite_code = v_invite_code);
  end loop;

  insert into public.households(name, invite_code, created_by)
  values (trim(p_name), v_invite_code, v_user)
  returning id into v_household_id;

  insert into public.household_members(household_id, user_id, role, display_name)
  values (v_household_id, v_user, 'owner', trim(p_display_name));

  insert into public.finance_states(household_id, state, version, updated_by)
  values (v_household_id, '{}'::jsonb, 0, v_user);

  return jsonb_build_object('household_id', v_household_id, 'invite_code', v_invite_code);
end;
$$;

create or replace function public.join_household(
  p_invite_code text,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_household public.households%rowtype;
begin
  if v_user is null then
    raise exception '로그인이 필요합니다.';
  end if;
  if exists (select 1 from public.household_members where user_id = v_user) then
    raise exception '이미 연결된 가구가 있습니다.';
  end if;

  select * into v_household
  from public.households
  where invite_code = upper(trim(p_invite_code));

  if v_household.id is null then
    raise exception '초대코드를 확인하세요.';
  end if;

  if (select count(*) from public.household_members where household_id = v_household.id) >= 2 then
    raise exception '이미 두 명이 연결된 가구입니다.';
  end if;

  insert into public.household_members(household_id, user_id, role, display_name)
  values (v_household.id, v_user, 'member', trim(p_display_name));

  return jsonb_build_object('household_id', v_household.id, 'name', v_household.name);
end;
$$;

drop function if exists public.save_finance_state(uuid,jsonb);
drop function if exists public.save_finance_state(uuid,jsonb,bigint);

create or replace function public.save_finance_state(
  p_household_id uuid,
  p_state jsonb,
  p_expected_version bigint
)
returns table(version bigint, updated_at timestamptz, conflict boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_version bigint;
  v_updated_at timestamptz;
begin
  if auth.uid() is null or not public.is_household_member(p_household_id) then
    raise exception '해당 가구의 데이터를 수정할 권한이 없습니다.';
  end if;

  update public.finance_states
  set state = p_state,
      version = finance_states.version + 1,
      updated_at = now(),
      updated_by = auth.uid()
  where household_id = p_household_id
    and finance_states.version = p_expected_version
  returning finance_states.version, finance_states.updated_at
  into v_version, v_updated_at;

  if found then
    return query select v_version, v_updated_at, false;
    return;
  end if;

  select fs.version, fs.updated_at
  into v_version, v_updated_at
  from public.finance_states fs
  where fs.household_id = p_household_id;

  return query select v_version, v_updated_at, true;
end;
$$;

revoke all on function public.create_household(text,text) from public;
revoke all on function public.join_household(text,text) from public;
revoke all on function public.save_finance_state(uuid,jsonb,bigint) from public;
grant execute on function public.create_household(text,text) to authenticated;
grant execute on function public.join_household(text,text) to authenticated;
grant execute on function public.save_finance_state(uuid,jsonb,bigint) to authenticated;

grant select on public.households to authenticated;
grant select on public.household_members to authenticated;
grant select, update on public.finance_states to authenticated;

alter table public.finance_states replica identity full;
alter table public.household_members replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'finance_states'
  ) then
    alter publication supabase_realtime add table public.finance_states;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'household_members'
  ) then
    alter publication supabase_realtime add table public.household_members;
  end if;
end $$;
