# Harmonia Supabase ↔ Vercel — Varredura e Plano de Organização

> **O que é este documento:** uma auditoria da relação entre o banco/API (Supabase) e o front/hosting (Vercel) do E.L.O.S, seguida de um plano de ações para que um lado nunca sobrecarregue o outro. É um documento irmão do [`plano-finalizacao-completa.md`](../project/plano-finalizacao-completa.md) — aquele cobre "o que falta para produção"; este cobre especificamente "como Supabase e Vercel devem se comportar um em relação ao outro". A tarefa `E1` do guia mestre ("Server Components nas 6 telas client-fetch") é aprofundada aqui como `H2`.
>
> Nenhuma mudança de código foi feita nesta entrega — é só o mapeamento e o plano. As fichas abaixo (H1–H6) descrevem exatamente o que implementar depois.

---

## 1. Resumo executivo

O projeto está pré-lançamento: o Supabase Advisor de performance mostra **8 índices nunca usados** (`idx_professionals_clinic`, `idx_professionals_specialty`, `idx_clinics_owner`, `idx_reviews_clinic`, `idx_groups_created_by`, `idx_library_items_suggested`, `idx_professionals_owner`, `idx_events_starts`) — não é um problema hoje, é a prova de que ainda não houve tráfego real. Isso é uma vantagem: dá para corrigir o *padrão* de acesso a dados agora, antes que o app cresça e qualquer ineficiência vire custo real (tempo de resposta, cota de requests do Supabase, cold starts do Vercel).

"Harmonia" aqui significa duas coisas concretas:
- **O Vercel não deve gerar mais chamadas ao Supabase do que o necessário** (cache o que pode ser cacheado; não consulte Auth em rota pública; não fragmente uma pergunta em 5 queries).
- **O Supabase não deve forçar o Vercel a abrir mão de renderização estática** (uma página pública não deveria virar dinâmica só porque uma função de acesso lê cookies por hábito).

| # | Achado | Causa raiz | Impacto |
|---|--------|------------|---------|
| H1 | Middleware consulta Auth em ~todo request | `src/middleware.ts` roda em quase todas as rotas e chama `auth.getUser()` antes de checar se a rota exige sessão | Maior gerador de chamadas desnecessárias ao Supabase + latência extra em toda navegação, inclusive páginas 100% públicas |
| H2 | 6 páginas buscam dados direto do browser | Uso de `"use client"` + `createClient()` do Supabase dentro de `useEffect` | Bypassa qualquer cache do Next/Vercel; expõe a query ao cliente; refaz a busca a cada mount |
| H3 | Zero ISR/cache em qualquer rota | Nenhum `revalidate`, `fetchCache` ou `unstable_cache` no projeto | Conteúdo público e pouco volátil (notícias, acervo, profissionais) é buscado do zero em cada acesso |
| H4 | `profissionais/[id]` faz 4-5 queries separadas | Ausência de joins aninhados via PostgREST | Múltiplas idas ao Supabase por page view, onde 1 bastaria |
| H5 | 8 arquivos leem cookies incondicionalmente | `createClient(await cookies())` chamado mesmo quando a página não depende de sessão | Opta a página inteira fora de renderização estática sem necessidade |
| H6 | `/noticias` e `/noticias-ai` são dinâmicas, mas seus `[slug]` são estáticos | A listagem usa o client de cookies; o detalhe usa `generateStaticParams` | Duas páginas do mesmo domínio de conteúdo tratadas de formas opostas, sem motivo de negócio |

---

## 2. Modelo mental — princípios de organização

Regras curtas para guiar toda decisão futura de onde/como buscar dado:

1. **Dado público e pouco volátil → Server Component com fetch cacheável, nunca fetch client-side.** Notícias, acervo digital, listagem de profissionais e grupos não mudam a cada segundo; não há motivo para o browser ir direto ao Supabase.
2. **Uma query com joins aninhados vale mais que N queries separadas.** O PostgREST do Supabase suporta `select` com relações aninhadas (`autor:profiles!fk(...)`, `comments(...)`) — isso é uma única viagem de rede em vez de várias. `comunidade/page.tsx` já faz isso certo; é o padrão a copiar.
3. **O middleware só deve tocar o Supabase Auth quando a rota realmente exige sessão.** Checar a lista de rotas privadas/auth *antes* de chamar `auth.getUser()`, não depois.
4. **Cookies só devem ser lidos quando a página realmente precisa saber quem é o usuário.** Ler cookies "por padrão" em toda rota server aposenta a renderização estática sem necessidade.
5. **Mutação continua sempre dinâmica.** Server Actions (criar post, favoritar, etc.) não entram nesse esforço de cache — o que está em jogo é leitura de conteúdo público.

