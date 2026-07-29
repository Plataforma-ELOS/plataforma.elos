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

## 4. Identidade Visual (Paleta de Cores)
A paleta de cores foi escolhida para transmitir calma, confiança e modernidade.

### 4.1. Tema Claro (Light Mode)
- **Background:** `hsl(257 100% 99%)` - Branco Lavanda (Fundo suave).
- **Primary:** `hsl(257 70% 75%)` - Lavanda (Botões e destaques).
- **Secondary:** `hsl(215 68% 90%)` - Azul Céu Pálido (Badges).
- **Accent:** `hsl(215 77% 78%)` - Azul Sereno (Hovers).
- **Foreground:** `hsl(256 10% 20%)` - Roxo Acinzentado Escuro (Texto).

### 4.2. Tema Escuro (Dark Mode)
- **Background:** `hsl(257 30% 12%)` - Roxo Profundo Noturno.
- **Primary:** `hsl(257 80% 80%)` - Lavanda Vibrante.
- **Accent:** `hsl(215 70% 70%)` - Azul Pastel.

## 5. Requisitos Funcionais

### 5.1. Suporte Inteligente (IA)
- **Assistente Jurídico/Social:** Chatbot especializado em direitos TEA no Brasil.
- **IA em Notícias:** Resumos e assistente contextual para artigos.

### 5.2. Comunidade E.L.O.S
- **Feed Social:** Interação entre membros e sistema de posts.
- **Grupos Temáticos:** Espaços focados em temas específicos (ex: T.O., Adolescência).

### 5.3. Acervo Digital
- **Biblioteca Multimídia:** Vídeos, PDFs e guias categorizados.
- **Sugestão de Material:** Usuários podem sugerir novos itens (com upload de imagem opcional), que ficam pendentes de aprovação administrativa antes de aparecer para os demais.
- **Busca:** Full-text server-side (por título, autor e tags), independente do filtro por tipo de material.

### 5.4. Rede de Profissionais
- **Diretório:** Especialistas e clínicas parceiras, avaliados pela comunidade, com perfis detalhados (contato, especialidade, experiências, avaliações).
- **Cadastro Profissional/Clínica:** Formulário de inscrição com especialidade (lista fixa de categorias + opção de texto livre), foto e dados de registro; fica pendente até aprovação administrativa.
- **Selo Verificado:** Badge exibido no card e no perfil após aprovação via Painel Administrativo.
- **Paginação e Busca:** Listagem pagina de forma independente para profissionais e clínicas ("carregar mais"); busca por nome e filtro exato por especialidade, ambos server-side (full-text).

### 5.5. Área do Cuidador
- **Meu Espaço:** Cadastro de dependentes (nome, ano de nascimento, parentesco, notas) e diário pessoal com registro de humor por data — dados privados, visíveis só ao próprio cuidador.

### 5.6. Trilhas de Conhecimento
- **Pílulas de Conhecimento:** Cards de aprendizado rápido por categoria (Direitos, Bem-estar, Saúde).
- **Trilhas com Passos Reais:** Cada trilha tem uma sequência de passos com conteúdo próprio; o cuidador marca cada passo como concluído e a barra de progresso reflete o avanço real.
- **Quiz Semanal:** Ainda não implementado — depende de uma decisão de produto sobre um eventual sistema de pontuação, que não existe hoje em nenhuma outra parte da plataforma.

### 5.7. Conta e Notificações
- **Perfil e Preferências:** Edição de nome/bio/foto, tema, tamanho de texto e preferências de notificação/privacidade.
- **Itens Salvos:** Lista unificada de posts e materiais do acervo favoritados.
- **Notificações:** Central dedicada com aviso em tempo real de curtidas e comentários em posts próprios, e contador de não lidas no sino do header.

### 5.8. Painel Administrativo
- **Moderação:** Aprovação/rejeição de cadastros de profissionais e clínicas pendentes, e de itens sugeridos ao Acervo Digital. Acesso restrito a contas com papel de administrador; a rota não aparece em nenhum menu.

### 5.9. Segurança e Anti-abuso
- **Rate Limiting:** Limite de envios por usuário/e-mail em formulários públicos (contato e avaliações), aplicado no próprio banco de dados — vale mesmo para quem tenta contornar a interface.
- **Upload de Imagens:** Fotos de perfil, de profissional/clínica, de itens do acervo e de posts são armazenadas no Supabase Storage, com controle de acesso por dono.

## 6. Stack Tecnológica
- **Framework:** Next.js 15 (App Router).
- **Backend:** Supabase (Postgres, Auth, Row Level Security, Realtime) — sem backend próprio; toda regra de acesso é aplicada via RLS no banco.
- **Estilização:** Tailwind CSS e Shadcn UI.
- **IA Engine:** Google Gemini 2.0 via Genkit.
- **Deploy:** Vercel.

---
*Última atualização: 2026-07-29*