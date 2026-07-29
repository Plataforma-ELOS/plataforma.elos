# Plataforma E.L.O.S - Cuidando de quem cuida

A **E.L.O.S** é uma plataforma digital de apoio integral dedicada a cuidadores de pessoas com Transtorno do Espectro Autista (TEA). Sob a premissa de que "cuidar de alguém começa por cuidar de si", a plataforma centraliza recursos, comunidade e conexão com profissionais para reduzir a vulnerabilidade e o isolamento dos cuidadores.

## 🚀 Visão Geral

O projeto nasceu para preencher uma lacuna de suporte emocional e informacional para famílias no espectro autista. A plataforma utiliza tecnologias modernas para oferecer clareza sobre direitos, ferramentas de aprendizagem e um espaço seguro de conexão.

## ✨ Principais Funcionalidades

### 🤖 Suporte Inteligente (IA)
- **Assistente Jurídico/Social:** Chatbot alimentado por IA (Google Gemini via Genkit) especializado em legislação brasileira sobre TEA (BPC/LOAS, laudos, etc.).
- **Respostas em Streaming:** Experiência de conversação natural e instantânea.
- **IA em Notícias:** Resumos automáticos do feed diário e assistente contextual para artigos.

### 👥 Comunidade E.L.O.S
- **Feed Social:** Publicação de posts, comentários e interações entre membros.
- **Grupos Temáticos:** Espaços focados em temas específicos como "Dicas de T.O." ou "Adolescência e TEA".
- **Ambiente Seguro:** Regras de conduta focadas em acolhimento e moderação.

### 📚 Acervo Digital
- **Biblioteca Multimídia:** Repositório categorizado de vídeos, guias (PDF) e materiais educativos.
- **Sistema de Colaboração:** Usuários podem sugerir novos materiais para análise da equipe.

### 🩺 Rede de Profissionais
- **Diretório Verificado:** Listagem de especialistas (Psicólogos, Neuropediatras, Fonoaudiólogos) e clínicas parceiras.
- **Perfis Detalhados:** Informações de contato, especialidades e avaliações reais da comunidade.

### 🎮 Gamificação e Notícias
- **Pílulas de Conhecimento:** Cards de aprendizado rápido sobre direitos e saúde.
- **Trilhas de Aprendizado:** Passos reais e ordenados por trilha, com progresso calculado a partir das etapas concluídas por cada cuidador.

### 🧑‍⚕️ Cadastro e Verificação Profissional
- **Inscrição Profissional/Clínica:** Formulário com especialidade (lista fixa + campo livre para clínicas), foto e dados de registro.
- **Selo Verificado:** Aprovação de profissionais e clínicas via painel administrativo.

### 🧡 Área do Cuidador
- **Meu Espaço:** Cadastro de dependentes e diário pessoal com registro de humor, privados a cada cuidador (RLS por dono).

### 🔔 Notificações e Conta
- **Central de Notificações:** Avisos em tempo real de curtidas e comentários.
- **Itens Salvos, Configurações e Perfil:** Telas dedicadas para gerenciar preferências, tema, fonte e conteúdo salvo.

### 🛡️ Painel Administrativo
- **Moderação:** Aprovação de profissionais/clínicas e de itens sugeridos para o Acervo Digital, restrito a administradores.

## 🛠️ Stack Tecnológica

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Backend/Banco de Dados:** [Supabase](https://supabase.com/) (Postgres, Auth, Row Level Security, Storage, Realtime)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **IA Engine:** [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://genkit.dev/)
- **Integração de E-mail:** [EmailJS](https://www.emailjs.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Testes:** [Vitest](https://vitest.dev/) (unitários) e [Playwright](https://playwright.dev/) (E2E)
- **CI/CD:** GitHub Actions (`typecheck` · `test` · `build` em cada PR) + deploy automático via Vercel

## 📁 Estrutura do Projeto

```text
src/
├── ai/             # Configuração do Genkit e Fluxos de IA
├── app/            # Páginas (Server Components) e Server Actions (App Router)
├── components/     # Componentes de UI e Seções da Página
├── hooks/          # Hooks customizados (useToast, useSearch, etc.)
└── lib/            # Utilitários, mappers de dados (lib/data/) e clients do Supabase
supabase/
└── migrations/     # Histórico de migrations SQL do banco (ver README da pasta)
docs/
├── product/        # PRD e conteúdo de tela por rota
├── architecture/   # Rotas, arquitetura técnica, segurança/RLS, harmonia Supabase↔Vercel
├── design/         # Guia de estilo e inventário de imagens externas
└── project/        # Roadmap, guia mestre de finalização e histórico de PRs
```

## ⚙️ Como Executar

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   Preencha ao menos `GEMINI_API_KEY` para ativar `/suporte-ia` e o resumo de `/noticias-ai` — as chaves do Supabase e do EmailJS já vêm preenchidas no exemplo (são chaves públicas/anon, não secretas).
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação em `http://localhost:9002`.

## ✅ Qualidade

```bash
npm run typecheck   # TypeScript
npm run test        # Vitest (testes unitários)
npm run build       # Build de produção (roda lint + typecheck também)
```

---

Para mais detalhes sobre o roadmap e especificações técnicas, consulte o [Documento de Requisitos de Produto (PRD)](docs/product/prd.md).

*Desenvolvido com carinho para a comunidade TEA.*