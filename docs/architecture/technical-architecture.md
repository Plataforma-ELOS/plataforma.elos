# Arquitetura Técnica Detalhada - Plataforma E.L.O.S.

Este documento fornece uma análise técnica das telas da aplicação, servindo como guia para engenheiros e auditores de sistema.

**Stack real (não Firebase):** Next.js 15 (App Router) + Supabase (Postgres, Auth, Realtime) + shadcn/ui + Tailwind, deploy na Vercel. Toda leitura/escrita passa pelo PostgREST sujeita a RLS — ver `docs/architecture/security-checklist.md`. Genkit/Gemini é usado só nos dois fluxos de IA (`/suporte-ia`, `/noticias-ai/[slug]`), sem relação com dados de usuário.

Padrão de acesso a dados predominante: **Server Component + client-page.tsx** (item `3.1`/`E1` do roadmap, concluído) — a página busca os dados no servidor (`createClient(await cookies())`, `src/lib/supabase/server.ts`, ou `createStaticClient()` quando a rota não depende de sessão — ver `docs/architecture/harmonia-supabase-vercel.md`, item H5) e repassa como props para um componente `"use client"` que cuida da interação. Isso cobre praticamente todas as telas de conteúdo hoje: `/comunidade`, `/comunidade/explorar-grupos`, `/comunidade/meus-grupos`, `/comunidade/grupos/[id]`, `/acervo-digital`, `/profissionais`, `/profissionais/[id]`, `/noticias-gamificadas`, `/noticias-gamificadas/trilhas/[id]`, `/perfil`, `/salvos`, `/configuracoes`, `/notificacoes`, `/meu-espaco`, `/admin`. Os únicos `"use client"` que ainda buscam ou gravam dado diretamente do browser são telas de formulário sem conteúdo inicial para ler (`/login`, `/cadastro`, `/cadastro-profissional`, `/comunidade/criar-grupo`, `/fale-conosco`) — não sobrou tela de listagem/leitura em Client Component puro.

`src/app/loading.tsx` e `src/app/error.tsx` (raiz) dão fallback global de carregamento/erro para qualquer rota sem um boundary mais específico — cobre as telas Server Component acima sem precisar de um arquivo por rota.

---

## 1. Hub Principal (`/home`)
```json
{
  "route": "/home",
  "component_hierarchy": [
    "RootLayout", "Providers", "HeaderSecondary", "Main",
    "Hero", "AiSupportHome", "NewDigitalCollection", "NewCommunity",
    "NewsCarousel", "NewProfessionals", "Footer"
  ],
  "data": {
    "auth": "AuthContext (src/components/common/providers.tsx): sessão do Supabase Auth para exibir avatar/menu de usuário no header."
  },
  "state_management": {
    "global": ["AuthContext", "FontSizeContext", "ThemeContext (next-themes)"]
  },
  "ui_specs": {
    "animations": "Fade-in-0 (500ms), Pulse-slow (glow do card de IA)",
    "styling": "Tailwind + variáveis HSL, Shadcn Carousel (Embla)"
  }
}
```

## 2. Login (`/login`)
```json
{
  "route": "/login",
  "component_hierarchy": ["LoginPage", "AlertDialog (Success/Error)", "Card", "AuthForm"],
  "data": {
    "auth": "AuthContext.login() -> supabase.auth.signInWithPassword(). Sem tabela própria; erros do Supabase Auth são traduzidos para PT-BR (traduzirErro em providers.tsx)."
  },
  "state_management": {
    "local": ["email", "password", "showSuccessDialog", "showErrorDialog"]
  }
}
```

## 3. Cadastro (`/cadastro`)
```json
{
  "route": "/cadastro",
  "component_hierarchy": ["CadastroPage", "Card", "AuthForm", "SocialButton"],
  "data": {
    "auth": "AuthContext.register() -> supabase.auth.signUp() com full_name em options.data. O trigger on_auth_user_created (migration 0001) cria a linha correspondente em profiles."
  },
  "state_management": {
    "local": ["name", "email", "password"]
  }
}
```

### Cadastro Profissional (`/cadastro-profissional`)
- Insere em `professionals` ou `clinics` (conforme o tipo escolhido) com `verification_status = 'pending'`.
- Foto opcional: upload direto do client para o bucket `professionals` (Supabase Storage) em `{auth.uid()}/{uuid}.ext`, URL pública gravada em `image_url` via `inscreverProfissional`.

