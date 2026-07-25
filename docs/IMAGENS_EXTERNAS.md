# Imagens hospedadas fora do projeto — inventário e plano

> **O problema:** a aplicação hoje depende de dois serviços gratuitos de terceiros para exibir imagens — `i.ibb.co` e `placehold.co`. Nenhum dos dois foi feito para produção: são hosts sem SLA, que podem remover ou alterar uma imagem a qualquer momento sem aviso, ficam fora do controle e do backup do projeto, e um deles (`i.ibb.co`) já se provou bloqueado pela política de rede deste ambiente de desenvolvimento (o mesmo problema que impediu baixar o logo oficial para o favicon, ver commit `fix: substitui favicon do Firebase...`). Além disso, `placehold.co` está gravado como **dado real** em duas tabelas do banco (profissionais e clínicas demo) — ou seja, hoje nenhuma "foto de profissional" no app é uma foto de verdade, é um quadrado colorido com iniciais.
>
> Este documento lista cada ocorrência encontrada e propõe para onde cada uma deve ir: **arquivo estático no repositório** (`public/`) ou **Supabase Storage** (o "banco de dados" de arquivos do próprio projeto).

---

## 1. Inventário completo

| # | Imagem / uso | Onde está | Host atual | Tipo | Destino recomendado |
|---|---|---|---|---|---|
| 1 | Logo oficial do E.L.O.S (header) | `src/lib/data/placeholder-images.json` → `logo.url`, usado em `header.tsx:249,273` e `header-secondary.tsx` | `i.ibb.co` | Fixo do app | `public/` (estático) |
| 2 | 5 fotos de profissionais (dados de exemplo, não usadas em nenhuma tela hoje) | `src/lib/data/placeholder-images.json` → `professionals.*` | `i.ibb.co` | Morto/não referenciado no código | Remover do JSON, ou mover para `public/` se algum dia forem usadas |
| 3 | Avatar genérico (fallback) | `header.tsx:107`, `header-secondary.tsx:109`, `create-post.tsx:27`, `comment-section.tsx:62`, `post-card.tsx:77`, `comunidade/page.tsx:140,149`, `professionals.ts:50` | `placehold.co` | Fixo do app | `public/` (estático) |
| 4 | Banner de fundo (login/cadastro) | `login/page.tsx:166`, `cadastro/page.tsx:122` | `placehold.co` | Fixo do app | `public/` (estático) |
| 5 | Capa de notícia (fallback quando `image_url` é nulo) | `src/lib/data/news.ts:45,71` | `placehold.co` | Fallback de dado dinâmico | `public/` (ícone/placeholder local) |
| 6 | Capa de item do acervo / avatar (fallback) | `src/lib/data/library.ts:77,88,101,120` | `placehold.co` | Fallback de dado dinâmico | `public/` (ícone/placeholder local) |
| 7 | **Fotos de profissionais demo (dado real gravado no banco)** | tabela `professionals.image_url` — 5 linhas | `placehold.co` (`?text=AM`, `?text=CL`, etc. — só iniciais, não fotos) | Dado dinâmico | Supabase Storage (bucket `professionals`) |
| 8 | **Fotos de clínicas demo (dado real gravado no banco)** | tabela `clinics.image_url` — 2 linhas | `placehold.co` (`?text=Clinica`) | Dado dinâmico | Supabase Storage (bucket `professionals` ou bucket próprio `clinics`) |
| 9 | Hosts liberados em `next.config.ts` mas nunca usados no código | `next.config.ts` → `remotePatterns` | `storage.googleapis.com`, `picsum.photos` | Configuração morta | Remover do `next.config.ts` |

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

### Trilha B — Supabase Storage (itens 5, 6, 7, 8)

1. Criar buckets no Supabase Storage: `avatars` (fotos de perfil de usuário), `professionals` (fotos de profissionais e clínicas), `library` (capas de itens do acervo), `news` (capas de notícia).
2. Policy de leitura pública (`select` liberado) e escrita restrita ao dono do registro (RLS baseada em `auth.uid() = owner_id`), no mesmo padrão das policies já existentes nas tabelas.
3. Trocar os *fallbacks* embutidos no código (`?? 'https://placehold.co/...'` em `news.ts` e `library.ts`, itens 5-6) por um placeholder local simples — por exemplo, reaproveitar o mesmo ícone (`FileText`/`ImageOff` do `lucide-react`) já usado como fallback visual em `digital-library-card.tsx`, em vez de apontar para outro serviço externo.
4. Substituir os dois registros de `professionals.image_url` e as duas linhas de `clinics.image_url` (itens 7-8) por uploads reais no bucket `professionals`, atualizando a coluna com a URL pública do Storage. Isso deve acontecer junto com o fluxo de cadastro/verificação de profissional (`cadastro-profissional`), que já existe mas hoje não tem upload de imagem — está listado como stub `F7`/`E3` no `docs/PLANO_FINALIZACAO_COMPLETA.md`.

Esta trilha não depende de nenhum host externo bloqueado — pode ser executada por completo nesta sessão quando for priorizada (criação de bucket e RLS são operações do Supabase MCP, sem rede externa envolvida).

---

## 4. Checklist de aceite

- [ ] `npm run build` limpo depois da troca.
- [ ] Nenhuma referência a `i.ibb.co` ou `placehold.co` no código, exceto o que for conscientemente mantido como placeholder de desenvolvimento.
- [ ] `next.config.ts` só lista hosts realmente usados em `remotePatterns`.
- [ ] `professionals.image_url` e `clinics.image_url` (dado real) apontam para o Supabase Storage, não mais para `placehold.co`.
- [ ] Buckets do Storage com RLS de leitura pública / escrita restrita ao dono.

---

**Documentos relacionados:** [`PLANO_FINALIZACAO_COMPLETA.md`](./PLANO_FINALIZACAO_COMPLETA.md) (task `E3` já menciona sair do `placehold.co` via Storage — este documento detalha o inventário completo e o passo a passo) · [`HARMONIA_SUPABASE_VERCEL.md`](./HARMONIA_SUPABASE_VERCEL.md).