---

## 3. Matriz de priorização

| ID | Achado | Prioridade | Dificuldade | Tempo est. | Arquivos afetados |
|----|--------|:---:|:---:|:---:|---|
| H1 | Middleware chama Auth sem necessidade | P0 | Fácil | 30 min | `src/middleware.ts`, `src/lib/supabase/middleware.ts` |
| H2 | Páginas client-fetch → Server Component | P1 | Médio | ~1 dia (6 páginas) | `fale-conosco`, `comunidade`, `comunidade/explorar-grupos`, `comunidade/meus-grupos`, `acervo-digital`, `profissionais` (todos em `src/app/`) |
| H3 | ISR nas rotas de conteúdo público | P1 | Fácil | 1-2h | `src/app/noticias/page.tsx`, `noticias-ai/page.tsx`, `acervo-digital/page.tsx`, `profissionais/page.tsx` |
| H4 | Unificar queries de `profissionais/[id]` | P2 | Fácil | 1-2h | `src/app/profissionais/[id]/page.tsx` |
| H5 | Revisar leitura de cookies desnecessária | P2 | Fácil | 1-2h | `src/app/noticias-gamificadas/page.tsx`, `src/lib/data/news.ts`, demais usos de `@/lib/supabase/server` |
| H6 | Índices não usados — reavaliar após tráfego | P2 | Trivial | 5 min | N/A (observação de processo) |

Ordem de execução recomendada: **H1 → H3 → H2 → H4 → H5 → H6**. H1 é a correção de maior impacto com menor esforço (30 min, remove a chamada de Auth desnecessária de toda navegação pública). H3 dá ganho rápido de cache sem mexer na forma de buscar dado. H2 é o trabalho mais substancial (reescrever 6 páginas como Server Components).

---

## 4. Fichas detalhadas

### H1 — Middleware só consulta Auth quando a rota exige

- **Categoria:** Performance / Custo de API
- **Prioridade:** P0
- **Dificuldade:** Fácil
- **Tempo estimado:** 30 min
- **Dependências:** nenhuma

**🎯 Passo a passo**

Hoje (`src/lib/supabase/middleware.ts`), a sequência é: cria o client Supabase → chama `supabase.auth.getUser()` incondicionalmente → só depois verifica se o path está em `ROTAS_PRIVADAS` ou `ROTAS_DE_AUTH` para decidir redirecionar.

Trocar a ordem: checar primeiro se o `pathname` está em alguma das duas listas; só chamar `auth.getUser()` se estiver. Esqueleto do "depois":

```ts
export async function createClient(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const precisaChecarSessao =
    ROTAS_PRIVADAS.some((rota) => pathname.startsWith(rota)) ||
    ROTAS_DE_AUTH.includes(pathname);

  if (!precisaChecarSessao) {
    return NextResponse.next({ request });
  }

  // client Supabase + auth.getUser() só a partir daqui, como já é feito hoje
  ...
}
```

Atenção: o client Supabase de middleware normalmente também é responsável por *refrescar* o cookie de sessão (`setAll` no response) para manter o usuário logado. Se essa responsabilidade estiver acoplada à chamada de `getUser()`, ela também passa a rodar só nas rotas checadas — o que é aceitável porque um usuário autenticado só precisa de refresh de sessão quando está navegando entre as rotas que o middleware protege ou entre login/logout. Validar com um teste manual: logar, navegar entre página pública e página privada, confirmar que a sessão não expira antes da hora.

**✅ Critérios de aceite**
- [ ] `auth.getUser()` não é mais chamado para rotas fora de `ROTAS_PRIVADAS`/`ROTAS_DE_AUTH`.
- [ ] Login, logout e proteção das rotas privadas continuam funcionando (teste manual).
- [ ] Sessão não expira prematuramente ao navegar só por páginas públicas.

---

### H2 — ✅ Migrar as 6 páginas client-fetch para Server Component

- **Categoria:** Arquitetura / Cache
- **Prioridade:** P1
- **Dificuldade:** Médio
- **Tempo estimado:** ~1 dia (6 páginas)
- **Dependências:** nenhuma (pode ser feito uma página por vez, independente)
- **Implementado em 2026-07-27** (ver ficha completa em `plano-finalizacao-completa.md`, item `E1`): as 6 páginas migradas para `page.tsx` (Server Component) + `client-page.tsx`. A busca de favoritos/curtidas/membresia do usuário logado (que depende de `auth.getUser()`) **virou uma segunda leitura no Server Component**, como a opção "melhor" já cogitada abaixo — por isso as 6 rotas saem do build como `ƒ Dynamic`, não `○`/`●`, já que leem cookies incondicionalmente (mesmo padrão de `/perfil`/`/salvos`/`/notificacoes`, que já eram assim). O critério de aceite original ("build mostra `○`/`●`") foi corrigido para refletir isso — dado personalizado por usuário não pode ser estático, o ganho real é ter *uma* leitura no servidor por request em vez de N chamadas do browser a cada mount.

