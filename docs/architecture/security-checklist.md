# Checklist de Segurança — Plataforma E.L.O.S (Supabase)

Projeto: `Plataforma_ELOS` (`azbfrxrqwuhbffofdrct`). Validado via Supabase MCP.

## Como a segurança é garantida nesta arquitetura

O cliente do navegador usa a **publishable/anon key** (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`),
que **não** ignora RLS. Toda leitura/escrita — seja no browser
(`createClient` de `@/lib/supabase/client`) ou no servidor
(`@/lib/supabase/server`, com o cookie da sessão) — passa pelo PostgREST
sujeita às policies de RLS do banco.

> Importante: `src/lib/supabase/{client,server,middleware}.ts` são apenas
> **fábricas de client** (configuração da lib) — não contêm queries. As
> consultas ficam em `src/lib/data/*`, `src/app/actions/*` (Server Actions) e
> nos componentes de página. A segurança dessas consultas é imposta pela RLS,
> não pelo código do client. **A `service_role` key nunca é usada no frontend
> nem exposta com prefixo `NEXT_PUBLIC_`.**

## Validação de RLS (todas as tabelas de `public`)

`RLS habilitada` em **25/25** tabelas, cada uma com ≥1 policy:

| Tabela | RLS | Policies |
|---|---|---|
| profiles | ✅ | 2 |
| posts | ✅ | 4 |
| comments | ✅ | 3 |
| post_likes | ✅ | 3 |
| post_saves | ✅ | 1 (FOR ALL, dono) |
| groups | ✅ | 3 |
| group_members | ✅ | 4 |
| events | ✅ | 4 |
| professionals | ✅ | 4 |
| professional_skills | ✅ | 4 |
| professional_experiences | ✅ | 4 |
| clinics | ✅ | 4 |
| reviews | ✅ | 4 |
| news_articles | ✅ | 4 |
| knowledge_pills | ✅ | 4 |
| knowledge_trails | ✅ | 4 |
| knowledge_trail_steps | ✅ | 4 (select público; insert/update/delete só admin) |
| trail_progress | ✅ | 1 (FOR ALL, dono) |
| trail_step_completions | ✅ | 1 (FOR ALL, dono) |
| library_items | ✅ | 4 |
| library_favorites | ✅ | 1 (FOR ALL, dono) |
| contact_messages | ✅ | 2 |
| dependents | ✅ | 1 (FOR ALL, dono) |
| caregiver_journal | ✅ | 1 (FOR ALL, dono) |
| notifications | ✅ | 3 (select/update/delete do dono; **sem** policy de insert — só populada pelos triggers abaixo) |

Tabelas com "1 policy" usam uma policy `FOR ALL` restrita ao dono
(`profile_id = auth.uid()` / `caregiver_id = auth.uid()`) — cobre
SELECT/INSERT/UPDATE/DELETE numa regra só, é intencional.

### Notas sobre `notifications` e os triggers `SECURITY DEFINER`

`notifications` é populada por 2 triggers `AFTER INSERT` (`notify_post_like`
em `post_likes`, `notify_post_comment` em `comments`), ambos `SECURITY
DEFINER` com `search_path` travado — mesmo padrão de `private.is_admin()`
(migration 0002). Como não há policy de `INSERT` para `authenticated`/`anon`,
a única forma de criar uma notificação é via esses triggers (que rodam com
o privilégio do dono da função, ignorando a ausência de policy).

O Security Advisor acusou as duas funções como RPC pública chamável
(`anon_security_definer_function_executable` /
`authenticated_security_definer_function_executable`) — corrigido revogando
`EXECUTE` de `anon`/`authenticated`/`public` nas migrations
`20260727135450`/`20260727135504`. Isso não afeta o disparo via trigger, só
impede alguém de chamar `notify_post_like()`/`notify_post_comment()`
diretamente como RPC (o que já falharia em runtime — são funções de
trigger, dependem de `new`).

Padrões de policy relevantes já verificados no código:
- Conteúdo público (news, library, knowledge, professionals, clinics, groups,
  profiles): SELECT liberado a todos; escrita só admin/dono.
- `contact_messages`: INSERT público, SELECT só admin — por isso o insert em
  `fale-conosco` **nunca** encadeia `.select()` (senão o visitante deslogado
  tomaria erro de RLS).
- Interações de usuário (post_likes/saves, group_members, reviews, trail_progress):
  escrita restrita a `auth.uid()`.

## Ações de hardening (painel do Supabase — não fazíveis por código/MCP)

### 1. Leaked Password Protection (advisor: WARN)
O Security Advisor aponta 1 aviso: **Leaked Password Protection Disabled**. O
Supabase Auth pode bloquear senhas comprometidas checando contra o
HaveIBeenPwned. Habilitar em:

`Dashboard → Authentication → Policies (Password) → "Leaked password protection" → Enable`

Docs: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

### 2. Configuração de Auth para o domínio de produção (relacionado ao login)
Para o fluxo de e-mail/confirmação funcionar no domínio real:
`Dashboard → Authentication → URL Configuration`
- Site URL: `https://plataforma-elos-app.vercel.app` (domínio de produção atual)
- Redirect URLs: incluir o domínio de produção (e o padrão de preview, se quiser).

E, para demonstração, o toggle de confirmação de e-mail fica em
`Authentication → Providers → Email → "Confirm email"`.

## Resumo
- ✅ RLS: 25/25 tabelas cobertas — nenhuma correção necessária no banco.
- ✅ Nenhuma query usa `service_role` no frontend.
- ✅ Funções `SECURITY DEFINER` sem `EXECUTE` público desnecessário (`notify_post_like`/`notify_post_comment`).
- ⚠️ Pendência (painel, 1 clique): habilitar Leaked Password Protection.
