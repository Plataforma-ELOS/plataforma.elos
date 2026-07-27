-- add_public_insert_rate_limits
--
-- Limite de taxa (rate limiting) em contact_messages e reviews, aplicado no
-- banco via trigger BEFORE INSERT (mesmo padrão security definer + search_path
-- travado das funções de notificação em add_notifications_table). Assim o
-- limite vale mesmo se alguém bater direto na API com a chave anon — não
-- depende só da Server Action respeitar a regra.

create or replace function public.enforce_contact_rate_limit()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (
    select count(*) from public.contact_messages
    where lower(email) = lower(new.email)
      and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;

create trigger contact_messages_rate_limit
before insert on public.contact_messages
for each row execute function public.enforce_contact_rate_limit();

create or replace function public.enforce_reviews_rate_limit()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if (
    select count(*) from public.reviews
    where author_id = new.author_id
      and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;

create trigger reviews_rate_limit
before insert on public.reviews
for each row execute function public.enforce_reviews_rate_limit();