**Páginas:** `src/app/fale-conosco/page.tsx`, `src/app/comunidade/page.tsx`, `src/app/comunidade/explorar-grupos/page.tsx`, `src/app/comunidade/meus-grupos/page.tsx`, `src/app/acervo-digital/page.tsx`, `src/app/profissionais/page.tsx`.

**🎯 Passo a passo (padrão a repetir nas 6)**

Hoje, o padrão é: página inteira com `"use client"`, `useEffect` que chama `createClient()` (client Supabase) e popula `useState`. Isso faz o browser buscar os dados — sem cache do Next, sem SSR.

Padrão proposto: separar busca de dado (server) de interatividade (client):
1. A função `page.tsx` deixa de ter `"use client"` e vira um Server Component `async` que busca os dados iniciais com `createClient(await cookies())` (ou sem cookies, se a página não depender de sessão — ver H5).
2. A parte que hoje usa `useSearch`, `useState` de filtro/view, etc. continua em um componente `"use client"` separado, recebendo os dados iniciais como prop.

Exemplo com `acervo-digital` (já usa `useSearch`, então a mudança é só de onde vem `libraryItems`):

```tsx
// src/app/acervo-digital/page.tsx (Server Component)
export const revalidate = 300; // ver H3

export default async function DigitalLibraryPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('library_items')
    .select('id, type, title, author_name, image_url, action_url, downloadable, tags, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  return <DigitalLibraryContent initialItems={(data ?? []).map(mapLibraryRow)} />;
}
```

```tsx
// componente client separado, recebe os dados prontos
'use client';
function DigitalLibraryContent({ initialItems }: { initialItems: LibraryItemData[] }) {
  const [libraryItems] = useState(initialItems);
  const { query, setQuery, results: filteredItems, ... } = useSearch({ items: libraryItems, ... });
  // resto igual ao que já existe hoje, sem o useEffect de fetch
}
```

A busca de favoritos do usuário logado (que depende de `auth.getUser()`) pode continuar sendo feita no client, já que é por-usuário e não deve ser cacheada — ou, melhor, pode virar uma segunda leitura no Server Component usando o resultado do middleware/cookies, evitando outra chamada do browser.

**✅ Critérios de aceite**
- [x] As 6 páginas buscam o dado inicial no servidor (build mostra `ƒ Dynamic` — correto para dado personalizado por usuário, não `○`/`●`; ver nota acima).
- [x] Filtros e busca (`useSearch`) continuam funcionando identicamente do ponto de vista do usuário.
- [x] Nenhuma regressão visual ou funcional (smoke test via `npm run dev` + curl nas 4 páginas públicas + confirmação do redirect 307 em `meus-grupos` deslogado).
- [x] `npm run typecheck` e `npm run build` continuam limpos.

---

### H3 — ISR nas rotas de conteúdo público

- **Categoria:** Cache
- **Prioridade:** P1
- **Dificuldade:** Fácil
- **Tempo estimado:** 1-2h
- **Dependências:** idealmente depois de H2 para as páginas que ainda são client-fetch, mas pode ser aplicado desde já nas que já são Server Component

**🎯 Passo a passo**

Adicionar `export const revalidate = <segundos>` no topo do Server Component da página. Sugestão de valores (ajustar conforme frequência real de publicação):

```ts
// src/app/noticias/page.tsx, src/app/noticias-ai/page.tsx
export const revalidate = 300; // 5 min — conteúdo editorial, pouca urgência de estar 100% atual
```

```ts
// src/app/acervo-digital/page.tsx, src/app/profissionais/page.tsx
export const revalidate = 300;
```

Isso alinha o comportamento da listagem com o do detalhe (`[slug]`, que já é `generateStaticParams`/SSG). O objetivo é o build voltar a mostrar essas rotas como `●`/ISR em vez de `ƒ Dynamic`.

**✅ Critérios de aceite**
- [ ] `npm run build` mostra as rotas listadas com indicador de ISR (não mais `ƒ` puro).
- [ ] Conteúdo novo aparece dentro da janela de revalidação escolhida (testar publicando e aguardando o `revalidate`).

---

### H4 — Unificar queries de `profissionais/[id]`

- **Categoria:** Performance de query
- **Prioridade:** P2
- **Dificuldade:** Fácil
- **Tempo estimado:** 1-2h
- **Dependências:** nenhuma

**🎯 Passo a passo**

