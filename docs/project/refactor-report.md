# Relatório de Refatoração e Limpeza — Plataforma E.L.O.S

Faxina de código, desacoplamento do Firebase e reestruturação arquitetural.
Feita de forma **pragmática**, preservando as convenções de Next.js/shadcn e
sem quebrar o app em produção (Vercel + Supabase). `typecheck` e `build`
limpos ao final; 22 rotas compilando.

## 1. Dependências removidas

| Pacote | Motivo |
|---|---|
| `firebase` (`^11.9.1`) | 0 imports em `src/`. O app usa Supabase (dados/auth) e Genkit/`@genkit-ai/googleai` (IA); nenhum SDK do Firebase era usado. |
| `patch-package` (`^8.0.0`) | Sem pasta `patches/` e sem script `postinstall` que a consumisse — dependência morta. |

> Nota: o aviso de build `Can't resolve '@genkit-ai/firebase'` é interno ao
> `@genkit-ai/core` (telemetria opcional), **não** vem do pacote `firebase`
> removido, é não-fatal e foi deixado como está.

## 2. Arquivos e artefatos deletados

### Config / scaffolding do Firebase Studio
| Item | Motivo |
|---|---|
| `.idx/` (`dev.nix`, `icon.png`) | Workspace do Firebase Studio (config de emuladores). O app roda na Vercel. |
| `apphosting.yaml` | Config do Firebase App Hosting — não usado (deploy é Vercel via `vercel.json`). |
| `metadata.json` | Metadados "App imported from Firebase Studio". |

### Componentes mortos (0 importadores)
Substituídos pelas versões `new-*` usadas na home:
`src/components/sections/{ai-support,community,professionals,digital-collection}.tsx`.

### Assets órfãos (era do mock, hoje substituídos por `placehold.co` no banco)
Todos verificados com 0 referências em `src/`:
- `public/comunidade/membro-1..6.jpg` (6)
- `public/acervo/**` — `materias/` + `perfil/` (6)
- `public/perfis/clinicas/instituicao-1..4.jpg` (4)

### Outros
- `.backup-pre-supabase/` — backup temporário (gitignored) da tarefa anterior.

## 3. Documentação reorganizada (`/docs`)

De arquivos soltos em `SCREAMING_CASE` para subpastas temáticas em `kebab-case`,
com índice em `docs/README.md`:

| Antes | Depois |
|---|---|
| `PRD.md` | `product/prd.md` |
| `SCREEN_CONTENT.md` | `product/screen-content.md` |
| `TECHNICAL_ARCHITECTURE.md` | `architecture/technical-architecture.md` |
| `ROUTES.md` | `architecture/routes.md` |
| `STYLE_GUIDE.md` | `design/style-guide.md` |
| `blueprint.md` | `design/blueprint.md` |

## 4. Reestruturação de `src/`

### Componentes: agrupamento por feature
`ui/` e `layout/` mantidos; o resto agrupado por domínio:

```
src/components/
├── ui/            # primitivos shadcn (inalterado)
├── layout/        # header, header-secondary, footer
├── common/        # feature-in-progress, providers (transversais)
└── features/
    ├── community/ # comment-section, create-post, post-card
    ├── news/      # news-card, news-carousel
    ├── home/      # hero, ai-support-home, new-community,
    │              #   new-digital-collection, new-professionals
    ├── acervo/    # digital-library-card, digital-library-list-item
    └── search/    # search-bar, search-filters (novos)
```
Pastas antigas `community/`, `news/`, `sections/` removidas. Todos os imports
(alias e relativos) atualizados.

### Módulos globais: consolidação sob `src/lib`
Eliminada a divisão confusa `src/utils` vs `src/lib`:
- `src/utils/supabase/` → `src/lib/supabase/` (config de lib externa). 15
  importadores atualizados (`@/utils/supabase` → `@/lib/supabase`).
- `src/app/lib/placeholder-images.json` → `src/lib/data/placeholder-images.json`
  (é dado). 2 importadores atualizados.

`src/` final: `ai/`, `app/`, `components/`, `hooks/`, `lib/`, `middleware.ts`.
`src/lib` reúne utils puros (`utils.ts`, `format.ts`), acesso a dados (`data/`)
e config de libs externas (`supabase/`).

## 5. Componentização da Busca (Search)

A única busca real (em `acervo-digital`) foi decomposta e tornada reutilizável:
- `src/hooks/use-search.ts` — hook genérico `useSearch<T>` (query + filtro por
  categoria + ordenação), **sem UI**, só regra de negócio/estado.
- `src/components/features/search/search-bar.tsx` — input de busca controlado.
- `src/components/features/search/search-filters.tsx` — ordenação + select de
  categoria + toggle grid/lista, tudo prop-driven.

`acervo-digital/page.tsx` agora compõe `useSearch` + `SearchBar` +
`SearchFilters`; a saída visual é idêntica à anterior.

> `SearchPagination` **não** foi criado: nenhuma listagem atual tem volume que
> justifique paginação (YAGNI). Fica como extensão natural do hook quando
> necessário.

## 6. Assets e mídia

Mantida a organização por domínio em `public/` (`home/`, `ia/`, `noticias/`,
`perfis/`), que é semanticamente melhor que achatar por tipo de arquivo (todos
são `.jpg`). Os assets mortos foram removidos (seção 2). O banco referencia
imagens por URL externa (`placehold.co`), então nenhuma imagem local é
referenciada por dados.

## 7. Agents / skills

`.agents/skills/developing-genkit-js/` **mantido** — o Genkit está em uso em
`src/ai/` (fluxos `news-flow`, `legal-assistant-flow`), então é ferramenta de
desenvolvimento relevante.

## 8. Configurações validadas (sem alterar o que é load-bearing)

- `tsconfig.json` — `@/*` → `src/*` resolve corretamente após as movimentações.
- `components.json` — aliases do shadcn (`@/components`, `@/lib/utils`,
  `@/hooks`, `@/components/ui`) continuam válidos.
- `vercel.json` — **intocado**. É o que define o preset Next.js (o projeto
  `elos` na Vercel tem `framework: null`); alterá-lo quebraria o build.

## Verificação final
- `npm run typecheck` → 0 erros.
- `npm run build` → sucesso, 22 rotas, middleware compilando; único aviso é o
  `@genkit-ai/firebase` interno já descrito.
- Push em branch → Preview Deployment na Vercel (produção só via `main`).
