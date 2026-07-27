# 🏁 Plano de Finalização Completa — Plataforma E.L.O.S

> **Guia mestre definitivo** para levar a aplicação do estado atual até
> **produção 100% operacional**: código, Supabase, Vercel, CI/CD, testes e IA.
> Consolida e fica acima de `roadmap.md`, `security-checklist.md` e
> `pr-description.md`.
>
> Branch de trabalho: `claude/new-session-8sdpjq` · Última auditoria: 2026-07-27.
>
> **Atualização 2026-07-27:** incorporado um backlog de UI/UX (categoria `U`)
> a partir de uma revisão de produto — 6 telas novas, 3 fluxos de navegação a
> corrigir, 2 bugs de interação e uma auditoria de contraste no tema claro.
> Ver também a reversão do item `F4`.
>
> **Atualização 2026-07-27 (2):** implementados os itens mais simples do
> backlog `U` — `U7`, `U8`, `U10`, `U11`, `U12` (ver fichas abaixo, marcadas
> ✅). `U10` e `U11` tiveram o diagnóstico corrigido durante a implementação
> (o código já estava mais correto do que a primeira leitura sugeria).

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
| Perfil do usuário (`/perfil`) | 0% | `profiles` já tem `full_name`/`avatar_url`/`bio`; sem tela (U2) |
| Itens salvos (`/salvos`) | 20% | Dado já existe (`post_saves`, `library_favorites`); falta tela unificada (U3) |
| Configurações (`/configuracoes`) | 30% | Tema e tamanho de fonte já funcionam (dropdown do header); falta tela dedicada + notificações/privacidade (U4) |
| Central de Ajuda (`/ajuda`) | 60% | `/faq` já existe com 6 perguntas; falta busca por tópico + link para contato (U5) |
| Boas-vindas ao entrar em grupo | 0% | Não existe nem página de detalhe do grupo (`/comunidade/grupos/[id]`) (U1) |
| Notificações (`/notificacoes`) | 0% | Mesma lacuna do item `E7`; sem tabela nem UI (U6) |

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
| F4 | ~~Agendar consulta (profissional)~~ **substituído por U12** | Código | — | — | — | ver U12 |
| F5 | Área do cuidador (dependentes + diário) | Código | P1 | Muito Alta | 3+ dias | G5 |
| F6 | Resolver stubs de nav (header/footer) | Código/UX | P1 | Baixa | 2 h | — |
| U1 | Tela de boas-vindas ao entrar em grupo | Código | P1 | Média | 1 dia | precisa de `/comunidade/grupos/[id]` (não existe) |
| U2 | ✅ Tela de perfil do usuário (`/perfil`) | Código | P1 | Média | meio dia | — |
| U3 | ✅ Itens salvos (`/salvos`) unificando posts + acervo | Código | P1 | Média | meio dia | — |
| U4 | ✅ Tela de configurações (`/configuracoes`) | Código | P2 | Média | meio dia | — |
| U5 | ✅ Central de Ajuda — evoluir `/faq` | Código/UX | P2 | Baixa | meio dia | — |
| U6 | Central de notificações (`/notificacoes`) | Código/Supabase | P2 | Alta | 1–2 dias | mesmo escopo de `E7` |
| U7 | ✅ Loading skeleton ao clicar em manchete de notícia | Código | P2 | Baixa | 2 h | mesmo escopo de `Q4` |
| U8 | ✅ Clique em documento do acervo → preview/download correto | Código | P2 | Baixa | 2 h | — |
| U9 | Clique em "Próximos eventos" → detalhe/modal | Código | P2 | Baixa | 2 h | depende de `F1` (eventos ainda são mock) |
| U10 | ✅ Bug: chips de tópico no Suporte IA parecem não responder | Código | P1 | Baixa | 1 h | — |
| U11 | ✅ Bug: clique em especialidade sem scroll até os resultados | Código | P1 | Baixa | 2 h | — |
| U12 | ✅ Remover "Agendar consulta" de profissionais/clínicas | Código | P1 | Baixa | 1 h | substitui `F4` |
| U13 | Auditoria de contraste do tema claro (WCAG AA 4.5:1) | Design/CSS | P2 | Média | meio dia | — |
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

