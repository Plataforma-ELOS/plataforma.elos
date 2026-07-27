-- revoke_execute_on_notification_triggers_from_public
--
-- A migration anterior revogou de anon/authenticated, mas o Security
-- Advisor continuou acusando (grant padrão de EXECUTE para PUBLIC na
-- criação da função). Revoga de public também.
revoke execute on function public.notify_post_like() from public;
revoke execute on function public.notify_post_comment() from public;
