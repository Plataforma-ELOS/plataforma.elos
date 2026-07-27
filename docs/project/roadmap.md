# Roadmap — Plataforma E.L.O.S

Planejamento de próximos passos, ancorado no estado real do código.
Última atualização: 2026-07-27 (branch `claude/new-session-8sdpjq`).

## Estado atual (baseline)
Next.js 15 + shadcn/ui + Supabase, deploy Vercel. `typecheck` ✅, `build` ✅
(0 avisos), `test` ✅ (16, Vitest). Arquitetura refatorada (feature-based),
Firebase removido, migrations sincronizadas com o remoto. Sem regressão de
código — o que resta é config externa e evolução.

Legenda de esforço: 🟢 ≤1h · 🟡 meio dia · 🟠 1–2 dias · 🔴 3+ dias.

---

## Horizonte 0 — Go-live / Estabilização
Deixar o que já existe operável em produção (quase tudo é config, não código).

| # | Ação | Tipo | Esforço | Status |
|---|---|---|---|---|
| 0.1 | Supabase Auth: Site URL `plataforma-elos-app.vercel.app` + Redirect URLs; decidir confirm-email | Painel | 🟢 | ⬜ |
| 0.2 | Ligar "Criar Post" na `/comunidade` | Código | 🟢 | ✅ feito (`d17d804`) |
| 0.3 | Preencher `GEMINI_API_KEY` (Vercel + `.env.local`) → ativa `/suporte-ia` e resumo de `/noticias-ai` | Config | 🟢 | ⬜ |
| 0.4 | Preencher `NEXT_PUBLIC_EMAILJS_*` → envio de e-mail no fale-conosco (gravação no banco já funciona) | Config | 🟢 | ⬜ |
| 0.5 | Validar fluxos ponta-a-ponta na Preview da Vercel | QA | 🟡 | ⬜ |
| 0.6 | Abrir e mergear o PR → `main` (descrição em `docs/project/pr-description.md`) | Processo | 🟢 | ⬜ |

---

## Horizonte 1 — Completar o núcleo funcional
Fechar features meio-prontas e stubs `FeatureInProgress`.

| # | Ação | Esforço | Notas |
|---|---|---|---|
| 1.1 | Favoritar acervo (`library_favorites` já existe; botão hoje é stub) | 🟡 | Espelhar `alternarSalvo` |
| 1.2 | Editar post/comentário (excluir já funciona; editar é stub) | 🟡 | Nova action `editarPost` |
| 1.3 | Compartilhar (stubs em post-card e perfil) → Web Share API / copiar link | 🟢 | — |
| 1.4 | Sistema de Eventos — tabela `events` existe e vazia; comunidade mostra eventos mockados | 🟠 | CRUD + `lib/data/events.ts` |
| 1.5 | ~~Agendar consulta~~ — decisão revertida: **remover** o botão em vez de construir o fluxo | 🟢 | Ver `1.7` |
| 1.6 | Área do cuidador — `dependents` e `caregiver_journal` existem, sem UI | 🔴 | RLS já pronta (dono) |
| 1.7 | Remover "Agendar consulta" dos cards/perfis de profissionais e clínicas | 🟢 | `U12` no guia mestre |

---

## Horizonte 1B — Telas de UI/UX faltantes e correções de interação
Levantamento de produto de 2026-07-27: 6 telas que ainda não existem, 3 fluxos
de clique a corrigir, 2 bugs de feedback visual e uma auditoria de acessibilidade.
Fichas completas (com diagnóstico do código já investigado) em
`docs/project/plano-finalizacao-completa.md`, itens `U1`–`U13`.