### [F1] ✅ Eventos reais na comunidade
- **Categoria:** Código Next.js + Supabase · **Prio:** P1 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** G5
- **Relevância:** A sidebar da `/comunidade` usa `allCommunityEvents` (mock); a tabela `events` existe e está vazia. É a última tela com mock.

#### 🎯 Passo a passo
1. Criar `src/lib/data/events.ts` com `getEventos()` (query `events` ordenada por `starts_at`), espelhando `src/lib/data/library.ts`.
2. Substituir `allCommunityEvents` em `src/app/comunidade/page.tsx` por dados reais.
3. Criar Server Action `criarEvento` (espelhar `criarGrupo` em `src/app/actions/groups.ts`) inserindo em `events` (`created_by = auth.uid()`), e uma tela/modal de criação.
4. (RLS já pronta: leitura pública, escrita do dono/admin.)

#### ✅ Critério de aceite
- [x] Sidebar mostra eventos do banco; criar um evento reflete na lista.
- [x] `allCommunityEvents` removido; `typecheck`/`build` verdes.

- **Implementado em 2026-07-27:** `src/lib/data/events.ts` (`mapEventRow`, mapper puro) + `src/app/actions/events.ts` (`criarEvento`, mesmo padrão de `criarGrupo`, RLS já permite qualquer autenticado inserir com `created_by = auth.uid()`). `src/app/comunidade/page.tsx`: mock `allCommunityEvents` removido, fetch real via `createClient()` (mesmo padrão client-side já usado nesse arquivo para posts), filtrando só eventos futuros (`starts_at >= now()`), com `Dialog` "Criar Evento" na sidebar (só para logados, com `LoginRequiredDialog` para deslogados). Nova função `formatarDataHoraPtBr` em `src/lib/format.ts` (data + hora, com teste). Fora de escopo: `1B.9` (clique no evento → detalhe) não incluído.

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

### [F4] ~~Agendar consulta~~ — substituído por [U12]
- Decisão de produto revertida em 2026-07-27: em vez de construir o fluxo de agendamento, o botão "Agendar consulta" deve ser **removido** dos cards e perfis de profissionais/clínicas. Ver ficha `U12`.

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

- **Progresso parcial em 2026-07-27 (efeito colateral de `U2`–`U5`):** os 4 itens do dropdown do usuário logado ("Editar Perfil", "Itens Salvos", "Configurações", "Ajuda") em `header.tsx` **e** `header-secondary.tsx` (duplicados) trocaram `FeatureInProgress` por `Link` real para `/perfil`, `/salvos`, `/configuracoes` e `/faq`. Ainda restam: 1 `FeatureInProgress` em `footer.tsx` e os stubs cobertos por outros itens do backlog (F3 compartilhar, F7 upload).

---

### [U1] Tela de boas-vindas ao entrar em grupo
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Média · **Tempo:** ~1 dia · **Dependências:** nenhuma página de detalhe de grupo existe hoje
- **Relevância:** Hoje `/comunidade/explorar-grupos` só faz `handleJoinToggle` (entrar/sair), sem navegar a lugar nenhum — não existe rota `/comunidade/grupos/[id]`. Construir "boas-vindas" sem essa rota não tem para onde mandar o botão "Acessar Grupo".

#### 🎯 Passo a passo
1. Criar `src/app/comunidade/grupos/[id]/page.tsx` — página mínima de detalhe do grupo (nome, descrição, membros, tags), usando `groups`/`group_members` (já existem e têm RLS).
2. Ao `entrarGrupo` ter sucesso em `explorar-grupos/page.tsx`, abrir um modal (Dialog) de boas-vindas com regras/diretrizes e botão "Acessar Grupo" → `router.push('/comunidade/grupos/[id]')`.

#### ✅ Critério de aceite
- [ ] Entrar num grupo mostra o modal; "Acessar Grupo" leva a uma página real do grupo.

---

### [U2] ✅ Tela de perfil do usuário (`/perfil`)
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Média · **Tempo:** ~meio dia · **Dependências:** —
- **Relevância:** `profiles` já tem `full_name`, `avatar_url`, `bio` — só falta a tela. Hoje esses dados só existem no banco, sem nenhuma UI de visualização/edição.