## 4. Portal de Notícias (`/noticias`, `/noticias/[slug]`)
```json
{
  "route": "/noticias, /noticias/[slug]",
  "component_hierarchy": ["NewsPage", "NewsCard", "FeaturedArticleHero"],
  "data": {
    "table": "news_articles (SELECT público via RLS). [slug] usa generateStaticParams + SSG."
  },
  "security": "Conteúdo renderizado com isomorphic-dompurify para sanitizar XSS (campo content é HTML)."
}
```

### Feed com IA (`/noticias-ai`, `/noticias-ai/[slug]`)
```json
{
  "route": "/noticias-ai, /noticias-ai/[slug]",
  "data": { "table": "news_articles (mesma tabela do portal tradicional)" },
  "ai": "askLegalAssistant / resumo via Genkit + Gemini — não persiste em banco (sem tabela de logs de chat)."
}
```

## 5. Acervo Digital (`/acervo-digital`)
```json
{
  "route": "/acervo-digital",
  "component_hierarchy": ["DigitalLibraryPage", "SearchBar", "SearchFilters", "Grid/List Switch", "LibraryCards"],
  "data": {
    "tables": "library_items (SELECT público) + library_favorites (favoritos do usuário logado, toggle via alternarFavorito em src/app/actions/library.ts)",
    "mapper": "src/lib/data/library.ts (mapLibraryRow)",
    "search": "busca full-text server-side via search_vector (tsvector/GIN), buscarItensAcervo em src/app/actions/library.ts, debounce de 300ms no client"
  },
  "state_management": {
    "local": ["view: 'grid'|'list'", "useSearch (filtro de tipo/ordenação, decoupled da busca por texto)"]
  },
  "note": "O dialog 'Adicionar ao Acervo' é markup inline em client-page.tsx (não um componente separado) — grava de verdade via sugerirItemAcervo (library.ts), com upload opcional de imagem para o bucket library."
}
```

## 6. Comunidade (`/comunidade`)
```json
{
  "route": "/comunidade",
  "component_hierarchy": ["CommunityPage", "CreatePost", "PostCard", "CommentSection", "CreateEventDialog", "LoginRequiredDialog"],
  "data": {
    "tables": "posts, comments, post_likes, post_saves, events (todas via Server Actions em src/app/actions/community.ts e src/app/actions/events.ts)",
    "pattern": "page.tsx é Server Component (createClient(await cookies())) — busca a primeira página de posts (.range(), 10 por página) e eventos futuros num único select aninhado (author/likes/saves/comments); client-page.tsx cuida da interação e do 'Carregar mais posts' (buscarMaisPosts, offset-based)."
  },
  "state_management": {
    "local": ["posts (useState, seed do servidor + concatenado ao paginar)", "events (useState, só futuros: starts_at >= now())", "eventoSelecionado (Dialog de detalhe do evento)"]
  },
  "post_card": {
    "editar": "editarPost (community.ts) — Dialog com Textarea pré-preenchida, só visível para o autor (posts_update_own via RLS).",
    "compartilhar": "src/lib/share.ts (compartilhar) — Web Share API com fallback de clipboard, também usado em profissionais/[id].",
    "imagem": "upload opcional para o bucket posts (Supabase Storage) em CreatePost, gravado em posts.image_url e renderizado no card via next/image."
  }
}
```

### Grupos (`/comunidade/meus-grupos`, `/explorar-grupos`, `/criar-grupo`, `/grupos/[id]`)
```json
{
  "tables": "groups (RLS: leitura pública, insert/update do dono ou admin), group_members (RLS: leitura pública, insert do próprio profile_id)",
  "actions": "src/app/actions/groups.ts (entrarNoGrupo, sairDoGrupo, criarGrupo)",
  "pattern": "/grupos/[id], /explorar-grupos e /meus-grupos são Server Component (fetch com cookies) + client-page.tsx; só /criar-grupo continua Client Component (formulário puro, sem conteúdo inicial pra ler).",
  "ux": "Entrar num grupo em /explorar-grupos abre um modal de boas-vindas com CTA para /comunidade/grupos/[id]."
}
```

## 7. Suporte IA (`/suporte-ia`)
```json
{
  "route": "/suporte-ia",
  "component_hierarchy": ["AiSupportPage", "SearchBar", "ReactMarkdown", "Skeleton"],
  "ai": "askLegalAssistant flow (Genkit + Google Gemini) — sem persistência em banco.",
  "state_management": {
    "local": ["query", "aiResponse", "loading", "hasSearchedFromUrl"]
  }
}
```

