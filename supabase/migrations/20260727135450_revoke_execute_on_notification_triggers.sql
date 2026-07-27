-- revoke_execute_on_notification_triggers
--
-- notify_post_like/notify_post_comment são funções de trigger (usam "new"),
-- não deveriam ser chamáveis como RPC pública. Revogar EXECUTE não afeta o
-- disparo via trigger (que roda como o dono da função, não via grant de role).
revoke execute on function public.notify_post_like() from anon, authenticated;
revoke execute on function public.notify_post_comment() from anon, authenticated;
