-- Busca full-text (E8/E2) em /profissionais — mesmo padrão já usado em
-- library_items (migration add_library_items_search_vector). Sem coluna
-- array envolvida aqui, então não precisa do wrapper immutable_array_to_string.
alter table public.professionals
  add column search_vector tsvector generated always as (
    to_tsvector('portuguese', coalesce(display_name, '') || ' ' || coalesce(specialty, '') || ' ' || coalesce(description, ''))
  ) stored;

create index idx_professionals_search on public.professionals using gin (search_vector);

alter table public.clinics
  add column search_vector tsvector generated always as (
    to_tsvector('portuguese', coalesce(name, '') || ' ' || coalesce(specialty, '') || ' ' || coalesce(description, ''))
  ) stored;

create index idx_clinics_search on public.clinics using gin (search_vector);
