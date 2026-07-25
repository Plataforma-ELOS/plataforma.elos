# PR: Refatoração arquitetural, busca de profissionais, testes e hardening

**Branch:** `claude/new-session-8sdpjq` → `main`
**Tipo:** refactor + feat + test + docs (sem breaking changes de runtime)

## Resumo

Este PR faz uma faxina arquitetural profunda no app E.L.O.S (Next.js 15 + shadcn/ui + Supabase), desacopla o Firebase, torna a busca de profissionais real, adiciona uma suíte de testes (Vitest) e deixa `build`/`typecheck`/`test` 100% verdes e sem avisos. Nenhuma configuração de deploy (Vercel) ou de banco (Supabase) foi alterada.

`typecheck` ✅ · `build` ✅ (0 avisos, 22 rotas) · `test` ✅ (16 testes)

## O que muda

### 1. Desacoplamento do Firebase
- Remove a dependência `firebase` (0 imports em `src/`) e `patch-package` (morta).
- Apaga scaffolding do Firebase Studio / App Hosting: `.idx/`, `apphosting.yaml`, `metadata.json`.
- O app já roda 100% em Vercel + Supabase; IA via Genkit/`@genkit-ai/googleai` (não usa SDK Firebase).

### 2. Limpeza de código morto
- 4 componentes de seção sem uso (`sections/{ai-support,community,professionals,digital-collection}.tsx`, substituídos pelas versões `new-*`).
- 16 imagens órfãs da era do mock (`public/comunidade/membro-*`, `public/acervo/**`, `public/perfis/clinicas/*`) — o banco referencia imagens por URL externa, então nenhuma era usada.

### 3. Nova estrutura de pastas (feature-based, mantendo convenções Next/shadcn)

**Antes → Depois** em `src/components/`:
```
sections/  (misto)          →  features/{home,news,acervo}/ por domínio
community/, news/           →  features/{community,news}/
providers, feature-in-progress → common/
(sem mudança)               →  ui/ (primitivos shadcn), layout/
```
E consolidação dos módulos globais:
```
src/utils/supabase/         →  src/lib/supabase/   (config de lib externa)
src/app/lib/placeholder-images.json → src/lib/data/placeholder-images.json
```
`src/` final: `ai/`, `app/`, `components/{ui,layout,common,features}`, `hooks/`, `lib/{data,supabase,utils.ts,format.ts}`, `middleware.ts`. Todos os imports (alias e relativos) atualizados; aliases do shadcn intactos.

### 4. Busca reutilizável + profissionais
- Extraído `useSearch<T>` (`src/hooks/use-search.ts`) — hook genérico de query + filtro + ordenação, sem UI.
- Componentes `SearchBar` e `SearchFilters` (`src/components/features/search/`).
- `/acervo-digital` passou a compô-los (comportamento idêntico).
- **`/profissionais`**: a busca era decorativa (`FeatureInProgress` + `ref`); agora é real — `professionals` + `clinics` combinados e filtrados por um único `useSearch` (nome + especialidade), com os chips de especialidade virando atalho de busca e estados vazios por seção.

### 5. Documentação
- `docs/` reorganizado em `product/`, `architecture/`, `design/` (kebab-case) + índice `docs/README.md`.
- `docs/project/refactor-report.md` (relatório de limpeza) e `docs/architecture/security-checklist.md` (RLS + hardening).

### 6. Testes (Vitest)
- Vitest + React Testing Library + jsdom; scripts `npm run test` / `test:watch`.
- Cobre `cn()` (utils), `formatarDataPtBr()` (format) e `useSearch` (hook) — 16 testes.
- Testes isolados do `next build`/`tsc` via `exclude` no tsconfig (build/typecheck seguem limpos).

### 7. Terminal limpo
- `next.config.ts` silencia (cirurgicamente) apenas os avisos vindos de dependências (telemetria do Genkit/OpenTelemetry, `handlebars`, `process.version` do Supabase no Edge). Não esconde avisos da aplicação.
- `serverExternalPackages: ['isomorphic-dompurify']` para o jsdom não ser empacotado pelo webpack.

## Segurança (Supabase)
- RLS validada: **22/22 tabelas** com RLS habilitada + policies (detalhes em `docs/architecture/security-checklist.md`).
- Nenhuma query usa `service_role` no frontend; a publishable key respeita RLS.
- ⚠️ Pendência de painel (1 clique, fora do código): habilitar **Leaked Password Protection** em Authentication → Policies. Link no checklist.

## Como validar
```bash
npm install
npm run test        # 16 passed
npm run typecheck   # 0 erros
npm run build       # Compiled successfully, 0 avisos, 22 rotas
```
Preview Deployment é gerado automaticamente pela Vercel ao abrir o PR (produção só builda a partir de `main`). A busca de profissionais depende de dados reais do Supabase — validar no Preview (o sandbox de desenvolvimento bloqueia o host do Supabase no browser).

## Commits
```
refactor: desacopla Firebase do projeto
refactor: remove codigo e assets mortos
docs: reorganiza documentacao em subpastas kebab-case
refactor: reagrupa componentes por feature e extrai a busca
refactor: consolida modulos globais sob src/lib
docs: adiciona relatorio da refatoracao/limpeza
feat: busca real em /profissionais reusando useSearch
docs: checklist de seguranca e validacao de RLS
test: configura Vitest e cobre utils, format e useSearch
chore: build sem avisos (silencia avisos de dependencias)
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
