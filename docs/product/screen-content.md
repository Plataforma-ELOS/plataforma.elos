# Inventário de Conteúdo Textual Completo - Plataforma E.L.O.S.

Este documento cataloga cada fragmento de texto visível na plataforma, servindo como a "Fonte da Verdade" para UX Writing, traduções e acessibilidade.

---

## 🏗️ Elementos Globais (Presentes em todas as telas)

### Header (Cabeçalho)
*   **Logo:** "Plataforma E.L.O.S" (com gradiente branding).
*   **Menu de Navegação:** "Notícias", "Acervo Digital", "Comunidade", "Suporte IA", "Perfis Profissionais", "Fale Conosco".
*   **Menu de Usuário (Dropdown):**
    *   *Deslogado:* "Minha Conta", "Fazer Login", "Criar Conta".
    *   *Logado:* [Nome do Usuário], [Email], "Editar Perfil", "Itens Salvos", "Configurações", "Ajuda", "Sair".
    *   *Configurações de Acessibilidade:* "Tema" (Claro, Escuro), "Tamanho do Texto" (Pequeno, Normal, Grande).
*   **Acessibilidade:** "Notificações" (Sr-only), "Abrir menu" (Mobile).

### Footer (Rodapé)
*   **Missão:** "Nossa Missão: Cuidar de quem cuida, oferecendo suporte, informação e comunidade para cuidadores de pessoas com TEA."
*   **Colunas:**
    *   "Plataforma E.L.O.S": Notícias, Acervo Digital, Comunidade, Suporte IA, Perfis Profissionais.
    *   "Suporte": Fale Conosco, FAQ.
    *   "Legal": Termos de Serviço, Política de Privacidade.
*   **Rodapé Técnico:** "Acessibilidade: WCAG", "Política de Cookies", "© 2025 Plataforma E.L.O.S. Todos os direitos reservados."

---

## 1. Hub Principal (`/home`)

*   **Hero:**
    *   Badge Flutuante: "Sua jornada de cuidado começa aqui."
    *   Título: "Cuidar de alguém começa por cuidar de si."
    *   Descrição: "Cuidar é ajudar quem você ama a viver melhor. Aqui, você encontra recursos, comunidade e profissionais que entendem sua jornada."
*   **Suporte IA (Acesso Rápido):**
    *   Badge Social: "Tiraram suas dúvidas"
    *   Título: "Tire suas dúvidas aqui"
    *   Subtítulo: "A IA que te ajuda com a parte jurídica."
    *   Input Placeholder: "Deixe sua dúvida aqui..."
*   **Recursos (Cards de Atalho):**
    *   Título da Seção: "Recursos feitos para você" / "Ferramentas e espaços pensados para fortalecer sua jornada de cuidado."
    *   Card 1: "Conecte-se na Comunidade" / "Um espaço seguro para compartilhar vitórias, desafios e encontrar apoio mútuo."
    *   Card 2: "Tire suas dúvidas com a IA" / "Receba orientações claras sobre direitos, laudos e o BPC de forma instantânea."
    *   Card 3: "Explore o Acervo Digital" / "Acesse nossa biblioteca com palestras, artigos e materiais selecionados por especialistas."
*   **Comunidade (Diferenciais):**
    *   Título: "O seu lugar ideal"
    *   Pontos: "Conexões que Acolhem" (Encontre e converse...), "Informação Confiável" (Acesse um acervo...), "Ferramentas que Capacitam" (Desde um assistente...).
    *   Botão: "Veja o que dizem sobre nós"
    *   Modal Depoimentos: "Depoimentos da nossa comunidade", Ratings de 5 estrelas, "Ana P.", "João M.", "Carla F.", "Marcos R.".
*   **Notícias:**
    *   Título: "Últimas notícias"
    *   Cards (Carrossel): Badges de Categoria (Legislação, Saúde, etc.), Título curto, Ícone de seta.
*   **Profissionais:**
    *   Título: "Profissionais de Confiança"
    *   Slogan: "Onde o cuidado é valorizado e mantido."
    *   Botão: "Ver Perfil"

