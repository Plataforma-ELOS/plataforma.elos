-- revoke_execute_on_rate_limit_triggers
--
-- enforce_contact_rate_limit/enforce_reviews_rate_limit são funções de
-- trigger (usam "new"), não deveriam ser chamáveis como RPC pública. Revogar
-- EXECUTE não afeta o disparo via trigger (mesmo padrão de
-- revoke_execute_on_notification_triggers).
revoke execute on function public.enforce_contact_rate_limit() from anon, authenticated;
revoke execute on function public.enforce_reviews_rate_limit() from anon, authenticated;