## 8. Diretório de Profissionais (`/profissionais`, `/profissionais/[id]`)
```json
{
  "route": "/profissionais, /profissionais/[id]",
  "component_hierarchy": ["ProfessionalsPage (Server Component, createStaticClient) -> ProfessionalsPageClient (useSearch descontinuado para filtro/busca, agora server-driven)", "ProfessionalProfilePage (Server Component) -> ProfessionalProfileClient"],
  "data": {
    "tables": "professionals, clinics, professional_skills, professional_experiences, reviews",
    "mapper": "src/lib/data/professionals.ts (mapProfessionalDetail, mapClinicDetail, computeReviewSummary)",
    "actions": "criarAvaliacao em src/app/actions/reviews.ts; buscarMaisProfissionais/buscarMaisClinicas/filtrarProfissionais em src/app/actions/professionals.ts",
    "search": "specialty é lista canônica (src/lib/data/specialties.ts), gravada de verdade no cadastro (root cause de um bug antigo em que o chip de especialidade combinava com prefixo truncado); chips filtram por igualdade exata, busca por nome usa search_vector (tsvector/GIN) com debounce de 300ms",
    "pagination": "10 profissionais / 6 clínicas por página (.range()), botões 'Ver mais profissionais'/'Explorar mais clínicas' reais, escondidos quando um filtro/busca está ativo"
  },
  "cache": "profissionais/page.tsx e profissionais/[id]/page.tsx usam createStaticClient() (sem cookies) + export const revalidate = 300 (ISR) — nenhuma personalização por usuário logado nessas duas rotas.",
  "note": "[id] consolida profissional+skills+experiences+reviews (ou clínica+reviews) numa única query com relações aninhadas do PostgREST, em vez de até 4 queries separadas. Botão 'Agendar consulta' foi removido (decisão de produto, item U12). Botão 'Compartilhar' usa src/lib/share.ts. Selo 'Verificado' (BadgeCheck) aparece quando verification_status = 'verified', aprovado via /admin."
}
```

## 9. Notícias Gamificadas (`/noticias-gamificadas`, `/noticias-gamificadas/trilhas/[id]`)
```json
{
  "route": "/noticias-gamificadas, /noticias-gamificadas/trilhas/[id]",
  "component_hierarchy": ["NewsGamifiedPage", "KnowledgePills", "LearningTrails (Progress do shadcn)", "QuizCard (ainda decorativo)", "TrailDetailPage (Server Component) -> TrailDetailClient (Accordion + Checkbox por passo)"],
  "data": {
    "tables": "knowledge_pills, knowledge_trails, knowledge_trail_steps (passos ordenados por trilha, leitura pública/escrita admin), trail_progress (progresso agregado do usuário logado), trail_step_completions (conclusão por passo, RLS FOR ALL restrita ao dono)",
    "mapper": "src/lib/data/knowledge.ts (mapKnowledgePill, mapKnowledgeTrail, mapKnowledgeTrailStep)",
    "actions": "alternarPassoConcluido em src/app/actions/knowledge.ts — faz o toggle em trail_step_completions e recalcula trail_progress.progress (concluídos/total × 100) no mesmo request"
  },
  "note": "Quiz semanal ('Quiz da Semana!') continua decorativo — exigiria um sistema de pontos que não existe em nenhum outro lugar do app (decisão de produto, item F8)."
}
```

## 10. Fale Conosco (`/fale-conosco`)
```json
{
  "route": "/fale-conosco",
  "component_hierarchy": ["ContactPage", "ContactForm", "InfoCards"],
  "data": {
    "table": "contact_messages (INSERT público via RLS; SELECT só admin — por isso o insert nunca encadeia .select())"
  },
  "integrations": "EmailJS (serviceID, notificationTemplateID, autoresponderTemplateID) para o e-mail de confirmação/notificação."
}
```

## 11. Central de Ajuda (`/faq`)
```json
{
  "route": "/faq",
  "component_hierarchy": ["FaqPage (client)", "SearchBar", "Accordion"],
  "data": "faqItems é um array estático no próprio arquivo — sem tabela no banco.",
  "state_management": { "local": ["useSearch (busca por texto nas perguntas)"] }
}
```

## 12. Conta e Área Pessoal

### Perfil (`/perfil`)
```json
{
  "route": "/perfil",
  "pattern": "Server Component (page.tsx) + client-page.tsx",
  "data": { "table": "profiles (full_name, bio, avatar_url)" },
  "actions": "atualizarPerfil em src/app/actions/profile.ts (avatarUrl opcional)",
  "auth": "redirect('/login') se deslogado",
  "storage": "upload direto do client para o bucket avatars (Supabase Storage) em {auth.uid()}/{uuid}.ext antes de chamar atualizarPerfil"
}
```

