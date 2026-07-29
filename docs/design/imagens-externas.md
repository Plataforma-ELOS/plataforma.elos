# Imagens hospedadas fora do projeto — inventário e plano

> **O problema:** a aplicação depende de dois serviços gratuitos de terceiros para exibir imagens — `i.ibb.co` e `placehold.co`. Nenhum dos dois foi feito para produção: são hosts sem SLA, que podem remover ou alterar uma imagem a qualquer momento sem aviso, e um deles (`i.ibb.co`) já se provou bloqueado pela política de rede deste ambiente de desenvolvimento (o mesmo problema que impediu baixar o logo oficial para o favicon). `placehold.co` continua gravado como **dado real** nas 5 linhas demo de profissionais e 2 de clínicas (são fictícias, criadas por seed) — mas **qualquer cadastro real feito hoje pela plataforma já pode subir uma foto de verdade**, já que o upload via Supabase Storage foi implementado (item 10 do inventário) para avatar, foto de profissional/clínica, capa de item do acervo e imagem de post.
>
> Este documento lista cada ocorrência encontrada e propõe para onde cada uma deve ir: **arquivo estático no repositório** (`public/`) ou **Supabase Storage** (o "banco de dados" de arquivos do próprio projeto). A Trilha B (Storage) já foi executada; a Trilha A (assets estáticos) segue bloqueada por falta de acesso a `i.ibb.co` neste ambiente.

---

## 1. Inventário completo

| # | Imagem / uso | Onde está | Host atual | Tipo | Destino recomendado |
|---|---|---|---|---|---|
| 1 | Logo oficial do E.L.O.S (header) | `src/lib/data/placeholder-images.json` → `logo.url`, usado em `header.tsx`/`header-secondary.tsx` | `i.ibb.co` | Fixo do app | `public/` (estático) |
| 2 | 5 fotos de profissionais (dados de exemplo, não usadas em nenhuma tela hoje) | `src/lib/data/placeholder-images.json` → `professionals.*` | `i.ibb.co` | Morto/não referenciado no código | Remover do JSON, ou mover para `public/` se algum dia forem usadas |
| 3 | Avatar genérico (fallback) | `header.tsx:128`, `header-secondary.tsx:130`, `create-post.tsx:74`, `post-card.tsx:118`, `lib/data/community.ts:47,56`, `lib/data/library.ts:50`, `professionals.ts:84,96,110,130` | `placehold.co` | Fixo do app | `public/` (estático) |
| 4 | Banner de fundo (login/cadastro) | `login/page.tsx:166`, `cadastro/page.tsx:122` | `placehold.co` | Fixo do app | `public/` (estático) |
| 5 | Capa de notícia (fallback quando `image_url` é nulo) | `src/lib/data/news.ts:44,70` | `placehold.co` | Fallback de dado dinâmico | `public/` (ícone/placeholder local) |
| 6 | Avatar de perfil (fallback quando `avatar_url` é nulo) | `src/app/perfil/client-page.tsx:105,135` | `placehold.co` | Fallback de dado dinâmico | `public/` (ícone/placeholder local) — **upload real via Storage já existe** (item 10), o fallback só aparece antes do primeiro upload |
| 7 | **Fotos de profissionais demo (dado real gravado no banco)** | tabela `professionals.image_url` — 5 linhas | `placehold.co` (`?text=AM`, `?text=CL`, etc. — só iniciais, não fotos) | Dado dinâmico | Supabase Storage (bucket `professionals`) — **já disponível para uploads novos** (item 10); as 5 linhas demo específicas continuam com o placeholder por serem dado fictício |
| 8 | **Fotos de clínicas demo (dado real gravado no banco)** | tabela `clinics.image_url` — 2 linhas | `placehold.co` (`?text=Clinica`) | Dado dinâmico | Supabase Storage (bucket `professionals`) — mesma nota do item 7 |
| 9 | Hosts liberados em `next.config.ts` mas nunca usados no código | `next.config.ts` → `remotePatterns` | `storage.googleapis.com`, `picsum.photos` | Configuração morta | Remover do `next.config.ts` |
| 10 | **Upload real de imagem (já implementado)** | avatar (`perfil/client-page.tsx`), foto de profissional/clínica (`cadastro-profissional/page.tsx`), capa de item do acervo (`acervo-digital/client-page.tsx`), imagem de post (`create-post.tsx`) | Supabase Storage — buckets `avatars`, `professionals`, `library`, `posts` | Dado dinâmico | ✅ concluído — RLS de leitura pública/escrita por dono em todos os 4 buckets |