#### 🎯 Passo a passo
1. `src/app/perfil/page.tsx` (Server Component) — busca o `profiles` do usuário logado.
2. Exibir avatar/nome/bio + atalhos para `/salvos`, `/configuracoes`, `/comunidade/meus-grupos`.
3. Nova Server Action `atualizarPerfil` (nome/bio/avatar) em `src/app/actions/`.

#### ✅ Critério de aceite
- [x] Usuário vê seus dados reais; edita nome/bio e salva.

- **Implementado em 2026-07-27:** `src/app/perfil/page.tsx` (Server Component, redireciona a `/login` se deslogado) + `src/app/perfil/client-page.tsx` (avatar/nome/bio, `Dialog` de edição, atalhos para `/salvos`, `/configuracoes` e `/comunidade/meus-grupos`) + `atualizarPerfil` em `src/app/actions/profile.ts`. Upload de avatar segue como stub (depende de `E3`, Storage ainda não configurado); avatar hoje é só leitura com fallback de inicial.

---

### [U3] ✅ Itens salvos (`/salvos`)
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Média · **Tempo:** ~meio dia · **Dependências:** —
- **Relevância:** O dado já existe e já é gravado — `post_saves` (comunidade) e `library_favorites` (acervo, feito nesta sessão) — só falta uma tela que junte os dois numa lista só.

#### 🎯 Passo a passo
1. `src/lib/data/saved.ts` — duas queries (posts salvos via `post_saves`, itens via `library_favorites`), unificadas num único tipo com `kind: 'post' | 'library'`.
2. `src/app/salvos/page.tsx` — lista com filtro por categoria (`useSearch` com `matchesFilter`) e botão de remover (reusa `alternarSalvo`/`alternarFavorito` já existentes).

#### ✅ Critério de aceite
- [x] Posts salvos e itens favoritados do acervo aparecem juntos; remover funciona nos dois tipos.

- **Implementado em 2026-07-27:** `src/lib/data/saved.ts` (mapeador `mapSavedPost`) + `src/app/salvos/page.tsx` (Server Component, duas queries em paralelo) + `src/app/salvos/client-page.tsx` (busca/filtro por `post`/`library` via `useSearch`, remoção otimista chamando `alternarSalvo`/`alternarFavorito`, reaproveita `DigitalLibraryCard` para os itens do acervo).

---

### [U4] ✅ Tela de configurações (`/configuracoes`)
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Média · **Tempo:** ~meio dia · **Dependências:** —
- **Relevância:** Tema (claro/escuro) e tamanho de fonte **já funcionam** hoje, só que escondidos num dropdown do header (`next-themes` + `FontSizeContext`, `header.tsx`). Falta uma tela dedicada e as preferências que ainda não existem (notificações push/e-mail, privacidade).

#### 🎯 Passo a passo
1. `src/app/configuracoes/page.tsx` — reaproveitar `useTheme()`/`FontSizeContext` já existentes para tema e fonte.
2. Notificações/privacidade: como não existe coluna hoje, começar só com toggles de UI persistidos em `profiles` (nova migration, colunas `notify_email`/`notify_push`/`profile_public` ou similar) — ou, mais simples para uma primeira versão, guardar em `localStorage` até haver necessidade real de sincronizar entre dispositivos.

#### ✅ Critério de aceite
- [x] Tema/fonte continuam funcionando, agora também nesta tela; preferências novas persistem.

- **Implementado em 2026-07-27:** migration `20260727114722_add_notification_privacy_prefs_to_profiles.sql` adiciona `notify_email`/`notify_push`/`profile_public` (boolean, default `true`) em `profiles`. `src/app/configuracoes/page.tsx` (Server Component) + `client-page.tsx` (tema/fonte via os hooks já existentes, 3 `Switch` com salvamento otimista via `atualizarPreferencias` em `src/app/actions/profile.ts`, com rollback e toast se a gravação falhar).

---

