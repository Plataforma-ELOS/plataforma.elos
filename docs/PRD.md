# Documento de Requisitos de Produto (PRD) - Plataforma E.L.O.S

## 1. Visão Geral do Projeto
A **E.L.O.S** é uma plataforma digital de apoio integral dedicada a cuidadores de pessoas com Transtorno do Espectro Autista (TEA). Sob a premissa de que "cuidar de alguém começa por cuidar de si", a plataforma centraliza recursos, comunidade e conexão com profissionais para reduzir a vulnerabilidade e o isolamento dos cuidadores.

## 2. Objetivos Estratégicos
- **Suporte Informacional:** Oferecer clareza sobre direitos complexos (BPC/LOAS, leis trabalhistas).
- **Conexão Comunitária:** Criar um ambiente seguro e acolhedor para troca de experiências.
- **Curadoria de Recursos:** Facilitar o acesso a materiais educativos e terapêuticos de qualidade.
- **Rede de Confiança:** Conectar famílias a profissionais e clínicas verificados e avaliados.

## 3. Público-Alvo
- **Primário:** Pais, mães e responsáveis legais de pessoas com TEA.
- **Secundário:** Profissionais de saúde e educação que buscam materiais de apoio e rede de contatos.
- **Terciário:** Pessoas com TEA em busca de autonomia e informação sobre seus direitos.

## 4. Requisitos Funcionais (Principais Módulos)

### 4.1. Suporte Inteligente (IA)
- **Assistente Jurídico/Social:** Chatbot alimentado por IA (Gemini) especializado em direitos da comunidade TEA no Brasil.
- **Streaming de Respostas:** Interface em tempo real para uma experiência de conversação natural.
- **IA em Notícias:** Resumos automáticos do feed diário e assistente contextual dentro de cada artigo de notícia.

### 4.2. Comunidade E.L.O.S
- **Feed Social:** Publicação de posts, comentários e sistema de curtidas (Atualmente em modo simulado).
- **Gestão de Grupos:** Exploração e criação de grupos temáticos (ex: "Dicas de T.O.", "Adolescência e TEA").
- **Espaço Seguro:** Regras de conduta para garantir acolhimento sem julgamentos.

### 4.3. Acervo Digital
- **Biblioteca Multimídia:** Repositório categorizado de vídeos, documentos (PDF), jogos e guias.
- **Busca e Filtros:** Sistema avançado de filtragem por tipo de material e tags.
- **Contribuição:** Canal para usuários sugerirem novos materiais para análise da equipe.

### 4.4. Rede de Profissionais
- **Diretório Verificado:** Listagem de especialistas (Psicólogos, Neuropediatras, Fonoaudiólogos, etc.) e clínicas.
- **Perfis Detalhados:** Exibição de CRM/CRP, especialidades, bio e informações de contato.
- **Sistema de Avaliação:** Feedback quantitativo e qualitativo da comunidade sobre o atendimento.

### 4.5. Notícias e Gamificação
- **Feed Atualizado:** Artigos sobre avanços científicos, mudanças na legislação e eventos.
- **Pílulas de Conhecimento:** Cards de aprendizado rápido e trilhas de conhecimento com barra de progresso.

## 5. Requisitos Não Funcionais
- **Acessibilidade (WCAG):** Interface adaptável com controle de tamanho de fonte e contraste.
- **Performance:** Carregamento rápido via Server Components e carregamento dinâmico (Skeleton screens).
- **Segurança da IA:** Instruções de sistema (System Prompts) para evitar diagnósticos médicos ou conselhos jurídicos definitivos.
- **Design Responsivo:** Otimização para dispositivos móveis e desktop.

## 6. Stack Tecnológica
- **Framework:** Next.js 15 (App Router).
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS e Shadcn UI.
- **IA Engine:** Google Gemini 2.0 via Genkit.
- **Integração de E-mail:** EmailJS.
- **Iconografia:** Lucide React.

## 7. Roadmap de Desenvolvimento
- [x] **Fase 1: MVP Visual e IA:** Estrutura de navegação, assistentes de IA funcionais e UI/UX base.
- [ ] **Fase 2: Persistência:** Integração com Firebase Firestore para salvar posts, grupos e usuários de forma real.
- [ ] **Fase 3: Autenticação:** Implementação do Firebase Auth (Social Login e E-mail/Senha).
- [ ] **Fase 4: Serviços:** Funcionalidade real de agendamento de consultas e sistema de gamificação completo.

---
*Última atualização: Setembro de 2025*