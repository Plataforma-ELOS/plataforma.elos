# Migrations já aplicadas em produção

O banco Supabase (projeto `Plataforma_ELOS`, id `azbfrxrqwuhbffofdrct`) já
está com o schema completo e testado:

- `0001`–`0003`: estrutura (22 tabelas), RLS (48 policies), seed de conteúdo
  público (notícias, acervo, pílulas de conhecimento).
- `0004`: hardening de segurança (search_path travado, contact_messages com
  validação real, profiles com leitura pública).
- `0005`: seed de demonstração — 5 profissionais + 2 clínicas fictícios
  (registration_number no formato `DEMO-xxx` de propósito, para não colidir
  com registro profissional real).
- `0006`: isolou a função `is_admin()` num schema não exposto pelo PostgREST.
- `0007`: performance — 25 policies pararam de reavaliar `auth.uid()` linha a
  linha, 11 tabelas com policy duplicada em SELECT foram divididas, 12
  índices de chave estrangeira criados.
- `0008` em diante: todas aditivas, aplicadas via `apply_migration` (MCP).
  **Atenção**: diferente do que o texto anterior deste README sugeria,
  `apply_migration` **não** grava o arquivo local automaticamente — só
  aplica no banco remoto. Os arquivos abaixo precisaram ser reconstruídos
  manualmente (nome/versão batendo com `supabase_migrations.schema_migrations`
  via `list_migrations`, conteúdo idêntico ao enviado em cada chamada),
  senão o check "Supabase Preview" do GitHub falha com `Remote migration
  versions not found in local migrations directory` — foi exatamente o que
  aconteceu depois das 3 migrations mais recentes (corrigido nesta entrega).
  Ao aplicar uma migration nova via MCP, **sempre** criar o arquivo `.sql`
  correspondente nesta pasta no mesmo commit.
  - `add_notification_privacy_prefs_to_profiles`: `notify_email`,
    `notify_push`, `profile_public` (boolean, default `true`) em `profiles`,
    usadas pela tela `/configuracoes`.
  - `add_notifications_table` + `revoke_execute_on_notification_triggers[_from_public]`:
    tabela `notifications` + triggers de curtida/comentário.
  - `add_public_insert_rate_limits` + `revoke_execute_on_rate_limit_triggers[_from_public]`:
    rate limiting em `contact_messages`/`reviews`.
  - `add_storage_buckets_avatars_professionals` + `drop_broad_select_policies_public_buckets`:
    buckets `avatars`/`professionals`.
  - `add_library_items_search_vector` + `fix_immutable_array_to_string_search_path`:
    busca full-text (`tsvector`) no Acervo Digital.
  - `add_posts_image_url_and_buckets`: `posts.image_url` + buckets
    `library`/`posts` (upload de imagem no acervo e em criar post).
  - `canonicalize_professionals_specialty`: ajusta os 5 valores de
    `specialty` das linhas demo de `professionals` para a lista canônica de
    `src/lib/data/specialties.ts` (causa raiz de `/profissionais` — o
    cadastro real nunca gravava `specialty`, só o seed tinha; ver `E2`/`E8`
    em `docs/project/plano-finalizacao-completa.md`).

**Resultado no Security/Performance Advisor: 0 avisos de segurança, 0
avisos de performance.**

## Sobre os arquivos `.sql` nesta pasta

Os 7 arquivos `.sql` (`20260723100917_elos_0001_structure.sql` ...
`20260723200816_elos_0007_performance_hardening.sql`) foram gerados por
**introspecção do schema em produção** via Supabase MCP (`execute_sql`,
`list_migrations` — só leitura), para que os nomes de versão batam
exatamente com o que já está registrado em
`supabase_migrations.schema_migrations` no banco remoto. Isso resolve o
check "Supabase Preview" do GitHub, que falhava com
`Remote migration versions not found in local migrations directory`
porque esta pasta só tinha este README.

**Como foram gerados (e a limitação disso):**
- `0001` (estrutura), `0002` (RLS/policies), `0003` e `0005` (seeds) —
  reconstruídos com dado real e preciso: todas as tabelas, colunas,
  defaults, checks, FKs, índices, functions/triggers e as 60 RLS policies
  foram lidos diretamente do banco (`information_schema`, `pg_constraint`,
  `pg_policies`, `pg_indexes`, `information_schema.triggers`), e os seeds
  usam as linhas reais atuais.
- `0004`, `0006`, `0007` — são migrations **incrementais** (hardening) sobre
  um estado anterior que não temos registrado em lugar nenhum (só o estado
  final). Reconstruir o "antes" seria inventar histórico não confirmado, por
  isso esses 3 arquivos são **documentais** (comentário explicando o que a
  versão fez, já refletido em `0001`/`0002`), sem repetir DDL.
- **Validado localmente**: os 7 arquivos foram aplicados em sequência contra
  um Postgres local limpo (com `auth.users`/`auth.uid()` e as roles
  `anon`/`authenticated`/`service_role` simuladas, como a plataforma
  Supabase já provê no projeto real) — todos aplicaram sem erro.

**O que isto NÃO é**: uma migration é, por definição, um passo incremental;
os arquivos `0001`–`0003`/`0005` aqui são recortes temáticos do estado atual
completo, não os comandos originais executados na ordem/forma exata em que
rodaram em produção. Isso é suficiente para o check de CI (que verifica
presença de versão) e para qualquer pessoa rodar `supabase db reset`
localmente e obter um banco equivalente ao de produção — mas não é um
`supabase db pull` byte-perfeito.

Você não precisa rodar nada contra produção — o banco já está pronto. Se
quiser uma versão byte-perfeita (puxada direto do histórico real via CLI),
rode com um Personal Access Token da sua conta Supabase:

```bash
supabase login --token <seu-personal-access-token>
supabase link --project-ref azbfrxrqwuhbffofdrct
supabase db pull
```

Isso substitui os arquivos desta pasta pelos gerados pelo próprio CLI a
partir do histórico oficial.
