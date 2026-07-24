-- elos_0001_structure
-- Reconstruído por introspecção do schema em produção (Supabase MCP,
-- read-only) para sincronizar supabase/migrations/ com o histórico já
-- aplicado remotamente. Ver supabase/migrations/README.md para o método e
-- as limitações desta reconstrução.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_stat_statements";

-- ==================== ENUMS ====================
create type public.user_role as enum ('caregiver', 'professional', 'clinic', 'admin');
create type public.font_size as enum ('sm', 'base', 'lg');
create type public.verification_status as enum ('pending', 'verified', 'rejected');
create type public.professional_kind as enum ('liberal', 'clinic_professional', 'clinic');
create type public.event_type as enum ('online', 'presencial');
create type public.news_category as enum ('legislacao', 'tecnologia', 'saude', 'comunidade');
create type public.library_type as enum ('video', 'document', 'game', 'other');

-- ==================== PROFILES ====================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'caregiver',
  avatar_url text,
  font_size public.font_size not null default 'base',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==================== CLINICS / PROFESSIONALS ====================
create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  specialty text,
  description text,
  cnpj text,
  phone text,
  email text,
  image_url text,
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  clinic_id uuid references public.clinics(id) on delete set null,
  kind public.professional_kind not null default 'liberal',
  display_name text not null,
  specialty text,
  registration_number text,
  cnpj text,
  description text,
  phone text,
  email text,
  instagram text,
  image_url text,
  verification_status public.verification_status not null default 'pending',
  rating_avg numeric not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professional_skills (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  skill text not null
);

create table public.professional_experiences (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  description text not null,
  sort_order integer not null default 0
);

-- ==================== COMUNIDADE (posts, comments, likes, saves) ====================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

create table public.post_saves (
  post_id uuid not null references public.posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

-- ==================== GRUPOS ====================
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, profile_id)
);

-- ==================== EVENTOS ====================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  type public.event_type not null default 'online',
  location text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ==================== NOTÍCIAS ====================
create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  content text,
  image_url text,
  image_hint text,
  category public.news_category,
  author_name text,
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ==================== ACERVO DIGITAL ====================
create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  type public.library_type not null default 'document',
  title text not null,
  author_name text,
  image_url text,
  action_url text,
  downloadable boolean not null default false,
  tags text[] not null default '{}',
  suggested_by uuid references public.profiles(id) on delete set null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.library_favorites (
  item_id uuid not null references public.library_items(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (item_id, profile_id)
);

-- ==================== GAMIFICAÇÃO ====================
create table public.knowledge_pills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text,
  created_at timestamptz not null default now()
);

create table public.knowledge_trails (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.trail_progress (
  trail_id uuid not null references public.knowledge_trails(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  updated_at timestamptz not null default now(),
  primary key (trail_id, profile_id)
);

-- ==================== AVALIAÇÕES ====================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professionals(id) on delete cascade,
  clinic_id uuid references public.clinics(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text,
  score_atendimento numeric check (score_atendimento >= 0 and score_atendimento <= 5),
  score_empatia numeric check (score_empatia >= 0 and score_empatia <= 5),
  score_clareza numeric check (score_clareza >= 0 and score_clareza <= 5),
  score_organizacao numeric check (score_organizacao >= 0 and score_organizacao <= 5),
  likes integer not null default 0,
  created_at timestamptz not null default now(),
  constraint review_one_target check (((professional_id is not null)::int + (clinic_id is not null)::int) = 1),
  constraint uq_review_prof unique (professional_id, author_id),
  constraint uq_review_clinic unique (clinic_id, author_id)
);

-- ==================== CONTATO ====================
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2 and char_length(name) <= 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  subject text check (subject is null or char_length(subject) <= 160),
  message text not null check (char_length(message) >= 10 and char_length(message) <= 4000),
  created_at timestamptz not null default now()
);

-- ==================== CUIDADOR (dependentes, diário) ====================
create table public.dependents (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  birth_year integer check (birth_year >= 1900 and birth_year <= 2100),
  relationship text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.caregiver_journal (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null default current_date,
  mood text,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==================== ÍNDICES ====================
create index idx_clinics_owner on public.clinics (owner_id);
create index idx_professionals_owner on public.professionals (owner_id);
create index idx_professionals_clinic on public.professionals (clinic_id);
create index idx_professionals_specialty on public.professionals (specialty);
create index idx_prof_skill_prof on public.professional_skills (professional_id);
create index idx_prof_exp_prof on public.professional_experiences (professional_id);
create index idx_posts_author on public.posts (author_id);
create index idx_posts_created on public.posts (created_at desc);
create index idx_comments_post on public.comments (post_id);
create index idx_comments_author on public.comments (author_id);
create index idx_post_likes_profile on public.post_likes (profile_id);
create index idx_post_saves_profile on public.post_saves (profile_id);
create index idx_groups_created_by on public.groups (created_by);
create index idx_group_members_profile on public.group_members (profile_id);
create index idx_events_created_by on public.events (created_by);
create index idx_events_starts on public.events (starts_at);
create index idx_library_items_suggested on public.library_items (suggested_by);
create index idx_library_approved on public.library_items (approved);
create index idx_library_favorites_profile on public.library_favorites (profile_id);
create index idx_trail_progress_profile on public.trail_progress (profile_id);
create index idx_reviews_prof on public.reviews (professional_id);
create index idx_reviews_clinic on public.reviews (clinic_id);
create index idx_reviews_author on public.reviews (author_id);
create index idx_dependents_caregiver on public.dependents (caregiver_id);
create index idx_journal_caregiver on public.caregiver_journal (caregiver_id);

-- ==================== FUNCTIONS + TRIGGERS ====================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'caregiver')
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_clinics_updated before update on public.clinics for each row execute function public.set_updated_at();
create trigger trg_professionals_updated before update on public.professionals for each row execute function public.set_updated_at();
create trigger trg_posts_updated before update on public.posts for each row execute function public.set_updated_at();
create trigger trg_dependents_updated before update on public.dependents for each row execute function public.set_updated_at();
create trigger trg_journal_updated before update on public.caregiver_journal for each row execute function public.set_updated_at();

create or replace function public.refresh_professional_rating()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  target uuid := coalesce(new.professional_id, old.professional_id);
begin
  if target is not null then
    update public.professionals p
    set rating_count = sub.cnt,
        rating_avg   = coalesce(sub.avg_r, 0)
    from (
      select count(*) cnt, round(avg(rating)::numeric,1) avg_r
      from public.reviews where professional_id = target
    ) sub
    where p.id = target;
  end if;
  return null;
end;
$function$;

create trigger trg_reviews_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_professional_rating();
