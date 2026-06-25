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
- **Trilhas de Aprendizado:** Caminhos guiados com barra de progresso para capacitação dos cuidadores.

## 🛠️ Stack Tecnológica

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **IA Engine:** [Google Gemini 2.0](https://deepmind.google/technologies/gemini/) via [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Integração de E-mail:** [EmailJS](https://www.emailjs.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 📁 Estrutura do Projeto

```text
src/
├── ai/             # Configuração do Genkit e Fluxos de IA
├── app/            # Páginas e Rotas (App Router)
├── components/     # Componentes de UI e Seções da Página
├── hooks/          # Hooks customizados (Toast, etc.)
├── lib/            # Utilitários e configurações
└── firebase/       # (Em breve) Configurações de persistência
docs/
└── PRD.md          # Documento de Requisitos de Produto completo
```

## ⚙️ Como Executar

1. Clone o repositório.
2. Instale as dependências:
   ```bash
      npm install
         ```
         3. Execute o servidor de desenvolvimento:
            ```bash
               npm run dev
                  ```
                  4. Acesse a aplicação em `http://localhost:9002`.

                  ---

                  Para mais detalhes sobre o roadmap e especificações técnicas, consulte o [Documento de Requisitos de Produto (PRD)](docs/PRD.md).

                  *Desenvolvido com carinho para a comunidade TEA.*