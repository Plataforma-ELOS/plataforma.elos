# Histórico de Pull Requests — Plataforma E.L.O.S

Registro cronológico de todos os Pull Requests mesclados em `main`, com o que cada um mudou em detalhe. Serve como changelog técnico do projeto — para o que ainda falta fazer, ver `docs/project/roadmap.md` e `docs/project/plano-finalizacao-completa.md`.

Todos os PRs foram da branch `claude/new-session-8sdpjq` para `main`, passando pelo CI (`typecheck · test · build`) antes do merge.

## Índice rápido

| # | Título | Mesclado em | Tipo |
|---|---|---|---|
| [1](#pr-1) | trigger: forçar novo deploy Vercel | 2026-07-22 | chore |
| [2](#pr-2) | Autenticação real, telas de comunidade/notícias/acervo/profissionais no Supabase | 2026-07-23 | feat |
| [3](#pr-3) | Desacoplamento do Firebase, limpeza e reorganização de código | 2026-07-24 | refactor |
| [4](#pr-4) | Busca real em profissionais, checklist de segurança, Vitest, build sem avisos | 2026-07-24 | feat/test/docs |
| [5](#pr-5) | Criar post, roadmap, CI (GitHub Actions), favoritar no acervo | 2026-07-24 | feat/ci |
| [6](#pr-6) | Migração para Supabase, refatoração, busca, testes, CI e hardening | 2026-07-24 | feat (PR grande, consolida 2–5) |
| [7](#pr-7) | docs: harmonia entre Supabase e Vercel | 2026-07-24 | docs |
| [8](#pr-8) | fix: substitui favicon do Firebase pelo ícone oficial da marca E.L.O.S | 2026-07-25 | fix |
| [9](#pr-9) | docs: mapear imagens hospedadas fora do projeto | 2026-07-25 | docs |
| [10](#pr-10) | feat: ativa Vercel Analytics e Speed Insights | 2026-07-25 | feat |
| [11](#pr-11) | docs: reorganiza docs/ em subpastas temáticas e padroniza kebab-case | 2026-07-25 | docs |
| [12](#pr-12) | docs: registra backlog de telas, bugs e acessibilidade | 2026-07-27 | docs |
| [13](#pr-13) | fix: implementa itens simples do backlog de UI/UX | 2026-07-27 | fix |
| [14](#pr-14) | feat: telas de perfil, salvos, configurações e evolução do ajuda (U2-U5) | 2026-07-27 | feat |
| [15](#pr-15) | fix: renomeia migration 0008 para bater com a versão registrada no Supabase | 2026-07-27 | fix |
| [16](#pr-16) | feat: tipos gerados do Supabase nos clients (Q2) | 2026-07-27 | feat |
| [17](#pr-17) | feat: sistema de eventos reais na comunidade (F1/1.4) | 2026-07-27 | feat |
| [18](#pr-18) | feat: página de detalhe de grupo + boas-vindas ao entrar (U1/1B.1) | 2026-07-27 | feat |
| [19](#pr-19) | feat: central de notificações com trigger no banco (U6/1B.6/E7) | 2026-07-27 | feat |
| [20](#pr-20) | test: cobre mappers novos e SearchBar (Q3) | 2026-07-27 | test |
| [21](#pr-21) | docs: atualiza documentação da aplicação para o estado pós-Sprint 5 | 2026-07-27 | docs |
| [22](#pr-22) | feat: editar post, compartilhar, detalhe de evento e error/loading (F2/F3/1B.9/2.3) | 2026-07-27 | feat |
| [23](#pr-23) | feat: área do cuidador — dependentes e diário (F5/1.6) | 2026-07-27 | feat |
| [24](#pr-24) | feat: configura ESLint e corrige todos os apontamentos (2.5/Q5) | 2026-07-27 | feat/chore |
| [25](#pr-25) | fix: auditoria de contraste WCAG AA do tema claro (U13/1B.12) | 2026-07-27 | fix |
| [26](#pr-26) | feat: painel administrativo (Horizonte 4) | 2026-07-27 | feat |
| [27](#pr-27) | feat: selo verificado + exportar evento para calendário (E5/1B.9) | 2026-07-27 | feat |
| [28](#pr-28) | feat: rate limiting nos inserts públicos (E4/3.4) | 2026-07-27 | feat |
| [29](#pr-29) | feat: Supabase Storage para avatar e foto de profissional/clínica (E3/3.3) | 2026-07-27 | feat |
| [30](#pr-30) | refactor: migra as 6 telas client-fetch para Server Components (E1/3.1/H2) | 2026-07-27 | refactor |
| [31](#pr-31) | docs: histórico detalhado de todos os Pull Requests mesclados | 2026-07-28 | docs |
| [32](#pr-32) | perf: middleware só consulta Supabase Auth quando a rota exige (H1) | 2026-07-28 | perf |
| [33](#pr-33) | feat: liga "Adicionar ao Acervo" a um insert real (F7) | 2026-07-28 | feat |
| [34](#pr-34) | feat: paginação do feed de posts da Comunidade (E2/3.2) | 2026-07-28 | feat |
| [35](#pr-35) | test: configura Playwright e cobre as páginas públicas com E2E (Q6/2.6) | 2026-07-28 | test |
| [36](#pr-36) | fix: liga o último stub do rodapé à política de cookies (F6) | 2026-07-28 | fix |
| [37](#pr-37) | refactor: consolida queries inline em lib/data (3.5) | 2026-07-28 | refactor |
| [38](#pr-38) | feat: busca full-text server-side no Acervo Digital (E8) | 2026-07-28 | feat |
| [39](#pr-39) | docs: corrige linhas desatualizadas na tabela de priorização | 2026-07-28 | docs |
| [40](#pr-40) | feat: upload de imagem ao sugerir item do acervo (E3/F7) | 2026-07-28 | feat |
| [41](#pr-41) | feat: upload de imagem ao criar post (E3/F7 fechado) | 2026-07-28 | feat |
| [42](#pr-42) | fix: reconstrói 3 arquivos de migration faltando (Supabase Preview) | 2026-07-28 | fix |
| [43](#pr-43) | fix: cadastro profissional passa a gravar specialty (causa raiz de /profissionais) | 2026-07-28 | fix |
| [44](#pr-44) | feat: paginação + busca full-text server-side em /profissionais | 2026-07-28 | feat |
| [45](#pr-45) | chore: remove código morto de stubs já resolvidos (FeatureInProgress) | 2026-07-28 | chore |
| [46](#pr-46) | perf: ISR em rotas públicas, consolidar queries de profissionais/[id] | 2026-07-28 | perf |
| [47](#pr-47) | feat: trilhas de conhecimento com passos reais e progresso (sem quiz) | 2026-07-29 | feat |

---

## PR #1
### trigger: forçar novo deploy Vercel
**Mesclado:** 2026-07-22

Commit único, sem alteração funcional — usado para forçar um novo deploy na Vercel (ex.: depois de uma mudança de configuração no painel que não gera commit).

---

## PR #2
### Autenticação real, telas de comunidade/notícias/acervo/profissionais no Supabase
**Mesclado:** 2026-07-23

Início da migração do app (que rodava inteiramente sobre um mock em memória) para dados reais no Supabase. Commits principais:

- **Autenticação real**: `AuthContext` mock (com admin hardcoded) substituído por Supabase Auth de verdade — `login`/`register` viram assíncronos (`signInWithPassword`/`signUp`); `logout` continua síncrono para não quebrar `onClick={logout}`. Middleware ganha proteção de rota real (grupos exigem login; telas de auth redirecionam quem já está logado). Remove `src/_middleware.ts` (arquivo morto, ignorado pelo App Router do Next 15).
- **Comunidade**: `comunidade/page.tsx` passa a buscar posts reais (join com `profiles`, `post_likes`, `post_saves`, `comments`) e usa novas Server Actions (`criarPost`, `excluirPost`, `alternarCurtida`, `alternarSalvo`, `comentar`) em vez de `useState` local. `post-card.tsx` ganha `onToggleLike`/`onAddComment` opcionais. Eventos continuam mockados nesta etapa.
- **Notícias**: `noticias`, `noticias/[slug]`, `noticias-ai` e `noticias-ai/[slug]` trocam os arrays mock por `src/lib/data/news.ts` (`getNews`/`getNewsBySlug`/`getAllNewsSlugs`). Sanitização de XSS com `isomorphic-dompurify` antes do `dangerouslySetInnerHTML`, já que o conteúdo passa a vir do banco.
- **Acervo digital**: busca `library_items` (`approved=true`) direto pelo browser client. Extraído `formatarDataPtBr` para `src/lib/format.ts` (compartilhado); ordenação passa a usar `created_at` real em vez de parsing de string em pt-BR.
- **Fix de build**: `getAllNewsSlugs()` usava `createClient(await cookies())`, mas `generateStaticParams` roda fora do escopo de uma requisição — quebrava o build. Adicionado `createStaticClient()` (sem cookies, só leitura pública) para esse caso.
- **Profissionais e clínicas**: `profissionais/page.tsx` busca `professionals`/`clinics` direto pelo browser client. `profissionais/[id]/page.tsx` vira Server Component: busca o profissional (com skills/experiences) ou, se não achar, a clínica, mais as reviews reais (média, distribuição, notas por critério calculadas em `src/lib/data/professionals.ts`). Sem avaliações mostra estado vazio em vez de inventar reviews falsas. `LeaveReviewDialog` passa a chamar a Server Action `criarAvaliacao`.
- **Pílulas e trilhas de conhecimento**: `noticias-gamificadas/page.tsx` busca `knowledge_pills`/`knowledge_trails` do banco (Server Component). Ícone mapeado pela categoria (sem coluna de ícone no banco). Progresso de trilha vem de `trail_progress`, por usuário logado.
- **Grupos da comunidade**: `explorar-grupos/page.tsx` busca a tabela `groups` (com contagem real de `group_members`); participar/sair chama `entrarNoGrupo`/`sairDoGrupo` (novas Server Actions). `meus-grupos` ganha a listagem (antes só existia o estado vazio). `criar-grupo` usa a Server Action `criarGrupo`. IDs de grupo passam a ser UUID reais.
- **Fale conosco e cadastro profissional**: `fale-conosco` grava em `contact_messages` (além de continuar enviando e-mails via EmailJS); credenciais do EmailJS movidas de hardcoded para `NEXT_PUBLIC_EMAILJS_*`. `cadastro-profissional` passa a capturar todos os campos em estado controlado e usa a Server Action `inscreverProfissional`; a rota entra em `ROTAS_PRIVADAS` no middleware (exige login para o insert funcionar, já que a RLS exige `owner_id`).
- **Build**: reativa `typescript.ignoreBuildErrors` removido de `next.config.ts` (corrige 3 erros pré-existentes que a flag escondia: `allowedDevOrigins` mal posicionado, dois `onValueChange` mal tipados).
- **Docs**: histórico de migrations do Supabase adicionado como referência.

---

## PR #3
### Desacoplamento do Firebase, limpeza e reorganização de código
**Mesclado:** 2026-07-24

- **Firebase removido**: dependência `firebase` (0 imports em `src/`) e `patch-package` (morta) removidas do `package.json`. Apagados `.idx/` (workspace do Firebase Studio), `apphosting.yaml` (Firebase App Hosting — o app roda na Vercel) e `metadata.json`. README atualizado.
- **Código e assets mortos removidos**: 4 componentes de seção sem nenhum importador (`sections/{ai-support,community,professionals,digital-collection}.tsx`, substituídos pelas versões `new-*`); assets órfãos da era do mock (`public/comunidade/membro-*`, `public/acervo/**`, `public/perfis/clinicas/*`) — a listagem migrou para Supabase, que usa URLs externas.
- **Docs reorganizados**: documentos soltos em `SCREAMING_CASE` movidos para subpastas temáticas em `kebab-case` (`product/prd.md`, `product/screen-content.md`, `architecture/technical-architecture.md`, `architecture/routes.md`, `design/style-guide.md`, `design/blueprint.md`) + índice `docs/README.md`.
- **Componentes reagrupados por feature**: `common/` (transversais: `feature-in-progress`, `providers`), `features/community`, `features/news`, `features/home`, `features/acervo`, `features/search` (novo). Pastas antigas `community/`, `news/`, `sections/` removidas.
- **Busca extraída e reutilizável**: `src/hooks/use-search.ts` (hook genérico `useSearch<T>` — query + filtro + ordenação, sem UI) + `SearchBar`/`SearchFilters` (`components/features/search/`). `acervo-digital` passa a compor os três (saída visual idêntica).
- **Módulos globais consolidados sob `src/lib`**: `src/utils/supabase/*` → `src/lib/supabase/`; `src/app/lib/placeholder-images.json` → `src/lib/data/placeholder-images.json`. `src/utils` e `src/app/lib` removidos.
- **Docs**: `docs/refactor-report.md` (relatório da limpeza — deps/arquivos removidos, estrutura antes/depois).

---

## PR #4
### Busca real em profissionais, checklist de segurança, Vitest, build sem avisos
**Mesclado:** 2026-07-24

- **Busca real em `/profissionais`**: a barra de busca era decorativa (`FeatureInProgress` + `ref` que só preenchia o input) e os chips de especialidade não filtravam nada. Agora `professionals`+`clinics` combinados numa lista discriminada por `kind`, passando por um único `useSearch` (nome + especialidade); resultados divididos de volta (carrossel de profissionais, grid de clínicas), cada seção com estado vazio próprio. Chips de especialidade viram atalho de busca (tolerante a divergências banco↔rótulo), com destaque visual do chip ativo.
- **`docs/security-checklist.md`**: matriz de RLS das 22 tabelas (todas com RLS on + policies, validado via MCP); documenta os passos de hardening que só existem no painel (Leaked Password Protection, config de URL/confirmação de e-mail do Auth).
- **Vitest configurado**: + React Testing Library + jsdom; `vitest.config.ts` (jsdom, globals, alias `@`→`src`, setup jest-dom). Scripts `test`/`test:watch`. 16 testes: `cn()` (utils), `formatarDataPtBr()` (format), `useSearch` (hook). `tsconfig` exclui arquivos de teste do `next build`/`tsc --noEmit`.
- **Build sem avisos**: `webpack.ignoreWarnings` filtra cirurgicamente só avisos de dependências (telemetria opcional do Genkit, `handlebars`, `process.version` do Supabase no Edge Runtime). `serverExternalPackages: ['isomorphic-dompurify']` (necessário depois de instalar o jsdom — sem isso o webpack tentava empacotar assets do jsdom e o build quebrava).
- **Docs**: `docs/pr-description.md` com o corpo do PR consolidado (decisão do usuário na época foi não abrir o PR ainda).
- **Fix de migrations**: sincroniza `supabase/migrations/` locais com o histórico remoto — o banco já tinha 7 migrations aplicadas (`elos_0001`..`elos_0007`) sem arquivo local correspondente (só o README). Reconstruídas por introspecção read-only do schema real via MCP (colunas, defaults, checks, FKs, índices, functions/triggers, as 60 policies de RLS, dados de seed), com os nomes de versão exatos já registrados remotamente. Validado aplicando os 7 arquivos em sequência contra um Postgres limpo simulado.

---

## PR #5
### Criar post, roadmap, CI (GitHub Actions), favoritar no acervo
**Mesclado:** 2026-07-24

- **Liga a criação de posts**: o componente `create-post.tsx` e a Server Action `criarPost` já existiam mas nunca tinham sido conectados (órfãos desde o commit base). Usuário logado vê `CreatePost` no topo do feed; publicar chama `criarPost` (valida login no servidor) e recarrega o feed. Visitante deslogado vê convite que abre o `LoginRequiredDialog`.
- **`docs/roadmap.md`**: próximos passos organizados em horizontes (go-live, completar núcleo, qualidade, arquitetura, produto), com esforço/status/sequência de sprints.
- **CI (GitHub Actions)**: `.github/workflows/ci.yml` roda em push para `main` e em `pull_request` — Node 20 (cache npm), `npm ci → typecheck → test → build`. Build recebe env vars dummy (não-segredos) para compilar em ambiente isolado. `getAllNewsSlugs()` blindada com try/catch → `[]` para não quebrar `generateStaticParams` quando o Supabase está inacessível.
- **Favoritar no acervo digital**: substitui o stub `FeatureInProgress` do botão de favorito por integração real (`library_favorites`), espelhando o padrão de `alternarSalvo`. Nova Server Action `alternarFavorito` (checa login, toggle com `revalidatePath`). `LibraryItemData`/`mapLibraryRow` ganham `id` e `isFavorited`. Update otimista no client (reverte em falha). Os dois cards do acervo (grid e lista) ligam o botão Bookmark real.

---

## PR #6
### Migração para Supabase, refatoração, busca, testes, CI e hardening
**Mesclado:** 2026-07-24

PR consolidado que reúne, num só merge para `main`, o trabalho equivalente aos PRs #2–#5 acima (16 commits) — é o primeiro grande PR desta sessão a efetivamente chegar em `main`. Resultado: `typecheck` ✅ (0 erros) · `test` ✅ (16) · `build` ✅ (0 avisos, 22 rotas). Segurança: RLS validada em 22/22 tabelas, nenhuma query usa `service_role` no frontend.

**Pendências de configuração externa registradas** (fora do código, precisam de ação manual nos painéis): Supabase Auth (Site URL + Redirect URLs, decisão de confirm-email), habilitar Leaked Password Protection, env vars nas 3 envs da Vercel, criar usuário admin.

---

## PR #7
### docs: harmonia entre Supabase e Vercel
**Mesclado:** 2026-07-24

Documentação pura — `docs/HARMONIA_SUPABASE_VERCEL.md` (depois renomeado para `docs/architecture/harmonia-supabase-vercel.md` no PR #11), documento irmão do guia mestre de finalização, auditando a relação entre banco/API (Supabase) e front/hosting (Vercel). Encontra 6 pontos de desalinhamento, cada um com ficha própria (achado, prioridade, código atual vs. proposto, critérios de aceite):

- **H1** — middleware chama a Auth do Supabase em quase todo request, inclusive páginas 100% públicas.
- **H2** — 6 telas buscam dados direto do navegador em vez de Server Components (resolvido depois no PR #30).
- **H3** — nenhuma rota usa ISR/revalidação.
- **H4** — página de detalhe de profissional faz até 5 queries separadas onde uma com joins resolveria.
- **H5** — 8 arquivos leem cookies mesmo sem depender de sessão.
- **H6** — listagens de notícias saem dinâmicas enquanto seus detalhes já são estáticos.

---

## PR #8
### fix: substitui favicon do Firebase pelo ícone oficial da marca E.L.O.S
**Mesclado:** 2026-07-25

O `favicon.ico` do projeto era literalmente o logo do Firebase (ícone de chama laranja/rosa), resquício do scaffold original via Firebase Studio que sobrou mesmo após o desacoplamento do Firebase (PR #3). Era o único lugar da aplicação com uma marca que não era do E.L.O.S.

Como o logo oficial só existe hospedado em `i.ibb.co` (host bloqueado pela política de rede do ambiente), foi gerado um novo ícone localmente: monograma "E" branco sobre fundo com cantos arredondados, usando o mesmo gradiente azul-roxo-rosa já usado no wordmark "E.L.O.S" do header. Adicionado também `apple-icon.png` (180×180) para a tela inicial do celular. Se o arquivo oficial for enviado depois, basta substituir os dois arquivos.

De quebra: corrigido um bug de indentação no `README.md` (seção "Como Executar") onde os blocos de código apareciam aninhados uns dentro dos outros, quebrando a renderização da lista de passos.

---

## PR #9
### docs: mapear imagens hospedadas fora do projeto
**Mesclado:** 2026-07-25

Documentação pura — `docs/IMAGENS_EXTERNAS.md` (depois `docs/design/imagens-externas.md`): inventário de todas as imagens hospedadas em serviços externos gratuitos (`i.ibb.co`, `placehold.co`), 9 categorias mapeadas com arquivo:linha ou tabela do banco exatos — incluindo as fotos demo de profissionais/clínicas, que eram só quadrados coloridos com iniciais gerados pelo `placehold.co`, gravados como dado real no banco. Regra de decisão (estático em `public/` vs. Supabase Storage) e plano em 2 trilhas. Aponta dois hosts mortos em `next.config.ts` sem referência no código.

---

## PR #10
### feat: ativa Vercel Analytics e Speed Insights
**Mesclado:** 2026-07-25

O painel da Vercel mostrava "Get Started" com 0 visitantes nas abas Analytics/Speed Insights — os pacotes oficiais nunca tinham sido instalados. Instala `@vercel/analytics` e `@vercel/speed-insights`, registra os dois componentes no layout raiz (`src/app/layout.tsx`) ao lado do `Toaster`. Não exige env var nova (os pacotes detectam sozinhos que rodam num deploy da Vercel e só coletam em produção).

---

## PR #11
### docs: reorganiza docs/ em subpastas temáticas e padroniza kebab-case
**Mesclado:** 2026-07-25

`docs/` misturava convenções (alguns arquivos já em kebab-case dentro de subpastas, outros soltos na raiz em `UPPER_SNAKE_CASE`). Move via `git mv` (histórico preservado) e renomeia:
- `HARMONIA_SUPABASE_VERCEL.md` → `architecture/harmonia-supabase-vercel.md`
- `security-checklist.md` → `architecture/security-checklist.md`
- `IMAGENS_EXTERNAS.md` → `design/imagens-externas.md`
- `PLANO_FINALIZACAO_COMPLETA.md` → `project/plano-finalizacao-completa.md`
- `roadmap.md`, `refactor-report.md`, `pr-description.md` → `project/` (pasta nova)

Corrige todos os links relativos quebrados pela movimentação. Nenhum conteúdo textual alterado além dos caminhos.

---

## PR #12
### docs: registra backlog de telas, bugs e acessibilidade
**Mesclado:** 2026-07-27

Registra formalmente no guia mestre e no roadmap um backlog de produto levantado nesta data: 6 telas novas (boas-vindas ao grupo, perfil, salvos, configurações, central de ajuda, notificações), 3 fluxos de clique a rever, 2 bugs de interação e uma auditoria de contraste no tema claro. Cada item foi investigado contra o código real antes de virar ficha (evitando registrar como "novo" algo que já existia parcialmente). O pedido de remover "Agendar consulta" contradizia um plano anterior (`F4`) — marcado como substituído pelo novo item `U12`/`1.7`, preservando o histórico da decisão.

---

## PR #13
### fix: implementa itens simples do backlog de UI/UX
**Mesclado:** 2026-07-27

Implementa os 5 itens mais simples do backlog do PR #12:
- Remove "Agendar consulta" do perfil de profissional.
- Documentos do acervo com `downloadable=true` agora baixam de verdade em vez de abrir em nova aba.
- Loading skeleton criado para `/noticias/[slug]` e `/noticias-ai/[slug]`.
- Bug dos chips do Suporte IA: um `setQuery('')` redundante impedia o campo de mostrar o tópico clicado — removido.
- Bug do clique em especialidade: faltava só rolar até a seção de resultados (o estado visual "ativo" já existia) — adicionado.

Em dois casos, a investigação durante a implementação corrigiu o diagnóstico registrado no PR anterior; os docs foram atualizados com a causa real.

---

## PR #14
### feat: telas de perfil, salvos, configurações e evolução do ajuda (U2-U5)
**Mesclado:** 2026-07-27

- **`/perfil`**: editar nome/bio.
- **`/salvos`**: unifica `post_saves` + `library_favorites` numa lista só.
- **`/configuracoes`**: tema/fonte + notificações/privacidade (nova migration adicionando colunas em `profiles`).
- **`/faq` → "Central de Ajuda"**: busca por palavra-chave + CTA para `/fale-conosco`.
- **Efeito colateral**: liga os 4 itens do dropdown do usuário logado (Editar Perfil, Itens Salvos, Configurações, Ajuda) em `header.tsx`/`header-secondary.tsx`, que estavam presos em `FeatureInProgress`.

---

## PR #15
### fix: renomeia migration 0008 para bater com a versão registrada no Supabase
**Mesclado:** 2026-07-27

O check "Supabase Preview" do CI falhou em `main` após o merge do PR #14 com "Remote migration versions not found in local migrations directory". Causa: `apply_migration` (MCP) registrou a migration remota como `20260727114722_add_notification_privacy_prefs_to_profiles`, mas o arquivo local tinha sido criado com timestamp/nome diferentes. Corrige renomeando o arquivo local para bater exatamente com `supabase_migrations.schema_migrations`, sem alterar o conteúdo SQL.

---

## PR #16
### feat: tipos gerados do Supabase nos clients (Q2)
**Mesclado:** 2026-07-27

Gera `src/lib/supabase/database.types.ts` via `mcp__Supabase__generate_typescript_types` (sem precisar de PAT/CLI). Tipa os clients `createClient`/`createStaticClient` (server) e `createClient` (browser) com `Database`. Remove `any`/`as any` de `comunidade/page.tsx` e `comunidade/explorar-grupos/page.tsx` (substituídos por tipos locais `PostRow`/`GroupRow`). Primeira de 5 etapas do "Sprint 5" (tipos → eventos → boas-vindas ao grupo → notificações → testes).

---

## PR #17
### feat: sistema de eventos reais na comunidade (F1/1.4)
**Mesclado:** 2026-07-27

Substitui o mock `allCommunityEvents` na `/comunidade` por dados reais da tabela `events` (RLS já permitia leitura pública e insert de qualquer autenticado). Nova Server Action `criarEvento` (mesmo padrão de `criarGrupo`) e mapper puro `mapEventRow`. `Dialog` "Criar Evento" na sidebar, com `LoginRequiredDialog` para deslogados. Nova `formatarDataHoraPtBr` (data + hora, com testes). Segunda etapa do Sprint 5.

---

## PR #18
### feat: página de detalhe de grupo + boas-vindas ao entrar (U1/1B.1)
**Mesclado:** 2026-07-27

Cria `/comunidade/grupos/[id]` (Server Component + client-page): nome, descrição, tags, contagem/lista de membros, botão Participar/Sair reaproveitando `entrarNoGrupo`/`sairDoGrupo`. Em `explorar-grupos`, entrar num grupo com sucesso abre um `AlertDialog` de boas-vindas (regras rápidas da comunidade) com botão "Acessar Grupo" → `/comunidade/grupos/[id]`. Terceira etapa do Sprint 5.

---

## PR #19
### feat: central de notificações com trigger no banco (U6/1B.6/E7)
**Mesclado:** 2026-07-27

Nova tabela `notifications` (RLS: só o dono vê/atualiza/apaga; sem policy de insert para usuários) + 2 triggers `security definer` em `post_likes`/`comments` que notificam o autor do post na curtida/comentário de terceiros, sem auto-notificação. O Security Advisor acusou as duas funções de trigger como RPC pública chamável — corrigido revogando `EXECUTE` de `anon`/`authenticated`/`public` (2 migrations de fix). `/notificacoes` (Server Component + client, com Supabase Realtime), Server Actions (`marcarComoLida`, `marcarTodasComoLidas`, `limparNotificacoes`), sino no header com contador de não lidas. Quarta etapa do Sprint 5.

---

## PR #20
### test: cobre mappers novos e SearchBar (Q3)
**Mesclado:** 2026-07-27

Sobe a suíte de 16 para 35 testes: cobre os mappers puros criados/deixados sem teste ao longo do Sprint 5 (`mapEventRow`, `mapNotificationRow`, `mapSavedPost`, `mapLibraryRow`) + um teste de componente representativo (`search-bar.test.tsx`, com `fireEvent`). Última etapa do Sprint 5.

---

## PR #21
### docs: atualiza documentação da aplicação para o estado pós-Sprint 5
**Mesclado:** 2026-07-27

Documentação pura, sincronizando os docs com todo o trabalho do Sprint 5 (PRs #16–#20): `routes.md` (novas rotas), `screen-content.md` (novas seções), `technical-architecture.md` (reescrito — descrevia uma arquitetura Firebase/mock que não existia mais desde a migração para Supabase), `security-checklist.md` (23/23 tabelas com RLS), `prd.md` (Supabase/Vercel na stack).

---

## PR #22
### feat: editar post, compartilhar, detalhe de evento e error/loading (F2/F3/1B.9/2.3)
**Mesclado:** 2026-07-27

- **F2**: `editarPost` (Server Action) + modal de edição em `post-card.tsx`, substituindo o `FeatureInProgress`.
- **F3**: `src/lib/share.ts` (`compartilhar` — Web Share API com fallback de clipboard), ligado em `post-card.tsx` e `profissionais/[id]/client-page.tsx`.
- **1B.9 (parte 1)**: clique num evento da sidebar da Comunidade abre modal de detalhe (tipo, data/hora, local, descrição). RSVP/`.ics` ficaram fora do escopo nesta rodada (concluído depois no PR #27).
- **2.3**: `src/app/loading.tsx` + `error.tsx` na raiz.

---

## PR #23
### feat: área do cuidador — dependentes e diário (F5/1.6)
**Mesclado:** 2026-07-27

Nova rota `/meu-espaco` (Server Component + client-page com abas "Dependentes" e "Diário"), usando as tabelas `dependents`/`caregiver_journal` que já existiam no banco com RLS pronta mas sem UI. CRUD completo (criar/editar/excluir, com confirmação). `mapJournalEntryRow` ancora `entry_date` em meio-dia antes de formatar, evitando que a conversão de fuso para `America/Sao_Paulo` mostre o dia anterior. Sem migration nova — RLS já cobria. Atalho novo em `/perfil`.

**Achado de ambiente registrado** (não é regressão do PR): durante o smoke test, `/perfil`/`/salvos`/`/configuracoes`/`/notificacoes` passaram a responder `200` em vez do `307` esperado quando deslogado — confirmado que é uma mudança no sandbox de teste (rede/egress), não um bug introduzido.

---

## PR #24
### feat: configura ESLint e corrige todos os apontamentos (2.5/Q5)
**Mesclado:** 2026-07-27

Instala `eslint` + `eslint-config-next@15.3.8`, cria `eslint.config.mjs` (flat config) e remove `eslint.ignoreDuringBuilds` de `next.config.ts` — `npm run build` passa a rodar lint de verdade. Corrige ~30 apontamentos (imports não usados, `any` substituídos, aspas não escapadas em JSX).

**Bônus** (achado ao investigar os apontamentos): `news-flow.ts` usava sintaxe Handlebars (`{{{article}}}`/`{{{question}}}`) dentro de template strings comuns do JS — nunca era de fato interpolada no prompt enviado à IA; corrigido para interpolação real (`${article}`/`${question}`). `legalAssistantFlow` era código morto (nunca chamado) — removido. Primeira das 3 etapas do bloco "ESLint → contraste → painel admin".

---

## PR #25
### fix: auditoria de contraste WCAG AA do tema claro (U13/1B.12)
**Mesclado:** 2026-07-27

Medidos os 8 pares texto/fundo de `globals.css` com a fórmula oficial WCAG (HSL → RGB → luminância relativa → razão de contraste). Dois falhavam o mínimo de 4.5:1: `destructive-foreground`/`destructive` (3.60:1) e `text-primary` sobre fundo claro (2.49:1).

- `--destructive` escurecido de `60.2%` para `46%` de lightness (agora 5.00:1).
- Novo token `--primary-strong` (mesmo hue/saturação de `--primary`, mais escuro): escurecer `--primary` diretamente resolveria `text-primary` mas quebraria o contraste do texto de botão — não existe um valor único que resolva as duas pontas. `text-primary` trocado por `text-primary-strong` em 75 usos como texto legível (33 arquivos), preservando `dark:`/`hover:`/`group-hover:` e `border-primary`/`ring-primary` (fora de escopo, registrado como pendência).

Segunda das 3 etapas do bloco "ESLint → contraste → painel admin".

---

## PR #26
### feat: painel administrativo (Horizonte 4)
**Mesclado:** 2026-07-27

`private.is_admin()` e as policies de RLS (dono OU admin em `professionals`/`clinics`; admin-only em `library_items`) já existiam prontas desde o início — só faltava a UI. `src/app/admin/page.tsx` (Server Component: checa `role='admin'` no servidor, `redirect('/home')` silencioso para quem não é admin) + `client-page.tsx` com duas abas — **Verificações** (profissionais/clínicas pendentes, Aprovar/Rejeitar) e **Acervo** (itens sugeridos pendentes, Aprovar/Rejeitar). `src/app/actions/admin.ts` com as 3 Server Actions, cada uma conferindo `role='admin'` no servidor antes de escrever (defesa em profundidade). Sem link em nenhum menu — só acesso por URL direta. Nenhuma migration nova. Última das 3 etapas do bloco "ESLint → contraste → painel admin".

---

## PR #27
### feat: selo verificado + exportar evento para calendário (E5/1B.9)
**Mesclado:** 2026-07-27

Primeira etapa de um novo plano de 4 frentes (polimentos → rate limiting → Storage → Server Components).

- **Selo "verificado" (E5)**: `verification_status` adicionado aos `select()` de `/profissionais` (nunca era buscado, por isso nunca aparecia). Os 4 mappers de `lib/data/professionals.ts` passam a expor `verified: boolean`. Badge `BadgeCheck` ao lado do nome quando verificado.
- **Exportar evento para calendário (1B.9, parte 2)**: `src/lib/ics.ts` (novo, sem dependência externa) — `gerarIcs`/`baixarIcs`. Botão "Adicionar ao calendário" no modal de detalhe de evento. RSVP (confirmar presença) fica fora — exigiria tabela nova.
- 12 testes novos (51 no total).

---

## PR #28
### feat: rate limiting nos inserts públicos (E4/3.4)
**Mesclado:** 2026-07-27

`contact_messages` aceitava insert de `anon`/`authenticated` sem nenhum limite, gravado direto do client; `reviews` já passava por Server Action mas sem limite de quantidade. Limite aplicado **no banco** via trigger `BEFORE INSERT` (`security definer`), não só na Server Action:
- `enforce_contact_rate_limit`: bloqueia o 4º insert do mesmo e-mail em 10 minutos.
- `enforce_reviews_rate_limit`: bloqueia o 4º insert do mesmo `author_id` em 10 minutos.

Novo `src/app/actions/contact.ts` (`enviarMensagemContato`) substitui o insert direto do client em `fale-conosco` — era o último ponto do projeto que gravava sem Server Action. Migrations de ajuste de Security Advisor (revoga `EXECUTE` público das funções de trigger, mesmo padrão já usado para as de notificação).

---

## PR #29
### feat: Supabase Storage para avatar e foto de profissional/clínica (E3/3.3)
**Mesclado:** 2026-07-27

Até então todo `image_url`/`avatar_url` era `placehold.co` ou externo. Dois buckets novos (`avatars`, `professionals`), `public=true`, 2MB, só `image/png|jpeg|webp`; path prefixado por `auth.uid()` do dono (`{uid}/arquivo.ext`) — RLS de Storage sem precisar consultar outras tabelas. Policy de `select` ampla removida numa migration de correção depois que o Security Advisor acusou `public_bucket_allows_listing` (bucket público já serve via URL pública, sem precisar de policy de leitura).

- `/perfil`: upload de avatar no dialog de edição.
- `/cadastro-profissional`: foto opcional no formulário de inscrição.
- `next.config.ts`: hostname do Storage do projeto liberado em `images.remotePatterns`.

Fora de escopo: editar foto depois do cadastro (não existe tela de "editar minha ficha"); upload no create-post/acervo (`F7`).

---

## PR #30
### refactor: migra as 6 telas client-fetch para Server Components (E1/3.1/H2)
**Mesclado:** 2026-07-27

Última etapa do plano de 4 frentes. `comunidade`, `profissionais`, `acervo-digital`, `comunidade/explorar-grupos` e `comunidade/meus-grupos` migradas para `page.tsx` (Server Component, busca inicial com `createClient(await cookies())`) + `client-page.tsx` (`"use client"`, recebe os dados como prop, mantém `useSearch`/Dialogs/mutações). `fale-conosco` não precisou de reestruturação (o insert já tinha saído do client no PR #28). Mutations continuam por Server Action; em `comunidade`, criar post/evento agora chama `router.refresh()` em vez de refazer a query no browser. Favoritos/curtidas/membresia viraram uma segunda leitura no próprio Server Component — por isso as 6 rotas saem do build como `ƒ Dynamic`, não `○`/`●` (dado personalizado por usuário não pode ser estático; o ganho real é uma leitura no servidor por request em vez de N chamadas do browser a cada mount). Fecha os achados `E1`/`3.1`/`H2` documentados desde o PR #7.


---

## PR #31
### docs: histórico detalhado de todos os Pull Requests mesclados
**Mesclado:** 2026-07-28

`docs/project/historico-prs.md` (este documento) — changelog técnico com uma seção por PR (dos 30 já mesclados em `main` até então), detalhando arquivos/tabelas/migrations tocados, decisões de arquitetura e pendências registradas. Índice rápido no topo para navegação. Linkado em `docs/README.md`.

---

## PR #32
### perf: middleware só consulta Supabase Auth quando a rota exige (H1)
**Mesclado:** 2026-07-28

`src/lib/supabase/middleware.ts` chamava `supabase.auth.getUser()` em todo request, antes de checar se o path estava em `ROTAS_PRIVADAS`/`ROTAS_DE_AUTH` — inclusive páginas 100% públicas. A checagem de pathname passou a rodar primeiro; se não bater em nenhuma das duas listas, retorna `NextResponse.next()` sem tocar no Supabase.

Reduz latência/custo de API em toda navegação pública e, como efeito colateral, destrava testes E2E confiáveis dessas rotas em ambientes com rede restrita ao Supabase (aproveitado na etapa seguinte deste lote, PR #35). Validado manualmente: login persiste ao navegar entre página pública e privada; redirects de rota privada (deslogado) e de auth (logado) continuam funcionando.

---

## PR #33
### feat: liga "Adicionar ao Acervo" a um insert real (F7)
**Mesclado:** 2026-07-28

O formulário era 100% stub — `handleSubmit` só fechava o dialog e mostrava o `AlertDialog` de sucesso fixo, sem gravar nada. A policy `library_suggest` (insert por qualquer autenticado, `suggested_by = auth.uid()`) já existia desde a migration inicial e nunca tinha sido usada.

Nova Server Action `sugerirItemAcervo` (`src/app/actions/library.ts`): checa login, valida campos obrigatórios, separa tags por vírgula, insere em `library_items` (`approved` fica `false` por default). Dialog ganhou estado controlado nos 5 campos; gate de login reaproveita o mesmo padrão já usado em `handleToggleFavorite` no mesmo arquivo.

Item sugerido passa a aparecer na aba "Acervo" de `/admin` e só entra em `/acervo-digital` depois de aprovado. Upload de imagem do material continua fora de escopo nesta etapa (fechado depois, PR #40).

---

## PR #34
### feat: paginação do feed de posts da Comunidade (E2/3.2)
**Mesclado:** 2026-07-28

O feed carregava todos os posts de uma vez. `src/lib/data/community.ts` (novo) extrai `mapPostRow`/`tempoRelativo`/`PostRow` de `comunidade/page.tsx` — mapper puro reaproveitado pela busca inicial (Server Component) e pela paginação (Server Action), evitando duplicar a lógica de join com `post_likes`/`post_saves`/`comments`.

`page.tsx` busca a primeira página com `.range(0, 9)` (`POSTS_POR_PAGINA = 10`). Nova Server Action `buscarMaisPosts(offset)` busca as páginas seguintes com a mesma query. Botão "Carregar mais posts" em `client-page.tsx`, some quando não há mais posts.

Paginação de `/profissionais` ficou fora desta rodada — reaberta depois, PR #44.

---

## PR #35
### test: configura Playwright e cobre as páginas públicas com E2E (Q6/2.6)
**Mesclado:** 2026-07-28

`@playwright/test` instalado (Chromium pré-instalado no ambiente, sem download). `playwright.config.ts` sobe `npm run dev` automaticamente (`webServer`) com as mesmas env vars dummy do CI.

`e2e/public-pages.spec.ts`: smoke test das 6 páginas 100% públicas (`/home`, `/faq`, `/login`, `/cadastro`, `/termos-de-servico`, `/politica-de-privacidade`) — confirma status 200 e o heading esperado. Só ficaram confiáveis em ambientes com rede restrita ao Supabase depois do fix do middleware (H1, PR #32) — antes, toda página dependia de `supabase.co` estar alcançável só para renderizar.

Fora de escopo: fluxos autenticados (login, criar post, favoritar, grupos) exigem conta de teste real + Supabase alcançável no runner — config externa, mesma natureza dos itens G1-G4. Suíte também não entrou no `.github/workflows/ci.yml` ainda (exigiria instalar browsers no runner).

---

## PR #36
### fix: liga o último stub do rodapé à política de cookies (F6)
**Mesclado:** 2026-07-28

"Política de Cookies" no footer era um `FeatureInProgress` solto, fora do grupo "Legal" que já lista Termos/Privacidade linkados. A política de privacidade já tinha uma seção "4. Cookies" própria — criar uma página nova duplicaria conteúdo. `footer.tsx` passou a linkar direto para essa seção via anchor (`id="cookies"`).

Nenhum `FeatureInProgress` de navegação restava em header/header-secondary/footer depois deste PR (o componente em si só seria removido depois, PR #45, quando os últimos usos em `navItems` também deixaram de existir).

---

## PR #37
### refactor: consolida queries inline em lib/data (3.5)
**Mesclado:** 2026-07-28

`noticias-gamificadas/page.tsx` e os 3 `page.tsx` de grupos da comunidade (`explorar-grupos`, `meus-grupos`, `grupos/[id]`) mapeavam linhas cruas do Supabase inline, com lógica duplicada entre os dois primeiros (description/tags/contagem de membros coalescidos quase idênticos nos dois arquivos).

`src/lib/data/knowledge.ts` (novo): `mapKnowledgePill`/`mapKnowledgeTrail`, puros, sem depender de React (o ícone por categoria continua resolvido no client, que é onde JSX pertence).

`src/lib/data/groups.ts` (novo): `mapGroupCard` (reaproveitado por `explorar-grupos` e `meus-grupos`) e `mapGroupMember` (`grupos/[id]`), unificando a lógica antes duplicada.

Puro refactor — sem mudança de comportamento. `admin`/`perfil`/`configuracoes`/`cadastro-profissional` ficaram de fora: sem mapper nenhum a extrair (dados passam direto, ou é client component que só faz upload de Storage).

---

## PR #38
### feat: busca full-text server-side no Acervo Digital (E8)
**Mesclado:** 2026-07-28

Busca de texto no acervo era 100% client-side (filtro em memória via `useSearch`). Migration nova: coluna `search_vector` (`tsvector`, `generated always as`) + índice GIN em `library_items` (`title` + `author_name` + `tags`).

`array_to_string` (usado para juntar `tags` num texto) é `STABLE`, não `IMMUTABLE` — Postgres rejeita isso em coluna gerada. Corrigido com uma função wrapper `immutable_array_to_string` (com `search_path` fixo, sem o warning de search_path mutável).

Nova Server Action `buscarItensAcervo(query)` usa `.textSearch('search_vector', ..., { type: 'websearch' })`, reaproveita `mapLibraryRow` e replica o merge de favoritos já existente em `acervo-digital/page.tsx`. `client-page.tsx`: busca de texto desacoplada do `useSearch` (que fica só com filtro de tipo + ordenação) — debounce de 300ms chama a action e faz upsert dos resultados, preservando o toggle de favorito otimista.

Full-text em `/profissionais` ficou de fora — os chips de especialidade usavam um prefixo truncado para casar variações de gênero via `.includes()` em JS, incompatível com correspondência por lexema do Postgres sem reimplementar prefix-matching. Registrado como pendência, resolvida depois (PRs #43/#44).

---

## PR #39
### docs: corrige linhas desatualizadas na tabela de priorização
**Mesclado:** 2026-07-28

`F1`/`F2`/`F3`/`F5`/`U1`/`U6`/`Q2`-`Q5` já estavam ✅ nas fichas detalhadas de `plano-finalizacao-completa.md`, mas a linha resumo na matriz de priorização não tinha sido atualizada. `Q1` ("validar CI verde no PR") também marcado ✅ — critério satisfeito continuamente desde então, em todos os PRs mesclados nesta sessão.

Puro ajuste de documentação, sem mudança de código.

---

## PR #40
### feat: upload de imagem ao sugerir item do acervo (E3/F7)
**Mesclado:** 2026-07-28

Migration nova: `posts.image_url` (aditivo, para o próximo passo do upload em create-post) + 2 buckets de Storage (`library`, `posts`) com RLS restringindo insert/update/delete ao dono da pasta (`(storage.foldername(name))[1] = auth.uid()`), mesmo padrão já usado em `avatars`/`professionals`.

`AddToLibraryDialog` (`acervo-digital/client-page.tsx`) ganhou input de arquivo opcional com preview, reaproveitando o mesmo padrão de upload já usado em `cadastro-profissional/page.tsx`. `sugerirItemAcervo` ganhou parâmetro opcional `imageUrl`.

`mapLibraryRow` ajustado: `imageUrl` agora é populado sempre que `image_url` existir, não só para itens do tipo "video" (documento/jogo sugerido com capa também deve mostrar a imagem).

---

## PR #41
### feat: upload de imagem ao criar post (E3/F7 fechado)
**Mesclado:** 2026-07-28

`CreatePost` tinha um botão de imagem envolto em `FeatureInProgress` — o único stub de imagem que sobrava no fluxo de posts. Ganhou input de arquivo opcional com preview, mesmo padrão de upload já usado em `cadastro-profissional`/`AddToLibraryDialog`.

`criarPost` (`actions/community.ts`) e `buscarMaisPosts` ganharam `image_url` no select/insert. `mapPostRow` (`lib/data/community.ts`) e o tipo `Post` (`post-card.tsx`) ganharam `imageUrl`. `PostCard` renderiza a imagem (`next/image`) entre o texto e a barra de ações quando presente.

Tipos gerados do Supabase (`database.types.ts`) regenerados para incluir `posts.image_url` (coluna adicionada na migration da etapa anterior) — corrigia um erro de tipo no insert.

Com isso, `E3` (Storage) e `F7` (Adicionar ao Acervo) ficam completamente fechados — nenhum dos dois formulários que coletam mídia continua sendo stub.

---

## PR #42
### fix: reconstrói 3 arquivos de migration faltando (Supabase Preview)
**Mesclado:** 2026-07-28

O check "Supabase Preview" do GitHub Action estava falhando em `main` com "Remote migration versions not found in local migrations directory" — as 3 migrations mais recentes (busca full-text no acervo + upload de imagem, PRs #38/#40) foram aplicadas via `apply_migration` (MCP) durante a execução, mas `apply_migration` não grava o arquivo local automaticamente, só aplica no banco remoto.

Reconstruídos os 3 arquivos com o conteúdo exato enviado em cada chamada (confirmado via `mcp__Supabase__list_migrations` contra o `schema_migrations` remoto): `20260728121355_add_library_items_search_vector.sql`, `20260728121824_fix_immutable_array_to_string_search_path.sql`, `20260728174403_add_posts_image_url_and_buckets.sql`.

`supabase/migrations/README.md` atualizado com a nota "sempre criar o arquivo `.sql` correspondente no mesmo commit" para não repetir o gap.

---

## PR #43
### fix: cadastro profissional passa a gravar specialty (causa raiz de /profissionais)
**Mesclado:** 2026-07-28

O formulário de inscrição (`/cadastro-profissional`) nunca coletava nem gravava a especialidade em `professionals`/`clinics` — só as linhas de seed tinham o campo preenchido, tornando a busca por especialidade decorativa para qualquer cadastro real. Adiciona lista canônica compartilhada (`src/lib/data/specialties.ts`), Select no cadastro (com opção "Outro"), campo livre para clínicas, e grava `specialty` nos dois inserts de `inscreverProfissional`.

Migration canoniza os 5 valores de `specialty` das linhas demo para a lista nova. Os chips de `/profissionais` deixam de reaproveitar o estado de busca por texto (prefixo truncado + `.includes()`) e passam a filtrar por igualdade exata via `matchesFilter` do `useSearch`, desacoplado da busca por nome.

Paginação e busca full-text em `/profissionais` continuaram pendentes (etapa seguinte, PR #44) — esta entrega resolveu só a causa raiz que impedia reabrir esse escopo.

---

## PR #44
### feat: paginação + busca full-text server-side em /profissionais
**Mesclado:** 2026-07-28

Reabre o escopo de `E2` (paginação) e `E8` (full-text) para `/profissionais`, que ficava fora dessas duas entregas por causa do mecanismo de chips de especialidade baseado em prefixo truncado (corrigido pela etapa anterior, PR #43).

Migration `add_professionals_clinics_search_vector` adiciona `search_vector` (`tsvector` gerado) + índice GIN em `professionals`/`clinics`. `page.tsx` busca a primeira página de cada lista (10 profissionais, 6 clínicas) via `.range()`; novas Server Actions em `actions/professionals.ts`: `buscarMaisProfissionais`/`buscarMaisClinicas` (paginação "carregar mais", ligadas aos 2 botões que eram stubs) e `filtrarProfissionais` (filtro por especialidade exata e/ou busca full-text por nome, substituindo o filtro em memória por página única que não escalava com paginação real).

`client-page.tsx`: clique num chip dispara a busca na hora; digitar no campo de nome dispara com debounce de ~300ms; quando nenhum filtro/busca está ativo, volta a mostrar as listas paginadas localmente.

Tipos do Supabase regenerados (`database.types.ts`) para refletir a nova coluna `search_vector`.

---

## PR #45
### chore: remove código morto de stubs já resolvidos (FeatureInProgress)
**Mesclado:** 2026-07-28

Todos os itens de navegação do header já apontavam para rotas reais desde rodadas anteriores (nenhum `navItem` usava `isFeature: true` há tempo) — o branch morto que envolvia o item em `FeatureInProgress` nunca mais era alcançado. Em `header-secondary.tsx`, `renderNavItem` e `renderMobileNavItem` eram funções idênticas duplicadas; unificadas em uma só. Sem mais nenhum uso no código, o componente `FeatureInProgress` também foi removido.

Corrige também duas linhas da matriz-resumo em `plano-finalizacao-completa.md` (`E2`/`E8`) que ainda diziam "profissionais fora de escopo" mesmo com as fichas detalhadas já atualizadas para ✅ na entrega anterior.

---

## PR #46
### perf: ISR em rotas públicas, consolidar queries de profissionais/[id]
**Mesclado:** 2026-07-28

Implementa `H3`, `H4` e `H5` de `docs/architecture/harmonia-supabase-vercel.md` (ordem: H5 antes de H3, já que ISR exige tirar a leitura de cookies primeiro — `cookies()` força renderização dinâmica mesmo com `revalidate`).

`H5` — `lib/data/news.ts` (`getNews`/`getNewsBySlug`), `profissionais/page.tsx`, `profissionais/[id]/page.tsx` e as 3 Server Actions de `actions/professionals.ts` passam a usar `createStaticClient()` em vez de `createClient(await cookies())` — nenhum desses pontos personaliza por usuário logado, só leem dado público.

`H3` — `export const revalidate = 300` em `noticias/page.tsx`, `profissionais/page.tsx` e `profissionais/[id]/page.tsx`. `noticias-ai/page.tsx` fica de fora (`force-dynamic` proposital, chama IA a cada request) e `acervo-digital/page.tsx` também (busca favoritos do usuário logado, dado genuinamente personalizado) — build confirma `/noticias` e `/profissionais` saindo de `ƒ Dynamic` para `○ Static` com revalidate de 5 min.

`H4` — `profissionais/[id]/page.tsx` consolidado de até 4 queries (profissional + skills + experiences + reviews) para 1, usando relações aninhadas do PostgREST; branch de clínica de 2 para 1. Validado via `execute_sql` confirmando os relacionamentos (skills/experiences/reviews por profissional) e o caminho de array vazio (nenhum profissional demo tem review ainda).

---

## PR #47
### feat: trilhas de conhecimento com passos reais e progresso (sem quiz)
**Mesclado:** 2026-07-29

`trail_progress` existia desde a migration inicial, mas as trilhas não tinham nenhum conteúdo — "Continuar Trilha" em `/noticias-gamificadas` não tinha `onClick` nem `href`, era inerte.

Migration nova cria `knowledge_trail_steps` (passos ordenados por trilha, leitura pública/escrita admin) e `trail_step_completions` (conclusão por usuário, RLS restrita ao dono), com seed de 4 passos reais para cada uma das 2 trilhas demo existentes.

Nova rota `/noticias-gamificadas/trilhas/[id]` lista os passos em `Accordion` com checkbox de conclusão; nova Server Action `alternarPassoConcluido` faz o toggle e recalcula `trail_progress.progress` no mesmo request. Botão "Continuar Trilha" vira link real; barra de progresso trocada pelo `Progress` do shadcn (já existia no projeto, não era usado).

Quiz semanal continua decorativo — fora de escopo, exigiria um sistema de pontos que não existe em nenhum outro lugar do app.
