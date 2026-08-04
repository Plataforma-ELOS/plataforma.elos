-- Estende handle_new_user() para capturar avatar_url do metadata de OAuth
-- (o provedor Google sempre traz uma foto de perfil no raw_user_meta_data;
-- signup por email/senha continua com avatar_url nulo, comportamento
-- inalterado). Função genérica, não específica de provedor — funcionaria
-- igual se outro provedor OAuth fosse ativado no futuro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'caregiver')
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;