---

## 2. Autenticação

### Login (`/login`)
*   **Títulos:** "Bem-vindo(a) de volta!", "Entre com sua conta para continuar."
*   **Formulário:** "Email", "Senha", "Lembrar de mim".
*   **Placeholders:** "seu@email.com", "••••••••".
*   **Botão:** "Entrar".
*   **Rodapé:** "Não tem uma conta? Crie uma agora".
*   **Modais de Feedback:**
    *   *Sucesso:* "Login Realizado com Sucesso!", "Seja bem-vindo(a) de volta! Você será redirecionado...", "Continuar".
    *   *Erro:* "Dados inválidos", "Os dados inseridos não foram encontrados...", "Tentar Novamente", "Criar Conta".

### Cadastro de Usuário (`/cadastro`)
*   **Títulos:** "Crie sua conta", "É rápido, simples e abre as portas para um mundo de apoio."
*   **Formulário:** "Nome", "Email", "Senha", "Lembrar de mim".
*   **Placeholders:** "Seu nome completo", "seu@email.com", "••••••••".
*   **Social:** "Ou continue com", "Google", "Apple".
*   **Rodapé:** "Já tem uma conta? Faça Login", "É um profissional ou clínica? Cadastre-se aqui".

### Cadastro Profissional (`/cadastro-profissional`)
*   **Navegação:** "Voltar".
*   **Títulos:** "Cadastro Profissional", "Submeta sua inscrição para participar do time de perfis profissionais...".
*   **Formulário:** "Nome Completo", "Email", "Tipo de Cadastro" (Profissional Liberal, Profissional de Clínica, Clínica), "CNPJ", "Número do Registro Profissional", "Compartilhe um pouco de sua experiência".
*   **Contador:** "0/200 palavras".
*   **Botão:** "Enviar Inscrição".
*   **Feedback Sucesso:** "Inscrição Realizada com Sucesso!", "Sua inscrição foi recebida... Você receberá uma resposta em seu e-mail em um período de até 2 semanas.", "Ok, entendi!".

---

## 3. Conteúdo e Notícias

### Portal de Notícias (`/noticias`)
*   **Header:** "Notícias e Artigos", "Mantenha-se atualizado com as últimas novidades...".
*   **Destaque:** "Ler artigo completo".
*   **Seção:** "Últimas Notícias".
*   **NewsCard:** Badges (Legislação, Tecnologia, Saúde), Datas, Títulos, "Ver mais".

### Leitura de Notícia (`/noticias/[slug]`)
*   **Navegação:** "Voltar para todas as notícias".
*   **Meta:** Categoria, Autor, Data.
*   **Conteúdo:** Títulos de seção (H3), Listas de pontos.

### Feed com IA (`/noticias-ai`)
*   **Header:** "Feed de Notícias Inteligente", "Seu feed personalizado com as últimas novidades, resumidas e analisadas por IA.".
*   **Card IA:** "Resumo do Dia com IA", Conteúdo gerado dinamicamente (resumo dos títulos).
*   **Filtros:** "Filtrar por tags" (lei, trabalho, direitos, tecnologia, etc.).
*   **Botão:** "Ler e Interagir com IA".

### Notícia com Chat IA (`/noticias-ai/[slug]`)
*   **Card Chat:** "Pergunte à IA sobre esta notícia".
*   **Input:** "Ex: 'Quais os principais pontos da lei?'".
*   **Botão:** "Perguntar".
*   **Status:** "Processando..." (Skeleton).

### Notícias Gamificadas (`/noticias-gamificadas`)
*   **Header:** "Pílulas de Conhecimento", "Aprenda de forma rápida e divertida...".
*   **Seção 1 (Pílulas):** "Destaques da Semana", "Você sabia?", "Dica Rápida", "Fato Importante", "Saber mais".
*   **Seção 2 (Trilhas):** "Suas Trilhas de Conhecimento", "Trilha: Entendendo o Laudo de TEA", "Trilha: Primeiros Passos na Escola", Porcentagem de progresso, "Continuar Trilha".
*   **Seção 3 (Quiz):** "Teste seus Conhecimentos", "Quiz da Semana!", "Acerte as perguntas sobre as notícias...","Começar Quiz".

