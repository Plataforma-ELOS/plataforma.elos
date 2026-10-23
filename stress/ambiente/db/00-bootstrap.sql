-- Reproduz o mínimo da plataforma Supabase que as migrations do projeto
-- pressupõem, para elas rodarem num Postgres comum:
--   * papéis anon / authenticated / service_role / authenticator
--   * schema auth com auth.users e auth.uid()
--   * schema storage com buckets/objects e storage.foldername()
--   * publicação supabase_realtime
-- Nada disto existe em produção com esta forma: é só o "chão" que o Supabase
-- já entrega pronto e que aqui precisa ser simulado.

create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;
create role authenticator login noinherit password 'authenticator';
grant anon, authenticated, service_role to authenticator;

-- Mesmos privilégios padrão que o Supabase concede no schema public; quem
-- restringe de verdade é a RLS das migrations.
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

-- ---------------------------------------------------------------- auth
create schema auth;
grant usage on schema auth to anon, authenticated, service_role;

create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  raw_app_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- O PostgREST grava as claims do JWT em request.jwt.claims; o "sub" é o id
-- do usuário. Sem JWT de usuário (tráfego anônimo), devolve null.
create function auth.uid() returns uuid
language sql stable
as $$
  select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid
$$;
grant execute on function auth.uid() to anon, authenticated, service_role;

-- ---------------------------------------------------------------- storage
create schema storage;
grant usage on schema storage to anon, authenticated, service_role;

create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  file_size_limit bigint,
  allowed_mime_types text[],
  created_at timestamptz not null default now()
);

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text,
  owner uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table storage.objects enable row level security;

create function storage.foldername(name text) returns text[]
language sql immutable
as $$
  select (string_to_array(name, '/'))[1:greatest(array_length(string_to_array(name, '/'), 1) - 1, 0)]
$$;

-- ---------------------------------------------------------------- realtime
create publication supabase_realtime;
