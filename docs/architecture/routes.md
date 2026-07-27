# Mapa de Rotas - Plataforma E.L.O.S

Este documento lista todas as rotas e páginas disponíveis na aplicação, organizadas por categoria.

## 🏠 Principal
- `/` : Redirecionamento automático para a Home.
- `/home` : Página inicial com visão geral de todas as seções (Hero, IA, Acervo, Comunidade, Notícias e Profissionais).

## 🔐 Autenticação
- `/login` : Tela de acesso para usuários cadastrados.
- `/cadastro` : Cadastro de novos cuidadores/familiares.
- `/cadastro-profissional` : Inscrição para especialistas e clínicas que desejam figurar no diretório.

## 🤖 Inteligência Artificial (IA)
- `/suporte-ia` : Portal do assistente jurídico e social (Gemini). Possibilita tirar dúvidas sobre BPC/LOAS e direitos.
- `/noticias-ai` : Feed de notícias resumido por IA.
- `/noticias-ai/[slug]` : Leitura de notícia com assistente contextual para perguntas sobre o conteúdo.

## 👥 Comunidade
- `/comunidade` : Feed principal com posts e discussões em destaque, além de eventos reais (tabela `events`) na sidebar, com criação de evento para usuários logados.
- `/comunidade/meus-grupos` : Gerenciamento dos grupos onde o usuário participa.
- `/comunidade/explorar-grupos` : Galeria para descobrir novos espaços de troca; entrar num grupo abre um modal de boas-vindas.
- `/comunidade/criar-grupo` : Ferramenta para criação de novos nichos de conversa.
- `/comunidade/grupos/[id]` : Página de detalhe do grupo (nome, descrição, tags, lista de membros) com botão Participar/Sair.

## 📚 Conteúdo e Acervo
- `/acervo-digital` : Repositório de vídeos, documentos e guias (com filtros e busca).
- `/noticias` : Portal de notícias tradicional da comunidade TEA.
- `/noticias/[slug]` : Artigo completo com formatação rica.
- `/noticias-gamificadas` : Pílulas de conhecimento, trilhas de aprendizado e quizzes.

## 🩺 Saúde e Rede de Apoio
- `/profissionais` : Diretório verificado de especialistas e clínicas parceiras.
- `/profissionais/[id]` : Perfil detalhado com experiências, competências, contato e avaliações.

## 👤 Conta e Área Pessoal
- `/perfil` : Visualização e edição do nome/bio do usuário logado, com atalhos para Salvos, Configurações e Meus Grupos.
- `/salvos` : Itens salvos do usuário — unifica posts salvos da Comunidade e materiais favoritados do Acervo Digital numa lista só, com busca/filtro.
- `/configuracoes` : Tema, tamanho do texto, preferências de notificação (e-mail/push) e privacidade do perfil.
- `/notificacoes` : Central de notificações (curtidas e comentários em posts próprios), com contagem de não lidas em tempo real no sino do header.

## ℹ️ Informações e Suporte
- `/fale-conosco` : Canal direto com a equipe via e-mail.
- `/faq` : Central de Ajuda — perguntas frequentes sobre TEA e sobre a plataforma, com busca por palavra-chave e CTA para o Fale Conosco.
- `/termos-de-servico` : Regras de uso e conduta da plataforma.
- `/politica-de-privacidade` : Informações sobre proteção de dados e privacidade.