| # | Ação | Esforço | Notas |
|---|---|---|---|
| 1B.1 | Tela de boas-vindas ao entrar em grupo | 🟠 | Precisa criar `/comunidade/grupos/[id]` (não existe) |
| 1B.2 | Perfil do usuário (`/perfil`) | 🟡 | Dado já existe em `profiles` |
| 1B.3 | Itens salvos (`/salvos`) | 🟡 | Unifica `post_saves` + `library_favorites`, ambos já existentes |
| 1B.4 | Configurações (`/configuracoes`) | 🟡 | Tema/fonte já funcionam hoje (dropdown do header); só falta tela dedicada |
| 1B.5 | Central de Ajuda | 🟢 | `/faq` já existe — é evolução, não tela nova |
| 1B.6 | Central de notificações (`/notificacoes`) | 🔴 | Mesmo escopo de `E7`; sem tabela nem UI |
| 1B.7 | Loading skeleton ao abrir notícia | 🟢 | Mesmo escopo de `2.3` (`error.tsx`/`loading.tsx`) |
| 1B.8 | Clique em documento do acervo → preview/download | 🟢 | Campo `downloadable` já existe, só não é usado |
| 1B.9 | Clique em "Próximos eventos" → detalhe | 🟢 | Depende de `1.4` (eventos reais) |
| 1B.10 | Bug: chips de tópico do Suporte IA sem feedback visual | 🟢 | Handler já funciona; falta scroll/feedback |
| 1B.11 | Bug: clique em especialidade sem feedback visual | 🟢 | Handler e busca já funcionam; falta estado ativo/scroll |
| 1B.12 | Auditoria de contraste do tema claro (WCAG AA) | 🟡 | `docs/design/style-guide.md` nunca foi auditado contra 4.5:1 |

---

## Horizonte 2 — Qualidade & Robustez
Reduzir risco de regressão e melhorar confiabilidade.

| # | Ação | Esforço | Valor |
|---|---|---|---|
| 2.1 | Tipos gerados do Supabase (`supabase gen types`) → eliminar `any` nas queries | 🟡 | Alto |
| 2.2 | Ampliar testes: Server Actions, `lib/data/*`, componentes (`SearchBar`, `PostCard`) | 🟠 | Alto |
| 2.3 | `error.tsx`/`loading.tsx` por rota (hoje só flags `carregando` manuais) | 🟡 | Médio |
| 2.4 | CI (GitHub Actions): `typecheck` + `build` + `test` em cada PR | 🟡 | Alto |
| 2.5 | ESLint (`eslint-config-next`) + reativar `lint` no build | 🟡 | Médio |
| 2.6 | E2E (Playwright) dos fluxos críticos (quando rodar contra Supabase real) | 🟠 | Alto |

---

## Horizonte 3 — Arquitetura & Escala

| # | Ação | Esforço | Racional |
|---|---|---|---|
| 3.1 | Migrar fetch client-side → Server Components (`comunidade`, `profissionais`, `acervo`) | 🟠 | SEO + perf; 6 telas buscam no browser |
| 3.2 | Paginação de posts e profissionais (`useSearch` já preparado p/ `SearchPagination`) | 🟡 | Escala de dados |
| 3.3 | Supabase Storage para imagens (hoje tudo é `placehold.co`) | 🟠 | Upload de avatar/perfil/acervo |
| 3.4 | Rate limiting / anti-abuso em inserts públicos (`contact_messages`, `reviews`) | 🟡 | Segurança |
| 3.5 | Consolidar queries inline nas páginas para `lib/data` | 🟡 | Manutenibilidade |

---

## Horizonte 4 — Produto / Features novas
- Workflow de verificação de profissionais (`verification_status` está `pending` p/ todos).
- Painel administrativo (`is_admin()`/policies já existem; falta UI).
- Notificações (curtidas, comentários, aprovações).
- Trilhas de conhecimento interativas (`trail_progress` existe; falta conteúdo/quiz).
- Busca server-side com full-text (a atual é client-side sobre dados carregados).

---

## Sequência recomendada (próximas sprints)
- **Sprint 1 — Destravar:** `0.1 → 0.3/0.4 → 0.5 → 0.6` + quick wins `1.1`, `1.3`, `1.7` (remover agendar consulta), `1B.10`, `1B.11` (bugs de feedback visual). (0.2 já feito.)
- **Sprint 2 — Blindar:** `2.4 (CI)` → `2.1 (tipos)` → `2.2 (testes)`.
- **Sprint 3 — Completar núcleo:** `1.4 (eventos)`, `1.2 (editar)`, iniciar `1.6 (cuidador)`.
- **Sprint 4 — Telas de UI/UX:** `1B.2 (perfil)` → `1B.3 (salvos)` → `1B.5 (ajuda)` → `1B.1 (boas-vindas grupo)` → `1B.4 (configurações)` → `1B.9 (eventos, depois de 1.4)` → `1B.6 (notificações)`.
- **Sprint 5 — Polimento:** `1B.7/1B.8` (loading/acervo) + `1B.12` (contraste do tema claro).

## Documentos relacionados
- `docs/project/refactor-report.md` — relatório da refatoração/limpeza.
- `docs/architecture/security-checklist.md` — RLS + hardening + passo do leaked-password.
- `docs/project/pr-description.md` — corpo do PR.