---

## 4. Acervo Digital (`/acervo-digital`)

*   **Header:** "Acervo Digital", "A plataforma definitiva para encontrar, compartilhar e colaborar com materiais sobre o TEA.".
*   **Ação:** "Adicionar ao Acervo".
*   **Controles:** 
    *   Busca: "Buscar por título, tag, etc...".
    *   Ordenação: "Ordenar: Mais Recentes", "Ordenar: Mais Antigos".
    *   Filtros: "Filtrar: Todos", "Vídeos", "Documentos".
    *   Visualização: "Grade", "Lista" (Icon hints).
*   **Cards:** "Vídeo", "Documento", "Assistir Agora", "Fazer Download", Tooltip "Favoritar".
*   **Modal Adicionar:** "Adicionar ao Acervo", "Título", "Autor", "Tipo" (Vídeo, Documento, Jogo, Outro), "Tags", "Link", "Cancelar", "Enviar para análise".
*   **Feedback Adição:** "Material Enviado com Sucesso!", "Obrigado por sua contribuição! Nossa equipe irá analisar...", "Ok, entendi!".
*   **Empty State:** "Nenhum resultado encontrado", "Tente buscar por outras palavras-chave...".

---

## 5. Comunidade

### Feed Principal (`/comunidade`)
*   **Título:** "Posts em Destaque", "As conversas mais populares da comunidade no momento.".
*   **PostCard:** "Curtir", "Comentar", "Compartilhar", "Editar Post", "Excluir Post".
*   **Contador:** "X comentários", "X curtidas".
*   **CommentSection:** "Escreva um comentário...", "Publicar", "Agora".
*   **Sidebar:**
    *   "Próximos Eventos", "Ver todos os eventos", "Ver menos eventos".
    *   "Meus Grupos", "Ver meus grupos", "Criar um Grupo".
*   **Acesso Restrito (Modal):** "Acesso Restrito", "Para acessar esta funcionalidade e interagir com a comunidade, você precisa fazer login ou criar uma conta.", "Agora não", "Fazer Login".

### Meus Grupos (`/comunidade/meus-grupos`)
*   **Header:** "Meus Grupos", "Seus espaços para conversas e conexões.".
*   **Ação:** "Explorar novos grupos".
*   **Empty State:** "Você ainda não faz parte de nenhum grupo", "Que tal explorar os grupos existentes ou criar o seu próprio?", "Explorar Grupos", "Criar um Grupo".

### Explorar Grupos (`/comunidade/explorar-grupos`)
*   **Header:** "Explorar Grupos", "Encontre novas comunidades e conecte-se.".
*   **Ação:** "Voltar para Meus Grupos".
*   **Cards:** "Participar", "Participando", Contagem de membros (X membros), Tags.

### Criar Grupo (`/comunidade/criar-grupo`)
*   **Header:** "Criar Novo Grupo", "Preencha as informações abaixo para criar um novo espaço...".
*   **Form:** "Nome do Grupo", "Descrição", "Entendo e concordo com os regulamentos", "regras da comunidade".
*   **Placeholders:** "Ex: Dicas de Terapia Ocupacional...", "Descreva o objetivo do grupo...".
*   **Botão:** "Criar Grupo".
*   **Feedback:** "Grupo Criado com Sucesso!", "O grupo X está pronto. Convide outras pessoas!", Link de convite (URL), "Copiar", "Ir para Meus Grupos".

---

## 6. Suporte IA (`/suporte-ia`)