### [U5] ✅ Central de Ajuda — evoluir `/faq`
- **Categoria:** Código/UX · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** ~meio dia · **Dependências:** —
- **Relevância:** `/faq` já existe (`src/app/faq/page.tsx`) com 6 perguntas em `Accordion` — a "Central de Ajuda" pedida é essencialmente essa página evoluída, não uma tela nova do zero. Falta: busca por palavra-chave nas perguntas e um link/botão direto para `/fale-conosco`.

#### 🎯 Passo a passo
1. Adicionar `SearchBar` (já existe, reutilizável) filtrando `faqItems` por texto.
2. Adicionar CTA "Não encontrou? Fale com a gente" → `/fale-conosco`.
3. (Opcional) Renomear a rota para `/ajuda` com redirect de `/faq`, ou manter `/faq` e só linkar como "Central de Ajuda" no menu — decisão de nomenclatura, não estrutural.

#### ✅ Critério de aceite
- [x] Busca filtra as perguntas; CTA leva ao fale conosco.

- **Implementado em 2026-07-27:** mantida a rota `/faq` (decisão de nomenclatura: só o título virou "Central de Ajuda", sem criar rota nova/redirect). Página virou Client Component com `useSearch` filtrando `faqItems` por texto via `SearchBar`, e um `Card` de CTA "Não encontrou? Fale com a gente" linkando a `/fale-conosco`.

---

### [U6] Central de notificações (`/notificacoes`)
- **Categoria:** Código/Supabase · **Prio:** P2 · **Dificuldade:** Alta · **Tempo:** 1–2 dias · **Dependências:** mesmo escopo de `E7`
- **Relevância:** Não existe tabela `notifications` nem UI. Este item é a tela pedida na nova revisão — é o mesmo trabalho já registrado como `E7`; mantendo os dois IDs ligados para não duplicar o rastreamento.

#### 🎯 Passo a passo
1. Nova migration: tabela `notifications` (`profile_id`, `type`, `content`, `read_at`, `created_at`), RLS "dono vê as próprias".
2. Popular via trigger em curtidas/comentários/aprovações (ou Server Action explícita nos pontos existentes).
3. `src/app/notificacoes/page.tsx` — lista, marcar como lida, filtrar não lidas, limpar.

#### ✅ Critério de aceite
- [ ] Notificação é criada nos eventos certos; marcar como lida e limpar funcionam; RLS impede ver notificação de outro usuário.

---

### [U7] ✅ Loading skeleton ao clicar em manchete de notícia
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** ~2 h · **Dependências:** mesmo escopo de `Q4`
- **Relevância:** `/noticias/[slug]` e `/noticias-ai/[slug]` já existem e já funcionam (são SSG). O que faltava era o estado de carregamento entre o clique e a página aparecer.
- **Implementado em 2026-07-27:** criados `src/app/noticias/[slug]/loading.tsx` e `src/app/noticias-ai/[slug]/loading.tsx`, com skeleton (`@/components/ui/skeleton`) espelhando o layout real do artigo (link de volta, badge, título, meta, imagem, parágrafos).

#### ✅ Critério de aceite
- [x] Clique numa manchete mostra skeleton até a página carregar.

---

### [U8] ✅ Clique em documento do acervo → preview/download correto
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** ~2 h · **Dependências:** —
- **Relevância:** `digital-library-card.tsx`/`digital-library-list-item.tsx` abriam `item.actionUrl` em nova aba (`target="_blank"`) para todo tipo de item, sem oferecer download direto quando `downloadable` era `true`.
- **Implementado em 2026-07-27:** quando `item.downloadable` é `true`, o botão renderiza `<a href={item.actionUrl} download>` em vez do `<Link target="_blank">`; itens não-baixáveis mantêm o comportamento de abrir em nova aba. Aplicado nos dois componentes (card e list-item).

#### ✅ Critério de aceite
- [x] Item marcado como `downloadable` baixa o arquivo; os demais abrem em nova aba como antes.

---

### [U9] Clique em "Próximos eventos" → detalhe/modal
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** ~2 h · **Dependências:** `F1` (eventos ainda são mock)
- **Relevância:** Os cards de evento hoje vêm de `allCommunityEvents` (mock, sem `onClick`). Não faz sentido implementar o clique antes de `F1` trazer eventos reais — ficaria abrindo detalhe de dado fictício.

