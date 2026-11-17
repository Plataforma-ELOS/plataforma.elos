-- Fotos para os 3 conteúdos e as 3 notícias de pesquisa que estavam com a
-- ilustração-padrão. Os arquivos já estão em public/ desde o deploy anterior
-- (aplicada só depois de conferir que cada arquivo responde em produção,
-- para o banco nunca apontar para uma imagem que ainda não existe).
update public.feed_contents
   set image_url = '/comunidade/conteudos/profissional-comunicacao-alternativa.jpg',
       image_alt = 'Criança tocando figuras num tablet de comunicação alternativa, com uma adulta ao lado apontando as opções.'
 where slug = 'nem-toda-comunicacao-acontece-pela-fala';
update public.feed_contents
   set image_url = '/comunidade/conteudos/clinica-rotina-visual.jpg',
       image_alt = 'Quadro de rotina visual "primeiro, depois, então" com cartões de vestir-se, café da manhã e brincar ao ar livre, cercado de outros cartões de atividades.'
 where slug = 'rotina-visual-pequenas-mudancas';
update public.feed_contents
   set image_url = '/comunidade/conteudos/cuidador-preparar-passeio.jpg',
       image_alt = 'Mãe e filho de mochila diante de um quadro com figuras das atividades do dia; o menino aponta para uma delas.'
 where slug = 'passeios-mais-tranquilos';

update public.news_articles
   set image_url = '/noticias/pesquisas/diagnostico-familias.jpg', image_hint = 'mãe e filho em consulta'
 where slug = 'desafios-das-familias-no-diagnostico-do-autismo';
update public.news_articles
   set image_url = '/noticias/pesquisas/universitarios-autistas.jpg', image_hint = 'estudante em biblioteca'
 where slug = 'universitarios-autistas-dificuldades-ufpe';
update public.news_articles
   set image_url = '/noticias/pesquisas/treinamento-de-pais.jpg', image_hint = 'mãe brincando com criança'
 where slug = 'treinamento-de-pais-desenvolvimento-criancas-autistas';
