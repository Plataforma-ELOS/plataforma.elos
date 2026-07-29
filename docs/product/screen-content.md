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
*   **Sino de Notificações:** ícone com contador de não lidas (atualizado em tempo real), leva a `/notificacoes`. Visível só para usuário logado.
*   **Acessibilidade:** "Abrir menu" (Mobile).

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
*   **Formulário:** "Nome Completo", "Email", "Tipo de Cadastro" (Profissional Liberal, Profissional de Clínica, Clínica), "Adicionar foto (opcional)", "Especialidade" (Select com lista fixa + opção "Outro" que revela campo livre — para profissional/clínica de profissional; campo livre "Especialidade/Área de Atuação" para clínica), "CNPJ", "Número do Registro Profissional (exatamente 7 dígitos)", "Compartilhe um pouco de sua experiência".
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
*   **Seção 2 (Trilhas):** "Suas Trilhas de Conhecimento", "Trilha: Entendendo o Laudo de TEA", "Trilha: Primeiros Passos na Escola", barra de progresso real, "Continuar Trilha" (leva ao detalhe da trilha).
*   **Seção 3 (Quiz):** "Teste seus Conhecimentos", "Quiz da Semana!", "Acerte as perguntas sobre as notícias...","Começar Quiz" — ainda decorativo (sem pergunta/pontuação implementada).

### Detalhe da Trilha (`/noticias-gamificadas/trilhas/[id]`)
*   **Navegação:** "Voltar para Trilhas".
*   **Cabeçalho:** título e descrição da trilha, barra de progresso com percentual.
*   **Passos:** lista em accordion, numerada ("1. ", "2. "...), cada um com conteúdo real ao expandir e checkbox "Concluí esta etapa" — marcar/desmarcar atualiza o progresso na hora.
*   **Vazio:** "Esta trilha ainda não tem passos cadastrados." (quando a trilha não tem nenhum passo).

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
*   **PostCard:** "Curtir", "Comentar", "Compartilhar" (Web Share API com fallback de copiar link), "Editar Post" (modal com Textarea pré-preenchida, só para o autor), "Excluir Post".
*   **Contador:** "X comentários", "X curtidas".
*   **CommentSection:** "Escreva um comentário...", "Publicar", "Agora".
*   **Sidebar:**
    *   "Próximos Eventos" (dados reais da tabela `events`, só futuros, clicáveis → modal de detalhe), "Ver todos os eventos", "Ver menos eventos", "Criar Evento".
    *   "Meus Grupos", "Ver meus grupos", "Criar um Grupo".
*   **Modal Criar Evento:** "Criar Evento", "Divulgue um evento para a comunidade.", "Título", "Descrição", "Data e hora", "Tipo" (Online, Presencial), "Local" (só quando Presencial), "Cancelar", "Criar Evento".
*   **Modal Detalhe do Evento:** título do evento, badge do tipo, data/hora, local (se presencial), descrição completa, "Fechar".
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
*   **Modal de Boas-vindas (ao entrar num grupo):** "Bem-vindo(a) a 'X'!", texto sobre respeito e regras da comunidade (sem discurso de ódio, spam ou desinformação), "Continuar explorando", "Acessar Grupo".