Hoje `src/app/profissionais/[id]/page.tsx` faz: 1 query para o profissional, 1 para reviews, 2 em paralelo (skills + experiences), e condicionalmente 1 para clínica — até 5 idas ao Supabase.

Seguir o padrão já usado em `src/app/comunidade/page.tsx` (select com relações aninhadas do PostgREST) e consolidar em uma única query:

```ts
const { data } = await supabase
  .from('professionals')
  .select(`
    *,
    reviews ( id, rating, comment, created_at, author:profiles!reviews_author_id_fkey ( full_name, avatar_url ) ),
    professional_skills ( skill ),
    professional_experiences ( description, sort_order ),
    clinic:clinics ( * )
  `)
  .eq('id', id)
  .single();
```

Ajustar os nomes de foreign key (`!reviews_author_id_fkey` etc.) conforme o schema real — conferir em `supabase/migrations/` os nomes de constraint antes de aplicar.

**✅ Critérios de aceite**
- [ ] Página de detalhe do profissional faz 1 query em vez de 4-5.
- [ ] Todos os dados exibidos hoje (skills, experiências, reviews, clínica) continuam aparecendo corretamente.
- [ ] `npm run build` e teste manual da página sem regressão.

---

### H5 — Revisar leitura de cookies desnecessária

- **Categoria:** Renderização estática
- **Prioridade:** P2
- **Dificuldade:** Fácil
- **Tempo estimado:** 1-2h
- **Dependências:** nenhuma

**🎯 Passo a passo**

Os 8 arquivos que usam `createClient(await cookies())` (`@/lib/supabase/server`) devem ser revisados um a um: a página realmente precisa saber quem é o usuário logado (para RLS de dado privado, para personalizar UI) ou só usa o Supabase para ler dado público?

Candidatos a não precisar de cookies, a confirmar:
- `src/app/noticias-gamificadas/page.tsx` — conteúdo provavelmente público.
- `src/lib/data/news.ts` — leitura de notícias, também público.

Para esses casos, criar/usar um client Supabase sem `cookies()` (client anônimo, usando só a chave pública) — o que permite a página voltar a ser estática/ISR em vez de forçadamente dinâmica. Os arquivos que fazem mutação (`src/app/actions/*.ts`, Server Actions) continuam precisando de cookies normalmente, pois dependem de sessão para RLS de escrita — não fazem parte deste item.

**✅ Critérios de aceite**
- [ ] Cada um dos 8 arquivos foi revisado e documentado (mantém cookies com justificativa, ou migra para client anônimo).
- [ ] Páginas que migraram voltam a aparecer como estáticas/ISR no build.
- [ ] Nenhuma regressão em página que de fato depende de sessão.

---

### H6 — Índices não usados: aguardar tráfego real antes de agir

- **Categoria:** Observação de processo
- **Prioridade:** P2
- **Dificuldade:** Trivial
- **Tempo estimado:** 5 min

**🎯 Passo a passo**

Não remover os 8 índices apontados pelo Supabase Advisor agora — eles não têm uso porque o app ainda não tem tráfego de produção real, não porque são desnecessários. Registrar este documento como referência e reexecutar `get_advisors` (tipo `performance`) periodicamente após o go-live; só então decidir remoção ou manutenção com dado real de uso.

**✅ Critérios de aceite**
- [ ] Nenhuma ação de remoção de índice tomada nesta entrega.
- [ ] Revisão do advisor agendada para depois do lançamento (ex.: incluir no checklist pós-go-live do guia mestre).

---

## 5. Checklist de harmonia (verificação contínua)

Sinais de que este documento precisa ser revisitado:

- [ ] O build (`npm run build`) volta a mostrar `ƒ Dynamic` em uma rota que deveria ser `○`/`●` (regressão de H2/H3/H5).
- [ ] O Supabase Advisor de performance passa a mostrar um índice "quente" (muito usado) sem que a query correspondente tenha sido revisada para eficiência.
- [ ] Logs de middleware no Vercel mostram tempo de execução alto ou volume de chamadas de Auth desproporcional ao tráfego real.
- [ ] Uma nova página é criada com fetch client-side direto ao Supabase sem justificativa (dado privado por-usuário, tempo real, etc.) — deveria nascer como Server Component seguindo os princípios da seção 2.
- [ ] Uma nova rota de detalhe (`[id]`/`[slug]`) é criada fazendo múltiplas queries separadas em vez de um único `select` com joins aninhados.

---

**Documentos relacionados:** [`plano-finalizacao-completa.md`](../project/plano-finalizacao-completa.md) (guia mestre de finalização — este documento aprofunda a tarefa `E1` dele) · [`roadmap.md`](../project/roadmap.md) · [`security-checklist.md`](./security-checklist.md).