#### 🎯 Passo a passo
1. Depois de `F1`: adicionar `onClick`/`Dialog` no card mostrando data, horário, local/link.
2. Botão "Adicionar à agenda" (gerar `.ics`) e "Confirmar presença" (nova tabela `event_attendees` ou reaproveitar `group_members` como padrão).

#### ✅ Critério de aceite
- [ ] Clique no card abre detalhe com dado real; confirmar presença registra o usuário.

---

### [U10] ✅ Bug: chips de tópico no Suporte IA parecem não responder
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Baixa · **Tempo:** ~1 h · **Dependências:** —
- **Diagnóstico corrigido na implementação:** ao reabrir `src/app/suporte-ia/page.tsx` para implementar, vi que a página **já tinha** um `useEffect`/`scrollToBottom` que rola até `responseEndRef` sempre que `aiResponse`/`loading` mudam (linhas 77-88) — isso já funcionava, ao contrário do que eu tinha registrado. O único problema real era `handleTopicClick` chamar `setQuery(topic)` e, na linha seguinte, `setQuery('')` — as duas atualizações batcham no mesmo render, então o campo nunca chegava a mostrar o tópico clicado.
- **Implementado em 2026-07-27:** removida a chamada `setQuery('')` redundante em `handleTopicClick`. O scroll automático já existente continua funcionando sem alteração.

#### ✅ Critério de aceite
- [x] Clicar num tópico popular mostra visivelmente o que foi perguntado e rola até a resposta.

---

### [U11] ✅ Bug: clique em especialidade sem scroll até os resultados
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Baixa · **Tempo:** ~2 h · **Dependências:** —
- **Diagnóstico corrigido na implementação:** ao reabrir `src/app/profissionais/page.tsx`, vi que o estado "ativo" do card de especialidade **já existia** (`const active = query === specialty.tag`, aplicado via `cn(...)` nas classes do `Card`/`<h3>`) — não era um item faltando, como eu tinha registrado antes. O único gap real: nenhum scroll até a seção de resultados, que fica abaixo da dobra.
- **Implementado em 2026-07-27:** adicionado `resultsRef` (via `useRef`) na seção "Profissionais Liberais" e `scrollIntoView({ behavior: 'smooth', block: 'start' })` dentro de `handleSpecialtyClick`.

#### ✅ Critério de aceite
- [x] Clicar numa especialidade filtra a lista, mantém o estado ativo já existente e agora rola até os resultados.

---

### [U12] ✅ Remover "Agendar consulta" de profissionais e clínicas
- **Categoria:** Código · **Prio:** P1 · **Dificuldade:** Baixa · **Tempo:** ~1 h · **Dependências:** substitui `F4`
- **Relevância:** Decisão de produto: manter o foco em informação institucional/contato direto, não construir um fluxo de agendamento.
- **Implementado em 2026-07-27:** removido o `<footer>` fixo com o botão "Agendar Consulta" (`FeatureInProgress`) de `src/app/profissionais/[id]/client-page.tsx`, junto com o `pb-24` do `<main>` que só existia para compensar esse footer fixo. Não havia menção equivalente em `profissionais/page.tsx` (cards de listagem) — nada a remover lá. `docs/product/screen-content.md` atualizado (removida a linha "Footer Fixo: Agendar Consulta").

#### ✅ Critério de aceite
- [x] Nenhuma tela de profissional/clínica oferece "Agendar consulta"; contatos diretos (telefone/e-mail/Instagram) continuam visíveis.

---

### [U13] Auditoria de contraste do tema claro (WCAG AA)
- **Categoria:** Design/CSS · **Prio:** P2 · **Dificuldade:** Média · **Tempo:** ~meio dia · **Dependências:** —
- **Relevância:** `docs/design/style-guide.md` documenta as cores HSL do tema claro (`--muted-foreground`, `--foreground`, etc.), mas nunca foram auditadas contra WCAG AA (4.5:1). É comum `text-muted-foreground` sobre `bg-muted`/`bg-card` ficar abaixo do mínimo em temas claros pastel como este (`--muted`: lavanda muito claro).