### Detalhe do Grupo (`/comunidade/grupos/[id]`)
*   **Navegação:** "Voltar para Explorar Grupos".
*   **Header:** Nome do grupo, descrição, tags, "X membros".
*   **Ação:** "Participar" / "Participando" (entrar/sair).
*   **Membros:** "Membros", lista com avatar + nome, "Nenhum membro ainda. Seja o primeiro a entrar!".

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
*   **Busca:** "Buscar por nome..." (busca full-text server-side, com debounce; independente do filtro por especialidade).
*   **Compromisso:** "Nosso Compromisso com Você", "Qualidade e Confiança", "Verificação de Credenciais e Experiência", "Avaliações Reais da Comunidade".
*   **Especialidades:** "Explore por Especialidade", "Psicólogos", "Fonoaudiólogos", "Terapeutas Ocupacionais", "Neurologistas e Psiquiatras", "Psicopedagogos", "Acompanhantes Terapêuticos" — clicar filtra por igualdade exata (chip fica destacado) e rola até os resultados.
*   **Cards Profissionais:** "Profissionais Liberais", "Especialistas dedicados...", "Ver Perfil", selo "Verificado" (BadgeCheck) quando aprovado, "Ver mais profissionais" (carrega a próxima página, só aparece sem filtro/busca ativos).
*   **Cards Clínicas:** "Clínicas Parceiras", "Espaços multidisciplinares...", "Ver Detalhes da Clínica", selo "Verificado", "Explorar mais clínicas" (mesma lógica de paginação).

### Perfil do Profissional (`/profissionais/[id]`)
*   **Navegação:** "Voltar", ícone "Compartilhar" (Web Share API com fallback de copiar link).
*   **Identificação:** Nome, selo "Verificado" (quando aprovado), Especialidade, CRM/CRP/CRFa.
*   **Tabs:** "Sobre", "Contato", "Avaliações".
*   **Sobre:** "Apresentação", "Experiências" (Lista), "Áreas de atuação" (Badges).
*   **Contato:** "Informações de Contato", "Email", "Telefone", "Instagram".
*   **Avaliações:** 
    *   "Avaliações dos pacientes", "Média: X de 5", "X avaliações".
    *   Sumário: Atendimento, Empatia, Clareza, Organização.
    *   Ação: "Deixar minha avaliação".
*   **Modal Avaliar:** "Deixar uma avaliação para X", "Compartilhe sua experiência para ajudar...", "Sua avaliação" (Textarea), "Cancelar", "Enviar Avaliação".

---

## 8. Conta e Área Pessoal

### Perfil (`/perfil`)
*   **Header:** Avatar (fallback com inicial do nome), Nome, E-mail, Bio (ou "Você ainda não escreveu uma bio. Conte um pouco sobre você para a comunidade." quando vazia).
*   **Ação:** "Editar Perfil" (abre modal).
*   **Modal Editar:** "Editar Perfil", "Atualize seu nome e sua bio. Essas informações aparecem para outros membros da comunidade.", "Nome completo", "Bio", "Cancelar", "Salvar alterações" / "Salvando...".
*   **Atalhos:** "Itens Salvos", "Configurações", "Meus Grupos", "Meu Espaço".

### Itens Salvos (`/salvos`)
*   **Header:** "Itens Salvos", "Posts e materiais do acervo que você guardou para ver depois.".
*   **Controles:** Busca ("Buscar nos itens salvos..."), Abas "Tudo" / "Posts" / "Acervo".
*   **Empty State:** "Você ainda não salvou nada. Favorite posts na Comunidade ou materiais no Acervo Digital." / "Nenhum item encontrado para essa busca.".
*   **Itens:** Posts salvos (autor, data, trecho, "Ver na Comunidade") e materiais do acervo (reaproveita o card do Acervo Digital, com botão de remover dos favoritos).

### Configurações (`/configuracoes`)
*   **Header:** "Configurações".
*   **Aparência:** "Tema" (Claro, Escuro), "Tamanho do texto" (Pequeno, Normal, Grande) — mesmas preferências do dropdown do header, agora também aqui.
*   **Notificações:** "Receber por e-mail", "Notificações no navegador" (toggles).
*   **Privacidade:** "Perfil visível para a comunidade" (toggle).

### Notificações (`/notificacoes`)
*   **Header:** "Notificações", "X não lida(s)" quando há pendentes.
*   **Ações:** "Marcar todas como lidas", "Limpar" (visíveis só quando há notificações).
*   **Itens:** ícone de curtida (coração) ou comentário, mensagem ("Fulano curtiu seu post: '...'." / "Fulano comentou no seu post: '...'."), data/hora. Clicar numa notificação não lida marca como lida.
*   **Empty State:** "Você ainda não tem notificações. Curtidas e comentários nos seus posts aparecem aqui.".
*   **Tempo real:** novas notificações aparecem na lista e no contador do sino sem precisar recarregar a página (Supabase Realtime).

