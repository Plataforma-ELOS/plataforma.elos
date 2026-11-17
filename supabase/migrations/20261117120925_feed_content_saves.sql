-- Salvar conteúdos do Acervo (feed_contents) para ver depois em /salvos —
-- substitui os favoritos do formato antigo (library_favorites), que o
-- Acervo não mostra mais. Mesmo padrão de post_saves.
create table public.feed_content_saves (
  content_id uuid not null references public.feed_contents(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (content_id, profile_id)
);

create index feed_content_saves_profile_id_idx on public.feed_content_saves (profile_id);

alter table public.feed_content_saves enable row level security;

-- Cada pessoa só vê e mexe nos próprios salvos.
create policy feed_content_saves_own on public.feed_content_saves
  for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

-- A última linha do formato antigo do acervo: uma sugestão de teste
-- ("Coloring", link https://uiiiiii.com), pendente e sem tela para aprovar
-- desde que o Acervo passou a usar feed_contents. A tabela library_items
-- continua existindo, vazia.
delete from public.library_items
 where id = 'ba7cebcb-29d4-4cfc-b9b1-522d57003e22'
   and title = 'Coloring'
   and approved = false;
