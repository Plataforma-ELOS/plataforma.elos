-- add_notifications_table
--
-- Tabela de notificações: curtida e comentário em post próprio.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('post_like', 'post_comment')),
  post_id uuid references public.posts(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create index idx_notifications_profile on public.notifications (profile_id, created_at desc);

-- Só o próprio dono vê/atualiza/apaga suas notificações. Sem policy de
-- insert para usuários: inserts só acontecem via as funções abaixo,
-- security definer (mesmo padrão de private.is_admin() na migration 0002).
create policy notifications_select on public.notifications
  for select to authenticated
  using (profile_id = (select auth.uid()));

create policy notifications_update on public.notifications
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy notifications_delete on public.notifications
  for delete to authenticated
  using (profile_id = (select auth.uid()));

create or replace function public.notify_post_like()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_author_id uuid;
begin
  select author_id into v_author_id from public.posts where id = new.post_id;
  if v_author_id is not null and v_author_id <> new.profile_id then
    insert into public.notifications (profile_id, actor_id, type, post_id)
    values (v_author_id, new.profile_id, 'post_like', new.post_id);
  end if;
  return new;
end;
$function$;

create trigger on_post_like_notify
after insert on public.post_likes
for each row execute function public.notify_post_like();

create or replace function public.notify_post_comment()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_author_id uuid;
begin
  select author_id into v_author_id from public.posts where id = new.post_id;
  if v_author_id is not null and v_author_id <> new.author_id then
    insert into public.notifications (profile_id, actor_id, type, post_id)
    values (v_author_id, new.author_id, 'post_comment', new.post_id);
  end if;
  return new;
end;
$function$;

create trigger on_comment_notify
after insert on public.comments
for each row execute function public.notify_post_comment();

alter publication supabase_realtime add table public.notifications;
