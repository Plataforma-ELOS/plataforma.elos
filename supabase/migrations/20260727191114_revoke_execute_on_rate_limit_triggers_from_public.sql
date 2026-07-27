-- revoke_execute_on_rate_limit_triggers_from_public
--
-- A migration anterior revogou de anon/authenticated, mas o Security
-- Advisor continuou acusando (grant padrão de EXECUTE para PUBLIC na
-- criação da função) — mesmo caso já resolvido para as funções de
-- notificação em revoke_execute_on_notification_triggers_from_public.
revoke execute on function public.enforce_contact_rate_limit() from public;
revoke execute on function public.enforce_reviews_rate_limit() from public;