**Contraste — o que já está certo:** `public/perfis/liberais/profissional-*.jpg`, `public/perfis/compromisso.jpg`, `public/noticias/*.jpg`, `public/home/**`, `public/ia/*.jpg` já são imagens locais, usadas nas seções mockadas da home (`new-professionals.tsx`, `news-carousel.tsx`, `new-community.tsx`, `ai-support-home.tsx`) e em `/profissionais`. É esse o padrão a repetir nos itens 1, 3 e 4 acima.

---

## 2. Regra de decisão

| Se a imagem... | ...então vai para |
|---|---|
| é igual para todo mundo e não muda por registro (logo, ícone de avatar genérico, banner decorativo) | **`public/`** — arquivo estático, sem chamada de rede, sem custo de storage, sem risco de sumir |
| varia por registro/usuário e pode um dia ser enviada por quem é dono do dado (foto de um profissional, de uma clínica, capa de uma notícia, avatar de um usuário) | **Supabase Storage** — fica no mesmo projeto, com URL gravada na coluna existente (`image_url`, `avatar_url`), controlada por RLS |

Nenhum caso deste inventário justifica continuar em um host externo.

---

## 3. Plano de ação

### Trilha A — Estáticos (itens 1, 2, 3, 4, 9)

1. Trazer os arquivos para `public/` (ex.: `public/branding/logo.png`, `public/branding/avatar-generico.png`, `public/branding/banner-auth.jpg`), seguindo a mesma convenção de pasta já usada em `public/perfis/`, `public/noticias/`, `public/home/`.
2. Trocar cada `<Image src="https://...">`/`<AvatarImage src="https://...">` listado no inventário pelo caminho local (`/branding/logo.png`).
3. Remover as 5 entradas mortas de `professionals.*` em `placeholder-images.json` (item 2) — ou mover para `public/` se algum componente futuro for usá-las.
4. Remover `storage.googleapis.com` e `picsum.photos` de `remotePatterns` em `next.config.ts` (item 9).

**Bloqueio conhecido:** os arquivos de origem do logo (item 1) estão em `i.ibb.co`, host bloqueado pela política de rede deste sandbox (mesmo bloqueio já documentado na troca do favicon). Para executar o item 1 preciso que o arquivo oficial do logo seja enviado diretamente no chat, ou que esta etapa rode num ambiente com acesso a esse host. Os itens 3, 4 e 9 não têm esse bloqueio — podem ser feitos com um asset genérico criado localmente (como fiz para o favicon) ou com um arquivo enviado pelo usuário.

### Trilha B — Supabase Storage (✅ concluída, itens 6, 7, 8, 10)

1. ~~Criar buckets no Supabase Storage~~ — feito: `avatars`, `professionals`, `library`, `posts` (migrations `add_storage_buckets_avatars_professionals` e `add_posts_image_url_and_buckets`).
2. ~~Policy de leitura pública + escrita restrita ao dono~~ — feito, path prefixado por `auth.uid()` em todos os 4 buckets; sem policy de `select` (bucket público já serve via URL, evitando exposição de listagem — ver Security Advisor).
3. ~~Upload real no fluxo de cadastro/verificação de profissional~~ — feito: `cadastro-profissional/page.tsx` tem upload de foto opcional, gravado em `professionals.image_url`/`clinics.image_url` via `inscreverProfissional`.
4. ~~Upload no perfil, acervo e posts~~ — feito: `/perfil` (avatar), `/acervo-digital` (capa de item sugerido), criar post (imagem do post).
5. **Restante, ainda pendente:** trocar os *fallbacks* embutidos no código (itens 3, 5, 6 — avatar genérico, banner de auth, capa de notícia) por um asset local simples em vez de `placehold.co`; e as 5+2 linhas demo de `professionals`/`clinics.image_url` continuam com o placeholder (são dado fictício, não é um cadastro real que alguém possa reenviar).

---

## 4. Checklist de aceite

- [x] Buckets do Storage com RLS de leitura pública / escrita restrita ao dono (`avatars`, `professionals`, `library`, `posts`).
- [x] Upload real disponível em perfil, cadastro profissional, acervo e criação de post.
- [ ] `npm run build` limpo depois da troca dos assets estáticos restantes (Trilha A).
- [ ] Nenhuma referência a `i.ibb.co` ou `placehold.co` no código, exceto o que for conscientemente mantido como placeholder de desenvolvimento (linhas demo fictícias).
- [ ] `next.config.ts` só lista hosts realmente usados em `remotePatterns` (Trilha A, item 9).

---

**Documentos relacionados:** [`plano-finalizacao-completa.md`](../project/plano-finalizacao-completa.md) (task `E3` — Supabase Storage — já concluída) · [`harmonia-supabase-vercel.md`](../architecture/harmonia-supabase-vercel.md).
