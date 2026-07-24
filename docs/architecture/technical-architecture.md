# Arquitetura Técnica Detalhada - Plataforma E.L.O.S.

Este documento fornece uma análise técnica profunda das 11 telas principais da aplicação, servindo como guia para engenheiros e auditores de sistema.

---

## 1. Hub Principal (/home)
```json
{
  "route": "/home",
  "component_hierarchy": [
    "RootLayout",
    "Providers",
    "HeaderSecondary",
    "Main",
    "Hero",
    "AiSupportHome",
    "NewDigitalCollection",
    "NewCommunity",
    "NewsCarousel",
    "NewProfessionals",
    "Footer"
  ],
  "firebase_nodes": {
    "auth": "AuthContext: Monitoramento de sessão global para exibir avatar ou botões de login.",
    "firestore": "Implementação Futura: Fetch de posts em destaque e profissionais verificados."
  },
  "state_management": {
    "local": ["isScrolled: Controle de transparência do Header", "query: Input de busca da seção IA"],
    "global": ["AuthContext", "FontSizeContext", "ThemeContext"]
  },
  "ui_specs": {
    "animations": "Fade-in-0 (500ms), Pulse-slow (IA Glow effect)",
    "styling": "Tailwind HSL Variables, Shadcn Carousel (Embla)",
    "responsive": "Mobile-first com Dynamic Imports para componentes below-the-fold."
  }
}
```

## 2. Login (/login)
```json
{
  "route": "/login",
  "component_hierarchy": ["LoginPage", "AlertDialog (Success/Error)", "Card", "AuthForm"],
  "firebase_nodes": {
    "auth": "Context: login(user). Atualmente validando contra o mock 'registeredUsers' no Providers.tsx."
  },
  "state_management": {
    "local": ["email", "password", "showSuccessDialog", "showErrorDialog"]
  },
  "ui_specs": {
    "layout": "Two-column grid (Form/Image) em LG+, Single-column em Mobile.",
    "feedback": "AlertDialog com ícones CheckCircle (Success) e XCircle (Destructive)."
  }
}
```

## 3. Cadastro (/cadastro)
```json
{
  "route": "/cadastro",
  "component_hierarchy": ["CadastroPage", "Card", "AuthForm", "SocialButton"],
  "firebase_nodes": {
    "auth": "Context: register(newUser). Adiciona dados ao array reativo de usuários no Providers.tsx."
  },
  "state_management": {
    "local": ["name", "email", "password"]
  },
  "ui_specs": {
    "styling": "Gradiente Branding Logo (Blue/Purple/Pink)",
    "interaction": "Navegação via useRouter() pós-registro."
  }
}
```

## 4. Portal de Notícias (/noticias)
```json
{
  "route": "/noticias",
  "component_hierarchy": ["NewsPage", "NewsCard", "FeaturedArticleHero"],
  "firebase_nodes": {
    "firestore": "Futuro: Coleção 'news_articles' com ordenação por timestamp."
  },
  "state_management": {
    "local": ["newsArticles: Array estático (mock)"]
  },
  "ui_specs": {
    "effects": "Group-hover zoom nas imagens, hover:translate-y-2 nos cards.",
    "typography": "PT_Sans Headline para títulos expansivos."
  }
}
```

## 5. Acervo Digital (/acervo-digital)
```json
{
  "route": "/acervo-digital",
  "component_hierarchy": ["DigitalLibraryPage", "SearchBar", "FilterSelect", "Grid/List Switch", "LibraryCards"],
  "firebase_nodes": {
    "firestore": "Futuro: Coleção 'digital_assets' filtrável por 'type' (video|document)."
  },
  "state_management": {
    "local": ["view: 'grid'|'list'", "searchQuery", "filterType", "sortOrder"]
  },
  "ui_specs": {
    "components": "Suspense Boundary para SearchParams, Dialog (Add to Library).",
    "animations": "Animate-in fade-in-0 duration-500."
  }
}
```

