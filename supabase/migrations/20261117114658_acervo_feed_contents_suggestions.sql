-- O Acervo Digital passa a ser só de conteúdos com fonte (feed_contents):
-- profissionais, clínicas e cuidadores. "Adicionar ao Acervo" vira uma
-- sugestão de conteúdo desse tipo, que fica pendente até um admin aprovar.

-- 1) Moderação: sugestões entram com approved = false.
alter table public.feed_contents
  add column if not exists approved boolean not null default false,
  add column if not exists suggested_by uuid references public.profiles(id) on delete set null;

-- Os 8 conteúdos editoriais já publicados continuam no ar.
update public.feed_contents set approved = true where suggested_by is null;

create index if not exists feed_contents_suggested_by_idx on public.feed_contents (suggested_by);

-- 2) RLS. Leitura: aprovados para todos; a própria sugestão para quem
-- enviou; tudo para admin. Inserção: admin livre; usuário logado só como
-- sugestão própria, pendente e não-demonstrativa (não dá para se
-- autoaprovar nem se passar por conteúdo editorial).
drop policy if exists feed_contents_read on public.feed_contents;
create policy feed_contents_read on public.feed_contents
  for select using (
    approved
    or suggested_by = (select auth.uid())
    or (select private.is_admin())
  );

drop policy if exists feed_contents_admin_insert on public.feed_contents;
create policy feed_contents_insert on public.feed_contents
  for insert with check (
    (select private.is_admin())
    or (
      suggested_by = (select auth.uid())
      and approved = false
      and is_demo = false
    )
  );

-- 3) Anti-abuso: no máximo 5 sugestões por pessoa por hora (mesmo padrão de
-- add_public_insert_rate_limits). Admin não entra na conta.
create or replace function public.enforce_feed_contents_rate_limit()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if new.suggested_by is not null and (
    select count(*) from public.feed_contents
    where suggested_by = new.suggested_by
      and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;

create trigger feed_contents_rate_limit
before insert on public.feed_contents
for each row execute function public.enforce_feed_contents_rate_limit();

-- Função de trigger não deve ser chamável como RPC.
revoke execute on function public.enforce_feed_contents_rate_limit() from public, anon, authenticated;

-- 4) Os 3 materiais de exemplo do formato antigo (vídeo/documento) saem do
-- acervo, a pedido. Nenhum tinha favorito. A tabela library_items continua
-- existindo (a página "Salvos" ainda lê library_favorites).
delete from public.library_items
 where suggested_by is null
   and title in (
     'Entendendo o Comportamento no TEA',
     'Guia de Atividades Sensoriais',
     'Modelo de Plano de Ensino Individualizado (PEI)'
   );
