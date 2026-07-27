-- elos_0008_preferencias_notificacao_privacidade
--
-- Adiciona preferências de notificação e privacidade em profiles, usadas
-- pela tela /configuracoes. Aditivo: não afeta linhas existentes (defaults
-- aplicados automaticamente) nem as policies de RLS já existentes (o dono
-- do perfil já pode dar update em qualquer coluna própria).

alter table public.profiles
  add column notify_email boolean not null default true,
  add column notify_push boolean not null default true,
  add column profile_public boolean not null default true;
