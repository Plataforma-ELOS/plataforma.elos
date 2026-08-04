# Checklist de QA ponta a ponta — Plataforma E.L.O.S

> Fecha formalmente o item `0.5` do `roadmap.md` ("validar fluxos ponta-a-ponta
> na Preview da Vercel"). Cobre todo fluxo autenticado/dependente de dado real
> — nenhum deles pode ser validado automaticamente a partir do ambiente de
> desenvolvimento desta sessão (sandbox sem rede para `supabase.co`, ver
> `e2e/public-pages.spec.ts` e `e2e/mobile-nav.spec.ts` para o que já é
> coberto por automação). Rode este checklist manualmente contra a Preview
> deployment de um PR ou contra produção, logado com uma conta de teste real.
>
> Marque cada item ao validar. Se algo falhar, anote o passo exato e o
> comportamento observado para facilitar o diagnóstico.

## 1. Autenticação

- [ ] Cadastro por e-mail/senha cria a conta e redireciona para `/login`.
- [ ] Login por e-mail/senha entra e redireciona para `/home`.
- [ ] Login com Google (`/login` e `/cadastro`, botão "Continuar com Google") completa o fluxo OAuth e retorna logado — só testável depois que as credenciais forem coladas no painel Supabase (ficha `G6`).
- [ ] Logout limpa a sessão e os itens do header voltam ao estado deslogado.
- [ ] Sessão sobrevive a um `refresh` da página (não desloga sozinho).
- [ ] Acessar uma rota privada deslogado (ex. `/comunidade/criar-grupo`) redireciona para `/login?redirect=...` e volta para a rota certa após logar.
- [ ] Acessar `/login` já logado redireciona para `/home`.

## 2. Comunidade

- [ ] Criar post (só texto) aparece no feed.
- [ ] Criar post com imagem — upload funciona, imagem aparece no card.
- [ ] Curtir/descurtir um post atualiza o contador.
- [ ] Comentar num post aparece na lista de comentários.
- [ ] Editar o próprio post reflete a mudança.
- [ ] Excluir o próprio post remove do feed.
- [ ] Salvar/dessalvar post aparece/some em `/salvos`.
- [ ] Compartilhar post (Web Share API ou copiar link) funciona.
- [ ] Criar evento aparece na sidebar "Próximos eventos".
- [ ] Clicar num evento abre o detalhe; "Adicionar ao calendário" baixa um `.ics` válido.
- [ ] Criar grupo aparece em `/comunidade/meus-grupos`.
- [ ] Entrar num grupo em `/comunidade/explorar-grupos` mostra o modal de boas-vindas e leva à página do grupo.
- [ ] Sair de um grupo remove da lista de "Meus Grupos".
- [ ] Página de detalhe do grupo (`/comunidade/grupos/[id]`) lista membros corretamente.

## 3. Acervo Digital

- [ ] Busca por texto retorna resultados relevantes (full-text).
- [ ] Filtro por tipo de material funciona.
- [ ] Favoritar/desfavoritar item persiste e aparece em `/salvos`.
- [ ] Sugerir item novo (com imagem) — aparece pendente em `/admin`, não aparece em `/acervo-digital` antes de aprovado.
- [ ] Item com `downloadable=true` baixa o arquivo em vez de abrir nova aba.

## 4. Profissionais e Clínicas

- [ ] Busca por nome retorna resultados corretos.
- [ ] Clicar num chip de especialidade filtra exato (não substring).
- [ ] "Ver mais profissionais"/"Explorar mais clínicas" carrega a próxima página.
- [ ] Selo "Verificado" aparece só para profissionais com `verification_status = 'verified'`.
- [ ] Enviar avaliação (nota + comentário) aparece no perfil do profissional.
- [ ] Cadastro profissional (`/cadastro-profissional`): formulário completo (incluindo upload de foto) envia com sucesso e aparece pendente em `/admin`.

## 5. Trilhas de Conhecimento

- [ ] Abrir uma trilha (`/noticias-gamificadas/trilhas/[id]`) lista os passos.
- [ ] Marcar um passo como concluído atualiza a barra de progresso.
- [ ] Progresso reflete de volta na listagem (`/noticias-gamificadas`).
- [ ] Tags de `/noticias-ai` filtram os artigos (filtro implementado nesta rodada) e alternam ao clicar de novo na mesma tag.

## 6. Meu Espaço (Área do Cuidador)

- [ ] Criar/editar/excluir um dependente funciona.
- [ ] Criar/editar/excluir uma entrada de diário funciona.
- [ ] Deslogado, `/meu-espaco` redireciona para `/login`.

## 7. Perfil e Configurações

- [ ] Editar nome/bio em `/perfil` persiste.
- [ ] Upload de avatar em `/perfil` funciona e reflete no header.
- [ ] `/configuracoes`: alternar tema (claro/escuro), tamanho de fonte e preferências de notificação persistem.

## 8. Notificações

- [ ] Curtir/comentar no post de outro usuário gera notificação em tempo real (sino do header incrementa sem reload).
- [ ] Marcar notificação como lida funciona.
- [ ] "Marcar todas como lidas" zera o contador.

## 9. Painel Administrativo (`/admin`, conta com `role='admin'`)

- [ ] Usuário não-admin é redirecionado ao acessar `/admin`.
- [ ] Aprovar/rejeitar profissional ou clínica pendente funciona.
- [ ] Aprovar/rejeitar item do acervo pendente funciona.

## 10. Fale Conosco e Suporte IA

- [ ] Enviar mensagem em `/fale-conosco` grava no banco e dispara e-mail (EmailJS) — requer `GEMINI_API_KEY`/chaves EmailJS configuradas (`G3`).
- [ ] Enviar 4 mensagens seguidas rapidamente dispara o rate limit (mensagem amigável, não erro genérico).
- [ ] `/suporte-ia`: pergunta retorna resposta em streaming, sem travar a tela.
- [ ] Clicar num tópico sugerido preenche a pergunta e rola até a resposta.

## 11. Notícias

- [ ] Abrir um artigo de `/noticias` renderiza o conteúdo completo.
- [ ] `/noticias-ai`: resumo do dia com IA carrega; chat sobre a notícia responde.

## 12. Regressão mobile (PR #51 — corrigido nesta sessão)

- [ ] **Menu hambúrguer fecha ao clicar num item de navegação** (testar em viewport estreito, `header.tsx` e `header-secondary.tsx`).
- [ ] **Login e Cadastro não permitem duplo clique** — botão desabilita visivelmente durante o envio.
- [ ] Simular erro de rede (DevTools → Offline) num dos 7 formulários corrigidos (perfil, meu-espaço, avaliação, acervo, criar post, cadastro profissional, criar grupo) e confirmar que o botão **volta a ficar habilitado** em vez de travar.
- [ ] Testar em um iPhone real (Safari) se disponível: telas de formulário (login, cadastro, criar-grupo, fale-conosco) não cortam conteúdo ao rolar com a barra de endereço recolhendo (`min-h-dvh`).
- [ ] "Começar Quiz" em `/noticias-gamificadas` aparece visivelmente desabilitado (não finge estar ativo).

---

## Fora deste checklist (registrado, não implementado)

E2E automatizado autenticado no CI exigiria: (1) uma conta de teste
dedicada no Supabase, (2) `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` como GitHub
Secret, (3) um novo projeto/spec no `playwright.config.ts` que loga de
verdade contra a Preview. Não implementado nesta rodada — decisão e conta
de teste dependem do usuário (mesma natureza externa dos itens `G1-G6`).