#### 🎯 Passo a passo
1. Medir contraste real de cada par texto/fundo do tema claro (`--foreground`/`--background`, `--muted-foreground`/`--muted`, `--muted-foreground`/`--card`) com uma ferramenta de contraste (ex. extensão de DevTools ou Chrome Lighthouse).
2. Ajustar os HSLs em `globals.css`/`tailwind.config.ts` que ficarem abaixo de 4.5:1 — em geral escurecendo o `L` (lightness) de `--muted-foreground` no tema claro.
3. Repetir a checagem em qualquer uso direto de `text-gray-400`/`text-slate-300` fora das variáveis do design system (trocar por `text-gray-600`/`text-slate-700` como o pedido original sugere), documentando o ajuste em `docs/design/style-guide.md`.

#### ✅ Critério de aceite
- [ ] Todos os pares texto/fundo do tema claro medem ≥ 4.5:1; `style-guide.md` atualizado com os valores conferidos.

---

### [Q1] Validar CI verde no PR
- **Categoria:** CI/CD · **Prio:** P2 · **Dificuldade:** Baixa · **Tempo:** ~15 min · **Dependências:** G5
- **Relevância:** O workflow `.github/workflows/ci.yml` só executa de fato quando chega ao GitHub (via PR). Confirmar que `typecheck/test/build` passam no runner.

#### ✅ Critério de aceite
- [ ] Check "CI" verde no PR (todos os passos).

---

### [Q2] ✅ Tipos gerados do Supabase (eliminar `any`)
- **Categoria:** Código · **Prio:** P2 · **Dificuldade:** Média · **Tempo:** meio dia · **Dependências:** —
- **Relevância:** Várias queries usam `any` (ex.: `comunidade/page.tsx`, `profissionais/[id]/page.tsx`). Tipos gerados pegam erros de schema em tempo de compilação.

#### 🎯 Passo a passo
1. `npx supabase gen types typescript --project-id azbfrxrqwuhbffofdrct > src/lib/supabase/database.types.ts` (requer PAT).
2. Tipar os clients (`createBrowserClient<Database>`/`createServerClient<Database>`) e remover os `any` das queries.

#### ✅ Critério de aceite
- [x] `tsc` continua limpo; nenhuma query com `any` explícito nas telas migradas.

- **Implementado em 2026-07-27:** `src/lib/supabase/database.types.ts` gerado via `mcp__Supabase__generate_typescript_types` (sem precisar de PAT/CLI). `createClient`/`createStaticClient` (`src/lib/supabase/server.ts`) e `createClient` (`src/lib/supabase/client.ts`) agora usam `<Database>`. `any`/`as any` removidos de `src/app/comunidade/page.tsx` (`PostRow`) e `src/app/comunidade/explorar-grupos/page.tsx` (`GroupRow`) — os dois arquivos citados na ficha. Demais arquivos com `any` ficam para uma varredura futura (não é o escopo desta ficha).

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
`G1 → G2 → G3 → G4 → G5`. **Resultado:** app operável em produção. Junto: quick wins **F3** (compartilhar), **F6** (nav). (`U10`/`U11`/`U12` já feitos.)

### 🧩 Sprint 1 — Conclusão do Núcleo Funcional
`F1 (eventos)` · `F2 (editar)` · início de `F5 (cuidador)`. `F4` descontinuado — ver `U12`.

### 🎨 Sprint 1B — Telas de UI/UX faltantes
`U2 (perfil)` · `U3 (salvos)` · `U1 (boas-vindas grupo)` → `U5 (ajuda)` · `U4 (configurações)` → `U9 (eventos, depende de F1)` · `U6 (notificações, mesmo escopo de E7)`.

### 🛡️ Sprint 2 — Qualidade, CI/CD e Blindagem
`Q1 (CI verde)` → `Q2 (tipos Supabase)` → `Q3 (testes)` → `Q4/Q5` (mesma frente de loading states; `U7` já feito).  `Q6` quando houver ambiente com Supabase acessível.

### 📈 Sprint 3 — Escalabilidade & Polimento de UX
`E3 (Storage/imagens)` · `E2 (paginação)` · `E1 (Server Components)` · `E4` · `U13 (contraste tema claro)` · depois `E6/E5/E7/E8`. (`U8` já feito.)

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