### Itens Salvos (`/salvos`)
```json
{
  "route": "/salvos",
  "pattern": "Server Component (2 queries em paralelo) + client-page.tsx",
  "data": {
    "tables": "post_saves (join posts/profiles) + library_favorites (join library_items)",
    "mapper": "src/lib/data/saved.ts (mapSavedPost) + src/lib/data/library.ts (mapLibraryRow)"
  },
  "actions": "reaproveita alternarSalvo (community.ts) e alternarFavorito (library.ts)"
}
```

### Configurações (`/configuracoes`)
```json
{
  "route": "/configuracoes",
  "pattern": "Server Component + client-page.tsx",
  "data": { "table": "profiles (notify_email, notify_push, profile_public — migration 0008)" },
  "actions": "atualizarPreferencias em src/app/actions/profile.ts",
  "ui": "Tema/fonte reaproveitam useTheme()/FontSizeContext já usados no header; toggles com salvamento otimista (rollback + toast se falhar)."
}
```

### Notificações (`/notificacoes`)
```json
{
  "route": "/notificacoes",
  "pattern": "Server Component + client-page.tsx",
  "data": {
    "table": "notifications (profile_id, actor_id, type, post_id, read_at, created_at)",
    "population": "2 triggers SECURITY DEFINER no banco (notify_post_like em post_likes, notify_post_comment em comments) — não é populada por código da aplicação, é automática no INSERT.",
    "mapper": "src/lib/data/notifications.ts (mapNotificationRow)"
  },
  "actions": "marcarComoLida, marcarTodasComoLidas, limparNotificacoes em src/app/actions/notifications.ts",
  "realtime": "Supabase Realtime (postgres_changes, INSERT) atualiza a lista e o contador do sino do header sem recarregar a página. Hook compartilhado: src/hooks/use-unread-notifications.ts."
}
```

### Meu Espaço (`/meu-espaco`)
```json
{
  "route": "/meu-espaco",
  "pattern": "Server Component (2 queries em paralelo) + client-page.tsx (Tabs: Dependentes | Diário)",
  "data": {
    "tables": "dependents (first_name, birth_year, relationship, notes), caregiver_journal (entry_date, mood, content) — ambas RLS FOR ALL restrita ao dono, sem migration nova",
    "mapper": "src/lib/data/caregiver.ts (mapDependentRow — calcula idade a partir de birth_year; mapJournalEntryRow — formata entry_date ancorando em meio-dia para não deslocar o dia por fuso)"
  },
  "actions": "criarDependente, atualizarDependente, excluirDependente, criarEntradaDiario, atualizarEntradaDiario, excluirEntradaDiario em src/app/actions/caregiver.ts",
  "auth": "redirect('/login') se deslogado; linkado como atalho em /perfil"
}
```

### Painel Administrativo (`/admin`)
```json
{
  "route": "/admin",
  "pattern": "Server Component (2 queries em paralelo) + client-page.tsx (Tabs: Verificações | Acervo)",
  "auth": "checa role = 'admin' em profiles no servidor; redirect('/home') silencioso se não for admin (não revela a existência da rota). Sem link em header/footer — só acessível por URL direta.",
  "data": {
    "tables": "professionals/clinics (verification_status = 'pending'), library_items (approved = false)",
    "rls": "professionals_owner_update/clinics_owner_update já permitem update por dono OU admin; library_admin_write/library_admin_delete já são admin-only — nenhuma migration nova foi necessária"
  },
  "actions": "atualizarVerificacao(tipo, id, status), aprovarItemAcervo(id), rejeitarItemAcervo(id) em src/app/actions/admin.ts — cada uma confere role = 'admin' no servidor antes de escrever, defesa em profundidade além da RLS"
}
```

## 13. Legais (`/termos-de-servico`, `/politica-de-privacidade`)
Conteúdo estático, sem dados de banco.

---
*Atualizado em 2026-07-29. Reflete a arquitetura Supabase real (pós-migração completa do Firebase/mocks), a migração completa das telas de conteúdo para Server Component + client-page.tsx (H2), a reabertura de `/profissionais` (causa raiz de specialty, paginação, busca full-text, ISR e consolidação de queries — H3/H4/H5) e as trilhas de conhecimento com passos reais (F8).*
