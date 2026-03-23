-- 00001_profiles.sql
-- User profiles synced from auth.users via trigger

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  email       text,
  avatar_url  text,
  notify_email       boolean not null default true,
  notify_in_app      boolean not null default true,
  notify_mentions    boolean not null default true,
  notify_assignments boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger: auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Trigger: update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute function public.update_updated_at();
