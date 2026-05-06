# Inventário de Conteúdo Textual Completo - Plataforma E.L.O.S.

Este documento cataloga cada fragmento de texto visível na plataforma, servindo como a "Fonte da Verdade" para UX Writing, traduções e acessibilidade.

---

## 🏗️ Elementos Globais (Presentes em todas as telas)

### Header (Cabeçalho)
*   **Logo:** "Plataforma E.L.O.S"
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
    *   "Recursos feitos para você" / "Ferramentas e espaços pensados para fortalecer sua jornada de cuidado."
    *   "Conecte-se na Comunidade" / "Um espaço seguro para compartilhar vitórias, desafios e encontrar apoio mútuo."
    *   "Tire suas dúvidas com a IA" / "Receba orientações claras sobre direitos, laudos e o BPC de forma instantânea."
    *   "Explore o Acervo Digital" / "Acesse nossa biblioteca com palestras, artigos e materiais selecionados por especialistas."
*   **Comunidade (Diferenciais):**
    *   Título: "O seu lugar ideal"
    *   Pontos: "Conexões que Acolhem", "Informação Confiável", "Ferramentas que Capacitam".
    *   Botão: "Veja o que dizem sobre nós"
    *   Modal Depoimentos: "Depoimentos da nossa comunidade", Ratings de 5 estrelas.
*   **Notícias:**
    *   Título: "Últimas notícias"
    *   Cards: Badges de Categoria (Legislação, Saúde, etc.), Título curto, Ícone de seta.
*   **Profissionais:**
    *   Título: "Profissionais de Confiança"
    *   Slogan: "Onde o cuidado é valorizado e mantido."
    *   Botão: "Ver Perfil"

## 2. Autenticação

### Login (`/login`)
*   **Títulos:** "Bem-vindo(a) de volta!", "Entre com sua conta para continuar."
*   **Formulário:** "Email", "Senha", "Lembrar de mim".
*   **Placeholders:** "seu@email.com", "••••••••".
*   **Botão:** "Entrar".
*   **Rodapé:** "Não tem uma conta? Crie uma agora".
*   **Modais de Feedback:**
    *   *Sucesso:* "Login Realizado com Sucesso!", "Seja bem-vindo(a) de volta!...", "Continuar".
    *   *Erro:* "Dados inválidos", "Os dados inseridos não foram encontrados...", "Tentar Novamente", "Criar Conta".

### Cadastro de Usuário (`/cadastro`)
*   **Títulos:** "Crie sua conta", "É rápido, simples e abre as portas para um mundo de apoio."
*   **Formulário:** "Nome", "Email", "Senha", "Lembrar de mim".
*   **Social:** "Ou continue com", "Google", "Apple".
*   **Rodapé:** "Já tem uma conta? Faça Login", "É um profissional ou clínica? Cadastre-se aqui".

### Cadastro Profissional (`/cadastro-profissional`)
*   **Navegação:** "Voltar".
*   **Títulos:** "Cadastro Profissional", "Submeta sua inscrição para participar do time de perfis profissionais...".
*   **Formulário:** "Nome Completo", "Email", "Tipo de Cadastro" (Profissional Liberal, Profissional de Clínica, Clínica), "CNPJ", "Número do Registro Profissional", "Compartilhe um pouco de sua experiência".
*   **Contador:** "0/200 palavras".
*   **Botão:** "Enviar Inscrição".
*   **Feedback:** "Inscrição Realizada com Sucesso!", "Você receberá uma resposta em seu e-mail em um período de até 2 semanas.", "Ok, entendi!".

## 3. Conteúdo e Notícias

### Portal de Notícias (`/noticias`)
*   **Header:** "Notícias e Artigos", "Mantenha-se atualizado com as últimas novidades...".
*   **Destaque:** "Ler artigo completo".
*   **Seção:** "Últimas Notícias".
*   **NewsCard:** Badges, Datas, Títulos, "Ver mais".

### Leitura de Notícia (`/noticias/[slug]`)
*   **Navegação:** "Voltar para todas as notícias".
*   **Meta:** Categoria, Autor, Data.

### Feed com IA (`/noticias-ai`)
*   **Header:** "Feed de Notícias Inteligente", "Seu feed personalizado...".
*   **Card IA:** "Resumo do Dia com IA", Conteúdo gerado dinamicamente.
*   **Filtros:** "Filtrar por tags".
*   **Botão:** "Ler e Interagir com IA".

### Notícia com Chat IA (`/noticias-ai/[slug]`)
*   **Card Chat:** "Pergunte à IA sobre esta notícia".
*   **Input:** "Ex: 'Quais os principais pontos da lei?'".
*   **Botão:** "Perguntar".

### Notícias Gamificadas (`/noticias-gamificadas`)
*   **Header:** "Pílulas de Conhecimento", "Aprenda de forma rápida e divertida...".
*   **Pílulas:** "Você sabia?", "Dica Rápida", "Fato Importante", "Saber mais".
*   **Trilhas:** "Suas Trilhas de Conhecimento", Porcentagem de progresso, "Continuar Trilha".
*   **Quiz:** "Teste seus Conhecimentos", "Quiz da Semana!", "Começar Quiz".

