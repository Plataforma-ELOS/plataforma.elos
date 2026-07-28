-- Busca full-text (E8) no Acervo Digital.
--
-- array_to_string (usado para juntar o array `tags` num texto) é STABLE, não
-- IMMUTABLE — Postgres rejeita isso numa coluna GENERATED (a expressão
-- precisa ser IMMUTABLE). immutable_array_to_string é um wrapper simples
-- que assume a pureza (sem formatação locale-dependente na prática, já que
-- só junta palavras com espaço) e declara IMMUTABLE explicitamente —
-- caminho documentado do Postgres para este caso específico de full-text
-- search sobre um array de tags.
create or replace function public.immutable_array_to_string(arr text[])
returns text
language sql
immutable
as $$ select array_to_string(arr, ' ') $$;

alter table public.library_items
  add column search_vector tsvector generated always as (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(author_name, '') || ' ' || public.immutable_array_to_string(coalesce(tags, '{}')))
  ) stored;

create index idx_library_items_search on public.library_items using gin (search_vector);