### Meu Espaço (`/meu-espaco`)
*   **Header:** "Meu Espaço", "Cuidar de alguém começa por cuidar de si.".
*   **Abas:** "Dependentes", "Diário".
*   **Dependentes:** "Adicionar Dependente", cards com nome/parentesco/idade/notas, editar e excluir (com confirmação). Modal: "Nome", "Ano de nascimento (opcional)", "Parentesco (opcional)", "Anotações (opcional)". Empty state: "Você ainda não cadastrou nenhum dependente.".
*   **Diário:** "Nova Entrada", lista cronológica (data + badge de humor + texto), editar e excluir (com confirmação). Modal: "Data", "Como você está?" (humor: Tranquilo(a), Feliz, Cansado(a), Sobrecarregado(a), Preocupado(a)), "O que aconteceu?". Empty state: "Seu diário está vazio. Registre como você está se sentindo hoje.".

---

## 9. Administração

### Painel Administrativo (`/admin`)
*   **Acesso:** só usuários com `role = 'admin'`; sem link em nenhum menu, só por URL direta. Quem não é admin é redirecionado silenciosamente para `/home`.
*   **Header:** "Painel Administrativo", "Verificações e itens do acervo pendentes de aprovação.".
*   **Abas:** "Verificações", "Acervo".
*   **Verificações:** lista profissionais e clínicas com verificação pendente (nome, especialidade, badge do tipo), botões "Aprovar"/"Rejeitar". Empty state: "Nenhuma verificação pendente no momento.".
*   **Acervo:** lista itens sugeridos ainda não aprovados (título, tipo, autor, link de preview), botões "Aprovar"/"Rejeitar". Empty state: "Nenhum item sugerido pendente no momento.".

---

## 10. Informações e Suporte

### Fale Conosco (`/fale-conosco`)
*   **Header:** "Entre em Contato", "Tem alguma dúvida, sugestão ou precisa de suporte?".
*   **Info:** "Nossas Informações", "Email", "Telefone", "Para dúvidas e suporte geral", "Disponível em horário comercial".
*   **Form:** "Envie uma Mensagem", "Nome Completo", "Email", "Mensagem", "Enviar Mensagem", "Enviando...".
*   **Feedback Sucesso:** "Mensagem Enviada!", "Obrigado pelo seu contato. Você receberá uma confirmação no seu e-mail.".
*   **Erro:** "Campos obrigatórios", "Por favor, preencha todos os campos.", "Ocorreu um erro", "Não foi possível enviar sua mensagem.".

### Central de Ajuda (`/faq`)
*   **Header:** "Central de Ajuda", "Respostas rápidas para as dúvidas mais comuns da nossa comunidade.".
*   **Busca:** "Busque por uma palavra-chave...", filtra as perguntas em tempo real; "Nenhuma pergunta encontrada para essa busca." quando a busca não retorna nada.
*   **Conteúdo (Accordion):** Questões sobre TEA, Sinais, BPC/LOAS, Professor de Apoio, PEI, Plataforma Elos.
*   **CTA final:** "Não encontrou o que procurava?", "Fale direto com a nossa equipe de suporte.", "Fale com a gente" (leva a `/fale-conosco`).

### Legais (`/termos-de-servico` e `/politica-de-privacidade`)
*   **Header:** Título da página, "Última atualização: 1 de Agosto de 2024".
*   **Estrutura:** Títulos numerados (1. Uso, 2. Conteúdo, etc.).

---
*Este inventário reflete fielmente a base de código da versão atual (atualizado em 2026-07-27, após a Sprint 5: eventos reais, detalhe de grupo, notificações, perfil/salvos/configurações).*
