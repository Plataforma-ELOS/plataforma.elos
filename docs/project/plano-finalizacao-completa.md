# 🏁 Plano de Finalização Completa — Plataforma E.L.O.S

> **Guia mestre definitivo** para levar a aplicação do estado atual até
> **produção 100% operacional**: código, Supabase, Vercel, CI/CD, testes e IA.
> Consolida e fica acima de `roadmap.md`, `security-checklist.md` e
> `pr-description.md`.
>
> Branch de trabalho: `claude/new-session-8sdpjq` · Última auditoria: 2026-07-24.

---

## 1. Resumo Executivo & Diagnóstico Atual

A base está **arquiteturalmente sólida e verde** (`typecheck` 0 erros · `test`
16/16 · `build` 0 avisos, 22 rotas). Não há regressão de código. O que separa
o projeto do "100% em produção" é, em ordem de peso: **(a) configuração externa**
de painel (Supabase Auth, env vars na Vercel), **(b) algumas features de núcleo
ainda em stub/mock** (eventos, editar post, área do cuidador) e **(c) dívidas de
qualidade/escala** (tipos gerados, mais testes, imagens em Storage).

### % de conclusão estimado por módulo

| Módulo | Conclusão | Observação |
|---|---:|---|
| Autenticação (login/cadastro/logout/middleware) | 90% | Código pronto; falta config de Auth no painel (G1) |
| Comunidade — feed/curtir/salvar/comentar/excluir/**criar** | 95% | Falta editar post (F2); eventos da sidebar são mock (F1) |
| Grupos (explorar/meus/criar) | 100% | Completo |
| Notícias + Notícias IA | 90% | Precisa `GEMINI_API_KEY` p/ resumo IA (G3) |
| Notícias gamificadas | 85% | Trilhas exibem progresso; sem conteúdo/quiz (E-extra) |
| Acervo digital (+ **favoritar**) | 95% | Upload de material ainda é stub (F7/E3) |
| Profissionais (listagem/busca/detalhe/reviews) | 95% | "Agendar consulta" e "compartilhar" em stub (F3/F4) |
| Fale conosco | 85% | Grava no banco; e-mail depende de `EMAILJS_*` (G3) |
| Cadastro profissional | 100% | Completo |
| Área do cuidador (dependentes/diário) | 0% | Tabelas existem, **sem UI** (F5) |
| CI/CD | 100% | `.github/workflows/ci.yml` criado |
| Banco/RLS/migrations | 100% | 22 tabelas, RLS 22/22, 7 migrations sincronizadas |

### Serviços externos integrados

| Serviço | Papel | Estado |
|---|---|---|
| **Supabase** | Banco Postgres, Auth, RLS | Projeto `Plataforma_ELOS` (`azbfrxrqwuhbffofdrct`), pronto; 1 warning de advisor (G2) |
| **Vercel** | Hospedagem/deploy | Projeto `elos` (team `Renato_Dev`); prod `plataforma-elos-app.vercel.app`; deploy de prod só de `main` |
| **Google Gemini via Genkit** | IA (suporte jurídico, resumo de notícias) | Precisa `GEMINI_API_KEY` |
| **EmailJS** | E-mail do "Fale conosco" | Precisa `NEXT_PUBLIC_EMAILJS_*` |
| **GitHub Actions** | CI (typecheck/test/build) | Workflow criado; roda ao abrir PR |

### ✅ Já concluído nesta branch (baseline)
Desacople do Firebase · refactor feature-based · migração de **todas** as telas
de dados para Supabase · busca real de profissionais (`useSearch`) · Vitest (16
testes) · sanitização XSS nas notícias · sincronização das 7 migrations · **CI**
· **favoritar no acervo** · **criar post na comunidade**.

---

## 2. Matriz de Priorização (ordem de execução)

Prioridade: **P0** bloqueador de go-live · **P1** funcionalidade core · **P2**
qualidade · **P3** escala/polimento. Dificuldade: Baixa/Média/Alta/Muito Alta.

| ID | Tarefa | Categoria | Prio | Dific. | Estimativa | Depende de |
|---|---|---|---|---|---|---|
| G1 | Configurar Supabase Auth (Site/Redirect URLs + confirm-email) | Painel Supabase | P0 | Baixa | 20 min | — |
| G2 | Habilitar Leaked Password Protection | Painel Supabase | P0 | Baixa | 5 min | — |
| G3 | Preencher env vars na Vercel (7 chaves, 3 ambientes) | Config Vercel | P0 | Baixa | 30 min | — |
| G4 | Criar usuário admin (`profiles.role='admin'`) | Painel Supabase | P0 | Baixa | 10 min | G1 |
| G5 | Abrir PR → validar Preview → merge em `main` | Processo | P0 | Baixa | 1 h | G1–G4, CI |
| F1 | Eventos reais (tabela `events` + criar evento) | Código | P1 | Alta | 1–2 dias | G5 |
| F2 | Editar post/comentário | Código | P1 | Média | meio dia | G5 |
| F3 | Compartilhar (Web Share/copiar link) | Código | P1 | Baixa | 2 h | — |
| F4 | Agendar consulta (profissional) | Código | P1 | Alta | 1–2 dias | decisão produto |
| F5 | Área do cuidador (dependentes + diário) | Código | P1 | Muito Alta | 3+ dias | G5 |
| F6 | Resolver stubs de nav (header/footer) | Código/UX | P1 | Baixa | 2 h | — |
| Q1 | Validar CI verde no PR | CI/CD | P2 | Baixa | 15 min | G5 |
| Q2 | Tipos gerados do Supabase (tirar `any`) | Código | P2 | Média | meio dia | — |
| Q3 | Ampliar testes (actions/data/componentes) | Testes | P2 | Média | 1–2 dias | Q2 |
| Q4 | `error.tsx`/`loading.tsx` por rota | Código | P2 | Baixa | meio dia | — |
| Q5 | ESLint + reativar `lint` no build | Config | P2 | Média | meio dia | — |
| Q6 | E2E (Playwright) dos fluxos críticos | Testes | P2 | Alta | 1–2 dias | G1 |
| E1 | Server Components nas telas client-fetch | Arquitetura | P3 | Alta | 1–2 dias | Q2 |
| E2 | Paginação (`SearchPagination`) | Código | P3 | Média | meio dia | — |
| E3 | Supabase Storage (imagens) + F7 upload | Código/Infra | P3 | Alta | 1–2 dias | — |
| E4 | Rate limiting nos inserts públicos | Supabase/Infra | P3 | Média | meio dia | — |
| E5 | Workflow de verificação de profissionais | Código | P3 | Alta | 1–2 dias | E6 |
| E6 | Painel administrativo | Código | P3 | Muito Alta | 3+ dias | G4 |
| E7 | Notificações | Código | P3 | Muito Alta | 3+ dias | — |
| E8 | Busca server-side (full-text) | Código/Supabase | P3 | Alta | 1–2 dias | E1 |

---

## 3. Detalhamento Fino (fichas por tarefa)

### [G1] Configurar Supabase Auth (Site URL, Redirect URLs, confirmação de e-mail)
- **Categoria:** Painel Supabase
- **Relevância:** Sem isso, login/cadastro **não completam** em produção — o link de confirmação de e-mail aponta para o lugar errado e a sessão não persiste. É o bloqueador nº 1 do go-live.
- **Prioridade:** P0 · **Dificuldade:** Baixa · **Tempo:** ~20 min · **Dependências:** —

#### 🎯 Passo a passo
1. Abrir `https://supabase.com/dashboard/project/azbfrxrqwuhbffofdrct/auth/url-configuration`.
2. **Site URL:** `https://plataforma-elos-app.vercel.app`.
3. **Redirect URLs:** adicionar `https://plataforma-elos-app.vercel.app/**` e, se quiser previews, `https://*.vercel.app/**`.
4. Em `Authentication → Providers → Email`: para **demo**, desligar "Confirm email"; para **produção real**, manter ligado (o passo 2/3 faz o link funcionar).

#### ✅ Critério de aceite
- [ ] Cadastro cria conta e, conforme a escolha, loga direto (confirm off) ou envia e-mail cujo link retorna logado ao app.
- [ ] Após login, refresh mantém a sessão (cookie válido).

---

### [G2] Habilitar Leaked Password Protection
- **Categoria:** Painel Supabase · **Prio:** P0 · **Dificuldade:** Baixa · **Tempo:** ~5 min · **Dependências:** —
- **Relevância:** Único aviso do Security Advisor. Bloqueia senhas vazadas (HaveIBeenPwned) — hardening de conta.

#### 🎯 Passo a passo
1. `https://supabase.com/dashboard/project/azbfrxrqwuhbffofdrct/auth/policies` (seção Password).
2. Ativar **"Leaked password protection"**.
3. (Opcional) Ativar "Minimum password strength".

#### ✅ Critério de aceite
- [ ] Security Advisor sem warnings.
- [ ] Cadastro com senha conhecidamente vazada é rejeitado.

---

### [G3] Preencher variáveis de ambiente na Vercel
- **Categoria:** Config Vercel · **Prio:** P0 · **Dificuldade:** Baixa · **Tempo:** ~30 min · **Dependências:** —
- **Relevância:** Sem as chaves, Supabase/IA/e-mail não operam no deploy. As chaves do Supabase são públicas (respeitam RLS); `GEMINI` e `EMAILJS` habilitam IA e e-mail.

#### 🎯 Passo a passo
1. `vercel.com` → projeto `elos` → **Settings → Environment Variables**.
2. Adicionar em **Production, Preview e Development**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://azbfrxrqwuhbffofdrct.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = *(a publishable key do projeto)*
   - `GEMINI_API_KEY` = *(chave do Google AI Studio)*
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_AUTORESPONDER_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
3. Redeploy (ou próximo push) para aplicar. **Nunca** usar a `service_role` key no front.

#### ✅ Critério de aceite
- [ ] Deploy de Preview carrega dados do Supabase (comunidade/acervo/profissionais).
- [ ] `/suporte-ia` responde; "Fale conosco" envia e-mail.

---

### [G4] Criar usuário admin
- **Categoria:** Painel Supabase · **Prio:** P0 · **Dificuldade:** Baixa · **Tempo:** ~10 min · **Dependências:** G1
- **Relevância:** As policies de escrita de conteúdo (notícias, aprovar acervo) e o futuro painel dependem de `private.is_admin()`, que checa `profiles.role='admin'`.

#### 🎯 Passo a passo
1. Criar/entrar com a conta que será admin (via app, para disparar o trigger `handle_new_user`).
2. No SQL Editor do Supabase, rodar:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'ADMIN@EXEMPLO.COM');
   ```

#### ✅ Critério de aceite
- [ ] `select private.is_admin()` retorna `true` autenticado como esse usuário.
- [ ] Esse usuário consegue inserir em `news_articles`/aprovar `library_items`.

---

### [G5] Abrir PR, validar Preview e mergear em `main`
- **Categoria:** Processo · **Prio:** P0 · **Dificuldade:** Baixa · **Tempo:** ~1 h · **Dependências:** G1–G4, CI
- **Relevância:** Publica a branch (16 commits) em produção. Corpo do PR já pronto em `docs/project/pr-description.md`.

#### 🎯 Passo a passo
1. Abrir PR `claude/new-session-8sdpjq → main` (usar `docs/project/pr-description.md`).
2. Aguardar **CI verde** + Preview Deployment.
3. Rodar o smoke test da Seção 5 no Preview.
4. Merge → deploy de produção automático a partir de `main`.

#### ✅ Critério de aceite
- [ ] CI verde no PR; Preview validado.
- [ ] Produção em `plataforma-elos-app.vercel.app` funcional.

---

### [F1] Eventos reais na comunidade
- **Categoria:** Código Next.js + Supabase · **Prio:** P1 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** G5
- **Relevância:** A sidebar da `/comunidade` usa `allCommunityEvents` (mock); a tabela `events` existe e está vazia. É a última tela com mock.

#### 🎯 Passo a passo
1. Criar `src/lib/data/events.ts` com `getEventos()` (query `events` ordenada por `starts_at`), espelhando `src/lib/data/library.ts`.
2. Substituir `allCommunityEvents` em `src/app/comunidade/page.tsx` por dados reais.
3. Criar Server Action `criarEvento` (espelhar `criarGrupo` em `src/app/actions/groups.ts`) inserindo em `events` (`created_by = auth.uid()`), e uma tela/modal de criação.
4. (RLS já pronta: leitura pública, escrita do dono/admin.)

#### ✅ Critério de aceite
- [ ] Sidebar mostra eventos do banco; criar um evento reflete na lista.
- [ ] `allCommunityEvents` removido; `typecheck`/`build` verdes.

---

### [F2] Editar post e comentário
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Média · **Tempo:** meio dia · **Dependências:** G5
- **Relevância:** Hoje "Editar Post" é `FeatureInProgress` em `post-card.tsx` (linha ~114). Excluir já funciona.

#### 🎯 Passo a passo
1. Nova action `editarPost(postId, conteudo)` em `src/app/actions/community.ts` (checar dono via RLS `posts_update_own`).
2. Trocar o `FeatureInProgress` do item "Editar Post" por um modal com `Textarea` pré-preenchido.
3. Atualização otimista + `revalidatePath('/comunidade')`.

#### ✅ Critério de aceite
- [ ] Autor edita o próprio post; muda no feed. Não-autor não vê a opção.

---

### [F3] Compartilhar (post e perfil profissional)
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Baixa · **Tempo:** ~2 h · **Dependências:** —
- **Relevância:** Botões "Compartilhar" em `post-card.tsx` e `profissionais/[id]/client-page.tsx` são stub.

#### 🎯 Passo a passo
1. Criar util `compartilhar(url, titulo)` usando `navigator.share` com fallback para `navigator.clipboard.writeText` + toast "Link copiado".
2. Ligar os botões (remover `FeatureInProgress`).

#### ✅ Critério de aceite
- [ ] Em mobile abre o share nativo; em desktop copia o link e avisa.

---

### [F4] Agendar consulta
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** decisão de produto
- **Relevância:** Stub em `profissionais/[id]/client-page.tsx`. Requer definir o modelo (formulário de contato? calendário? integração externa?).

#### 🎯 Passo a passo
1. **Decidir escopo** (MVP sugerido: formulário que registra intenção de contato + notifica o profissional por e-mail).
2. Modelar tabela `appointments` (nova migration) ou reusar contato.
3. Implementar action + UI.

#### ✅ Critério de aceite
- [ ] Usuário logado solicita e recebe confirmação; profissional é notificado.

---

### [F5] Área do cuidador (dependentes + diário)
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Muito Alta · **Tempo:** 3+ dias · **Dependências:** G5
- **Relevância:** `dependents` e `caregiver_journal` existem com RLS "dono", **sem nenhuma UI**. É uma área nova de produto (o "cuidar de quem cuida").

#### 🎯 Passo a passo
1. Novas rotas (ex.: `/meu-espaco`), Server Actions de CRUD para `dependents` e `caregiver_journal`.
2. Camada de dados em `src/lib/data/caregiver.ts`.
3. Telas: lista/edição de dependentes; diário com humor + texto por data.

#### ✅ Critério de aceite
- [ ] Cuidador cria/edita dependentes e entradas de diário; só vê os próprios dados (RLS).

---

### [F6] Resolver stubs de navegação (header/footer)
- **Categoria:** Código/UX · **Prio:** P1 · **Dificuldade:** Baixa · **Tempo:** ~2 h · **Dependências:** —
- **Relevância:** `header.tsx`, `header-secondary.tsx` e `footer.tsx` têm vários itens de menu/links em `FeatureInProgress` ("em breve"). Decidir por item: ligar à rota existente **ou** ocultar até existir.

#### 🎯 Passo a passo
1. Listar cada `FeatureInProgress` nesses 3 arquivos e mapear para uma rota real (várias já existem) ou remover.
2. Ligar os que têm destino; ocultar os sem destino.

#### ✅ Critério de aceite
- [ ] Nenhum link de nav leva a "em breve" sem motivo; navegação coerente.

---

### [Q1] Validar CI verde no PR
- **Categoria:** CI/CD · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** ~15 min · **Dependências:** G5
- **Relevância:** O workflow `.github/workflows/ci.yml` só executa de fato quando chega ao GitHub (via PR). Confirmar que `typecheck/test/build` passam no runner.

#### ✅ Critério de aceite
- [ ] Check "CI" verde no PR (todos os passos).

---

### [Q2] Tipos gerados do Supabase (eliminar `any`)
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Média · **Tempo:** meio dia · **Dependências:** —
- **Relevância:** Várias queries usam `any` (ex.: `comunidade/page.tsx`, `profissionais/[id]/page.tsx`). Tipos gerados pegam erros de schema em tempo de compilação.

#### 🎯 Passo a passo
1. `npx supabase gen types typescript --project-id azbfrxrqwuhbffofdrct > src/lib/supabase/database.types.ts` (requer PAT).
2. Tipar os clients (`createBrowserClient<Database>`/`createServerClient<Database>`) e remover os `any` das queries.

#### ✅ Critério de aceite
- [ ] `tsc` continua limpo; nenhuma query com `any` explícito nas telas migradas.

---

### [Q3] Ampliar cobertura de testes
- **Categoria:** Testes · **Prio:** P2 · **Dificuldade:** Média · **Tempo:** 1–2 dias · **Dependências:** Q2
- **Relevância:** Hoje só `utils`, `format`, `use-search` (16 testes). Falta cobrir Server Actions, camada `lib/data/*` e componentes.

#### 🎯 Passo a passo
1. Testes de componente (`SearchBar`, `SearchFilters`, `PostCard`) com Testing Library.
2. Testes de `mapLibraryRow`/`mapProfessionalCard`/`computeReviewSummary` (`lib/data`).
3. (Opcional) mocks do client Supabase para as actions.

#### ✅ Critério de aceite
- [ ] Cobertura sobe de forma significativa; `npm run test` verde.

---

### [Q4] Estados de erro/carregamento por rota
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** meio dia · **Dependências:** —
- **Relevância:** Hoje só há flags `carregando` manuais. `error.tsx`/`loading.tsx` do App Router dão fallback consistente.

#### ✅ Critério de aceite
- [ ] Cada rota de dados tem `loading` e `error` boundary.

---

### [Q5] Configurar ESLint e reativar `lint` no build
- **Categoria:** Config · **Prio:** P2 · **Dificuldade:** Média · **Tempo:** meio dia · **Dependências:** —
- **Relevância:** Repo não tem ESLint (`next.config.ts` usa `eslint.ignoreDuringBuilds`). Sem lint, dívidas passam despercebidas.

#### 🎯 Passo a passo
1. `npm i -D eslint eslint-config-next`; criar `.eslintrc.json` (`extends: next/core-web-vitals`).
2. Corrigir os apontamentos; remover `ignoreDuringBuilds` do `next.config.ts`; adicionar `lint` ao CI.

#### ✅ Critério de aceite
- [ ] `npm run lint` roda sem prompt e passa; CI inclui o passo.

---

### [Q6] E2E com Playwright
- **Categoria:** Testes · **Prio:** P2 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** G1
- **Relevância:** Validar fluxos críticos (login→post→curtir; favoritar; grupos) ponta-a-ponta contra Supabase real (fora do sandbox, que bloqueia o host).

#### ✅ Critério de aceite
- [ ] Suíte E2E cobre login, criar post, favoritar, grupos — verde contra o Preview.

---

### [E1] Migrar telas client-fetch → Server Components
- **Categoria:** Arquitetura · **Prio:** P3 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** Q2
- **Relevância:** 6 telas buscam no browser (`comunidade`, `profissionais`, `acervo`, `explorar/meus-grupos`, `fale-conosco`). Server Components melhoram SEO/perf e reduzem JS no cliente.

#### ✅ Critério de aceite
- [ ] Dados carregam no servidor; interações continuam via Server Actions.

---

### [E2] Paginação
- **Categoria:** Código · **Prio:** P3 · **Dificuldade:** Média · **Tempo:** meio dia · **Dependências:** —
- **Relevância:** Posts e profissionais crescem; o `useSearch` já foi desenhado para receber um `SearchPagination`.

#### ✅ Critério de aceite
- [ ] Listagens paginam (range no Supabase); busca continua funcionando.

---

### [E3] Supabase Storage para imagens (+ F7 upload no acervo)
- **Categoria:** Código/Infra · **Prio:** P3 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** —
- **Relevância:** Hoje tudo é `placehold.co`. Produto real precisa de upload (avatar, capa de material). O upload no `create-post`/acervo é stub (F7).

#### 🎯 Passo a passo
1. Criar bucket(s) no Storage com policies; adicionar `*.supabase.co` em `next.config.ts` `images.remotePatterns`.
2. Componente de upload → URL pública salva na coluna `image_url`/`avatar_url`.

#### ✅ Critério de aceite
- [ ] Upload funciona; imagens próprias renderizam via `next/image`.

---

### [E4] Rate limiting / anti-abuso nos inserts públicos
- **Categoria:** Supabase/Infra · **Prio:** P3 · **Dificuldade:** Média · **Tempo:** meio dia · **Dependências:** —
- **Relevância:** `contact_messages` e `reviews` aceitam insert público/autenticado; RLS não limita volume. Risco de spam.

#### ✅ Critério de aceite
- [ ] Limite por IP/usuário aplicado (edge middleware, ou coluna+trigger de janela).

---

### [E5] Workflow de verificação de profissionais
- **Categoria:** Código · **Prio:** P3 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** E6
- **Relevância:** Todo `professionals.verification_status` está `pending`; falta o fluxo admin de aprovar/rejeitar e exibir o selo "verificado".

#### ✅ Critério de aceite
- [ ] Admin aprova/rejeita; UI mostra selo só para `verified`.

---

### [E6] Painel administrativo
- **Categoria:** Código · **Prio:** P3 · **Dificuldade:** Muito Alta · **Tempo:** 3+ dias · **Dependências:** G4
- **Relevância:** `private.is_admin()` e policies já existem; falta a UI (moderar posts, aprovar acervo/profissionais, publicar notícias).

#### ✅ Critério de aceite
- [ ] Rota `/admin` protegida por `is_admin`; CRUD de conteúdo funcionando.

---

### [E7] Notificações · [E8] Busca server-side (full-text)
- **Prio:** P3 · **Dificuldade:** Muito Alta / Alta.
- **E7:** notificar curtidas/comentários/aprovações (tabela `notifications` + realtime).
- **E8:** busca full-text no Postgres (`tsvector`) em vez de filtro client-side.
- **Aceite:** [ ] notificações chegam em tempo real · [ ] busca global rápida server-side.

---

## 4. Sprints de Execução Sugeridas

### 🚀 Sprint 0 — Go-Live & Desbloqueio (P0, majoritariamente painel)
`G1 → G2 → G3 → G4 → G5`. **Resultado:** app operável em produção. Junto: quick wins **F3** (compartilhar) e **F6** (nav).

### 🧩 Sprint 1 — Conclusão do Núcleo Funcional
`F1 (eventos)` · `F2 (editar)` · início de `F5 (cuidador)`. **F4** conforme decisão de produto.

### 🛡️ Sprint 2 — Qualidade, CI/CD e Blindagem
`Q1 (CI verde)` → `Q2 (tipos Supabase)` → `Q3 (testes)` → `Q4/Q5`. `Q6` quando houver ambiente com Supabase acessível.

### 📈 Sprint 3 — Escalabilidade & Polimento de UX
`E3 (Storage/imagens)` · `E2 (paginação)` · `E1 (Server Components)` · `E4` · depois `E6/E5/E7/E8`.

---

## 5. Checklist de Verificação para Produção (QA final)

**Antes de mergear em `main` / promover produção:**
- [ ] `npm run typecheck` → 0 erros.
- [ ] `npm run test` → verde.
- [ ] `npm run build` → 0 avisos, 22 rotas.
- [ ] **CI verde** no PR (GitHub Actions).
- [ ] Env vars presentes nos 3 ambientes da Vercel (7 chaves) — sem `service_role` no front.
- [ ] Supabase Auth: Site URL + Redirect URLs corretos; decisão de confirm-email aplicada (G1).
- [ ] Security Advisor sem warnings (Leaked Password Protection ligado — G2).
- [ ] Usuário admin criado e `is_admin()` = true (G4).
- [ ] `vercel.json` intacto (`{"framework":"nextjs"}`) — define o preset (projeto tem `framework:null`).
- [ ] Sanitização XSS ativa nas notícias (`isomorphic-dompurify` em `noticias/[slug]` e `noticias-ai/[slug]`).
- [ ] RLS habilitada nas 22 tabelas (ver `docs/architecture/security-checklist.md`).
- [ ] **Smoke test no Preview:** cadastro → login → criar post → curtir/comentar → favoritar acervo → entrar/sair de grupo → enviar "Fale conosco" → detalhe de profissional/review → suporte IA responde.
- [ ] Sem mocks nas telas de dados (após F1, `allCommunityEvents` removido).

---

## Documentos relacionados
- Roadmap resumido: [`./roadmap.md`](./roadmap.md)
- Segurança/RLS + hardening: [`../architecture/security-checklist.md`](../architecture/security-checklist.md)
- Corpo do PR: [`./pr-description.md`](./pr-description.md)
- Histórico de migrations: [`../../supabase/migrations/README.md`](../../supabase/migrations/README.md)
- Relatório da refatoração: [`./refactor-report.md`](./refactor-report.md)