## 6. Comunidade (/comunidade)
```json
{
  "route": "/comunidade",
  "component_hierarchy": ["CommunityPage", "PostCard", "CommentSection", "SidebarEvents"],
  "firebase_nodes": {
    "auth": "Identificação de 'isOwner' para permissão de exclusão de posts.",
    "firestore": "Futuro: Real-time queries em 'posts' e 'comments'."
  },
  "state_management": {
    "local": ["posts: Reativo via useState", "showAllEvents: toggle"]
  },
  "ui_specs": {
    "interaction": "Optimistic Updates simulados para likes e comentários.",
    "accessibility": "DropdownMenu para ações de moderação (Editar/Excluir)."
  }
}
```

## 7. Explorar Grupos (/comunidade/explorar-grupos)
```json
{
  "route": "/comunidade/explorar-grupos",
  "component_hierarchy": ["ExploreGroupsPage", "Card", "Avatar", "Badge"],
  "firebase_nodes": {
    "firestore": "Futuro: Relacionamento M-N em 'user_groups'."
  },
  "state_management": {
    "local": ["groups: Membership toggle local"]
  },
  "ui_specs": {
    "styling": "Shadow-lg hover:shadow-primary/20",
    "feedback": "Toasts dinâmicos ao entrar/sair de grupos."
  }
}
```

## 8. Suporte IA (/suporte-ia)
```json
{
  "route": "/suporte-ia",
  "component_hierarchy": ["AiSupportPage", "SearchBar", "ReactMarkdown", "Skeleton"],
  "firebase_nodes": {
    "genkit": "Integração via askLegalAssistant flow (Google Gemini 2.0).",
    "firestore": "Futuro: Logs de chats em 'ai_interactions' para melhoria do modelo."
  },
  "state_management": {
    "local": ["query", "aiResponse", "loading", "hasSearchedFromUrl"]
  },
  "ui_specs": {
    "effects": "Streaming Text (TextDecoder), Pulsing Gradient Blur (IA focus).",
    "interaction": "Auto-scroll para resposta via useRef."
  }
}
```

## 9. Diretório de Profissionais (/profissionais)
```json
{
  "route": "/profissionais",
  "component_hierarchy": ["ProfessionalsPage", "Carousel", "SpecialtyCards", "ClinicCards"],
  "firebase_nodes": {
    "firestore": "Futuro: Coleção 'professionals' com geolocalização."
  },
  "state_management": {
    "local": ["searchQuery via useRef"]
  },
  "ui_specs": {
    "styling": "Blur masks laterais no Carousel, Ring effects nos avatares.",
    "components": "Shadcn Carousel com Autoplay plugin."
  }
}
```

## 10. Notícias Gamificadas (/noticias-gamificadas)
```json
{
  "route": "/noticias-gamificadas",
  "component_hierarchy": ["NewsGamifiedPage", "KnowledgePills", "LearningTrails", "QuizCard"],
  "firebase_nodes": {
    "firestore": "Futuro: 'user_progress' tracking e 'quiz_scores'."
  },
  "state_management": {
    "local": ["knowledgePills, knowledgeTrails (Mock data)"]
  },
  "ui_specs": {
    "components": "Progress Bar (Shadcn UI), iconografia colorida (Lucide)."
  }
}
```

## 11. Fale Conosco (/fale-conosco)
```json
{
  "route": "/fale-conosco",
  "component_hierarchy": ["ContactPage", "ContactForm", "InfoCards"],
  "firebase_nodes": {
    "integrations": "EmailJS (serviceID, notificationTemplateID, autoresponderTemplateID)."
  },
  "state_management": {
    "local": ["name", "email", "message", "loading"]
  },
  "ui_specs": {
    "styling": "Card layouts para informações de contato, Form validation básica.",
    "feedback": "Loading states nos botões e Toasts de confirmação."
  }
}
```