*   **Hero:** "Como podemos te ajudar hoje?", "A ponte entre você e seus direitos, benefícios e próximos passos.".
*   **Busca:** "Deixe sua dúvida aqui...", Sr-only "Buscar".
*   **Sugestões:** "Tópicos populares", "Como solicitar o BPC?", "Quais são os primeiros passos após o diagnóstico?", "Direitos na escola: o que eu preciso saber?".
*   **Interface de Chat:** Ícone Sparkles (IA), Resposta (Markdown), Skeleton (Loading).
*   **Cards de Apoio:** 
    *   "Conheça seus direitos" / "Navegue por guias práticos sobre legislação...".
    *   "Explore o Acervo" / "Encontre materiais, vídeos e documentos...".
    *   "Perguntas Frequentes" / "Respostas rápidas para as dúvidas mais comuns...".
    *   CTA: "Ver mais".

---

## 7. Profissionais

### Diretório (`/profissionais`)
*   **Hero:** "Encontre o Profissional Ideal", "Conectamos você a profissionais e clínicas avaliados...".
*   **Busca:** "Buscar por especialidade ou nome...".
*   **Compromisso:** "Nosso Compromisso com Você", "Qualidade e Confiança", "Verificação de Credenciais e Experiência", "Avaliações Reais da Comunidade".
*   **Especialidades:** "Explore por Especialidade", "Psicólogos", "Fonoaudiólogos", "Terapeutas Ocupacionais", "Neurologistas e Psiquiatras", "Psicopedagogos", "Acompanhantes Terapêuticos".
*   **CTA Especialidade:** "Não encontrou o que procurava? Veja mais!".
*   **Cards Profissionais:** "Profissionais Liberais", "Especialistas dedicados...", "Ver Perfil".
*   **Cards Clínicas:** "Clínicas Parceiras", "Espaços multidisciplinares...", "Ver Detalhes da Clínica".

### Perfil do Profissional (`/profissionais/[id]`)
*   **Navegação:** "Voltar", "Compartilhar" (SR-only).
*   **Identificação:** Nome, Especialidade, CRM/CRP/CRFa.
*   **Tabs:** "Sobre", "Contato", "Avaliações".
*   **Sobre:** "Apresentação", "Experiências" (Lista), "Áreas de atuação" (Badges).
*   **Contato:** "Informações de Contato", "Email", "Telefone", "Instagram".
*   **Avaliações:** 
    *   "Avaliações dos pacientes", "Média: X de 5", "X avaliações".
    *   Sumário: Atendimento, Empatia, Clareza, Organização.
    *   Ação: "Deixar minha avaliação".
*   **Modal Avaliar:** "Deixar uma avaliação para X", "Compartilhe sua experiência para ajudar...", "Sua avaliação" (Textarea), "Cancelar", "Enviar Avaliação".
*   **Footer Fixo:** "Agendar Consulta".

---

## 8. Informações e Suporte

### Fale Conosco (`/fale-conosco`)
*   **Header:** "Entre em Contato", "Tem alguma dúvida, sugestão ou precisa de suporte?".
*   **Info:** "Nossas Informações", "Email", "Telefone", "Para dúvidas e suporte geral", "Disponível em horário comercial".
*   **Form:** "Envie uma Mensagem", "Nome Completo", "Email", "Mensagem", "Enviar Mensagem", "Enviando...".
*   **Feedback Sucesso:** "Mensagem Enviada!", "Obrigado pelo seu contato. Você receberá uma confirmação no seu e-mail.".
*   **Erro:** "Campos obrigatórios", "Por favor, preencha todos os campos.", "Ocorreu um erro", "Não foi possível enviar sua mensagem.".

### FAQ (`/faq`)
*   **Header:** "Perguntas Frequentes (FAQ)", "Respostas rápidas para as dúvidas mais comuns da nossa comunidade.".
*   **Conteúdo (Accordion):** Questões sobre TEA, Sinais, BPC/LOAS, Professor de Apoio, PEI, Plataforma Elos.

### Legais (`/termos-de-servico` e `/politica-de-privacidade`)
*   **Header:** Título da página, "Última atualização: 1 de Agosto de 2024".
*   **Estrutura:** Títulos numerados (1. Uso, 2. Conteúdo, etc.).

---
*Este inventário reflete fielmente a base de código da versão atual (Setembro de 2025).*
