# Arquitetura Técnica Detalhada - Plataforma E.L.O.S.

Este documento fornece uma análise técnica das telas da aplicação, servindo como guia para engenheiros e auditores de sistema.

**Stack real (não Firebase):** Next.js 15 (App Router) + Supabase (Postgres, Auth, Realtime) + shadcn/ui + Tailwind, deploy na Vercel. Toda leitura/escrita passa pelo PostgREST sujeita a RLS — ver `docs/architecture/security-checklist.md`. Genkit/Gemini é usado só nos dois fluxos de IA (`/suporte-ia`, `/noticias-ai/[slug]`), sem relação com dados de usuário.

Padrão de acesso a dados predominante: a maioria das telas é **Client Component** que busca via `createClient()` (browser client, `src/lib/supabase/client.ts`) dentro de `useEffect`. As telas mais recentes (`/perfil`, `/salvos`, `/configuracoes`, `/notificacoes`, `/comunidade/grupos/[id]`, `/profissionais/[id]`) seguem o padrão **Server Component + client-page.tsx**: a página busca os dados no servidor (`createClient(await cookies())`, `src/lib/supabase/server.ts`) e repassa como props para um componente `"use client"` que cuida da interação. Migrar as telas mais antigas para esse segundo padrão é o item `3.1`/`E1` do roadmap.

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
  "component_hierarchy": ["DigitalLibraryPage", "SearchBar", "SearchFilters", "Grid/List Switch", "LibraryCards", "AddToLibraryDialog"],
  "data": {
    "tables": "library_items (SELECT público) + library_favorites (favoritos do usuário logado, toggle via alternarFavorito em src/app/actions/library.ts)",
    "mapper": "src/lib/data/library.ts (mapLibraryRow)"
  },
  "state_management": {
    "local": ["view: 'grid'|'list'", "useSearch (query/filtro/ordenação)"]
  },
  "note": "O formulário 'Adicionar ao Acervo' ainda é um mock local (não persiste) — upload de material real é o item F7/E3 do roadmap."
}
```

## 6. Comunidade (`/comunidade`)
```json
{
  "route": "/comunidade",
  "component_hierarchy": ["CommunityPage", "CreatePost", "PostCard", "CommentSection", "CreateEventDialog", "LoginRequiredDialog"],
  "data": {
    "tables": "posts, comments, post_likes, post_saves, events (todas via Server Actions em src/app/actions/community.ts e src/app/actions/events.ts)",
    "pattern": "Client Component com fetch em useEffect (createClient() do browser). Posts trazem author/likes/saves/comments num único select aninhado."
  },
  "state_management": {
    "local": ["posts (useState, recarregado após criar post)", "events (useState, só futuros: starts_at >= now())", "eventoSelecionado (Dialog de detalhe do evento)"]
  },
  "post_card": {
    "editar": "editarPost (community.ts) — Dialog com Textarea pré-preenchida, só visível para o autor (posts_update_own via RLS).",
    "compartilhar": "src/lib/share.ts (compartilhar) — Web Share API com fallback de clipboard, também usado em profissionais/[id]."
  }
}
```

### Grupos (`/comunidade/meus-grupos`, `/explorar-grupos`, `/criar-grupo`, `/grupos/[id]`)
```json
{
  "tables": "groups (RLS: leitura pública, insert/update do dono ou admin), group_members (RLS: leitura pública, insert do próprio profile_id)",
  "actions": "src/app/actions/groups.ts (entrarNoGrupo, sairDoGrupo, criarGrupo)",
  "pattern": "/grupos/[id] é Server Component (fetch com cookies) + client-page.tsx; as demais são Client Component com fetch em useEffect.",
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
  "component_hierarchy": ["ProfessionalsPage (client, useSearch)", "ProfessionalProfilePage (Server Component) -> ProfessionalProfileClient"],
  "data": {
    "tables": "professionals, clinics, professional_skills, professional_experiences, reviews",
    "mapper": "src/lib/data/professionals.ts (mapProfessionalDetail, mapClinicDetail, computeReviewSummary)",
    "actions": "criarAvaliacao em src/app/actions/reviews.ts"
  },
  "note": "[id] é Server Component: busca em professionals OU clinics (o que existir) + reviews, e repassa para o client-page. Botão 'Agendar consulta' foi removido (decisão de produto, item U12). Botão 'Compartilhar' usa src/lib/share.ts."
}
```

## 9. Notícias Gamificadas (`/noticias-gamificadas`)
```json
{
  "route": "/noticias-gamificadas",
  "component_hierarchy": ["NewsGamifiedPage", "KnowledgePills", "LearningTrails", "QuizCard"],
  "data": {
    "tables": "knowledge_pills, knowledge_trails, trail_progress (progresso do usuário logado)"
  }
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
  "actions": "atualizarPerfil em src/app/actions/profile.ts",
  "auth": "redirect('/login') se deslogado"
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
*Atualizado em 2026-07-27. Reflete a arquitetura Supabase real (pós-migração completa do Firebase/mocks), as telas adicionadas na Sprint 5 e a Área do Cuidador (F5/1.6).*