## 4. Acervo Digital (`/acervo-digital`)
*   **Header:** "Acervo Digital", "A plataforma definitiva para encontrar...".
*   **Ação:** "Adicionar ao Acervo".
*   **Controles:** "Buscar por título, tag, etc...", "Ordenar: Mais Recentes/Mais Antigos", "Filtrar: Todos/Vídeos/Documentos", Tooltip "Favoritar".
*   **Cards:** "Vídeo", "Documento", "Assistir Agora", "Fazer Download".
*   **Modal Adicionar:** "Adicionar ao Acervo", "Título", "Autor", "Tipo", "Tags" (Separe por vírgulas), "Link", "Cancelar", "Enviar para análise".
*   **Empty State:** "Nenhum resultado encontrado", "Tente buscar por outras palavras-chave...".

## 5. Comunidade

### Feed Principal (`/comunidade`)
*   **Título:** "Posts em Destaque", "As conversas mais populares...".
*   **PostCard:** "Curtir", "Comentar", "Compartilhar", "Editar Post", "Excluir Post".
*   **Contador:** "X comentários", "X curtidas".
*   **Sidebar:**
    *   "Próximos Eventos", "Ver todos os eventos", "Ver menos eventos".
    *   "Meus Grupos", "Ver meus grupos", "Criar um Grupo".
*   **Acesso Restrito:** "Para acessar esta funcionalidade e interagir... você precisa fazer login", "Agora não", "Fazer Login".

### Meus Grupos (`/comunidade/meus-grupos`)
*   **Header:** "Meus Grupos", "Seus espaços para conversas e conexões.".
*   **Ação:** "Explorar novos grupos".
*   **Empty State:** "Você ainda não faz parte de nenhum grupo", "Explorar Grupos", "Criar um Grupo".

### Explorar Grupos (`/comunidade/explorar-grupos`)
*   **Header:** "Explorar Grupos", "Encontre novas comunidades...".
*   **Cards:** "Participar", "Participando", Contagem de membros, Tags.

### Criar Grupo (`/comunidade/criar-grupo`)
*   **Header:** "Criar Novo Grupo".
*   **Form:** "Nome do Grupo", "Descrição", "Entendo e concordo com os regulamentos", "regras da comunidade".
*   **Botão:** "Criar Grupo".
*   **Feedback:** "Grupo Criado com Sucesso!", Link de convite, "Copiar", "Ir para Meus Grupos".

## 6. Suporte IA (`/suporte-ia`)
*   **Hero:** "Como podemos te ajudar hoje?", "A ponte entre você e seus direitos...".
*   **Busca:** "Deixe sua dúvida aqui...", Sr-only "Buscar".
*   **Sugestões:** "Tópicos populares", "Conheça seus direitos", "Explore o Acervo", "Perguntas Frequentes", "Ver mais".

## 7. Profissionais

### Diretório (`/profissionais`)
*   **Hero:** "Encontre o Profissional Ideal", "Conectamos você a profissionais...".
*   **Busca:** "Buscar por especialidade ou nome...".
*   **Compromisso:** "Nosso Compromisso com Você", "Verificação de Credenciais", "Avaliações Reais".
*   **Especialidades:** "Explore por Especialidade", "Psicólogos", "Fonoaudiólogos", etc. "Não encontrou o que procurava? Veja mais!".
*   **Cards:** "Profissionais Liberais", "Clínicas Parceiras", "Ver Perfil", "Ver Detalhes da Clínica".

### Perfil do Profissional (`/profissionais/[id]`)
*   **Ações:** "Voltar", "Compartilhar", "Agendar Consulta".
*   **Tabs:** "Sobre", "Contato", "Avaliações".
*   **Sobre:** "Apresentação", "Experiências", "Áreas de atuação".
*   **Contato:** "Informações de Contato", "Email", "Telefone", "Instagram".
*   **Avaliações:** "Avaliações dos pacientes", "Média: X de 5", "Atendimento", "Empatia", "Clareza", "Organização", "Deixar minha avaliação".
*   **Modal Avaliar:** "Deixar uma avaliação para X", "Compartilhe sua experiência...", "Sua avaliação" (Textarea), "Cancelar", "Enviar Avaliação".

## 8. Informações e Suporte

### Fale Conosco (`/fale-conosco`)
*   **Header:** "Entre em Contato", "Tem alguma dúvida, sugestão...".
*   **Info:** "Nossas Informações", "Email", "Telefone".
*   **Form:** "Envie uma Mensagem", "Nome Completo", "Email", "Mensagem", "Enviar Mensagem", "Enviando...".
*   **Feedback:** "Mensagem Enviada!", "Obrigado pelo seu contato. Você receberá uma confirmação...".

### FAQ (`/faq`)
*   **Header:** "Perguntas Frequentes (FAQ)", "Respostas rápidas para as dúvidas mais comuns...".
*   **Conteúdo:** Accordion com perguntas e respostas sobre TEA, BPC, PEI, Escola e Plataforma.

### Legais (`/termos-de-servico` e `/politica-de-privacidade`)
*   **Header:** Título da página, "Última atualização: [Data]".
*   **Estrutura:** Seções numeradas (1. Uso, 2. Conteúdo, etc.).

---
*Este documento reflete a versão de Setembro de 2025.*
