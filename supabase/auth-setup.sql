create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null unique,
  requested_role text not null default 'admin',
  role text not null default 'admin',
  approval_status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_requested_role_check
    check (requested_role in ('admin', 'marketing', 'sales')),
  constraint profiles_role_check
    check (role in ('admin', 'marketing', 'sales')),
  constraint profiles_approval_status_check
    check (approval_status in ('pending', 'approved', 'rejected'))
);

create index if not exists profiles_approval_status_idx
  on public.profiles (approval_status);

create or replace function public.touch_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_profiles_updated on public.profiles;

create trigger on_profiles_updated
before update on public.profiles
for each row
execute function public.touch_profile_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role_value text;
begin
  requested_role_value := lower(
    coalesce(new.raw_user_meta_data ->> 'requested_role', 'admin')
  );

  if requested_role_value not in ('admin', 'marketing', 'sales') then
    requested_role_value := 'admin';
  end if;

  insert into public.profiles (
    id,
    full_name,
    email,
    requested_role,
    role
  )
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    new.email,
    requested_role_value,
    requested_role_value
  )
  on conflict (id) do update
    set
      full_name = excluded.full_name,
      email = excluded.email,
      requested_role = excluded.requested_role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Aprobar un usuario manualmente:
-- update public.profiles
-- set approval_status = 'approved', role = 'admin'
-- where email = 'usuario@empresa.com';

-- Rechazar un usuario manualmente:
-- update public.profiles
-- set approval_status = 'rejected'
-- where email = 'usuario@empresa.com';
