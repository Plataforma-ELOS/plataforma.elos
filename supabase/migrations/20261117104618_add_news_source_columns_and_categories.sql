-- Notícias de pesquisa: créditos da fonte original e 3 categorias novas.
-- Tudo aditivo: colunas nullable, valores novos no enum. As notícias
-- existentes continuam iguais (as colunas novas ficam NULL e a página só
-- mostra o bloco "Créditos e fonte original" quando há source_citation).
alter table public.news_articles
  add column if not exists source_url text,
  add column if not exists source_citation text,
  add column if not exists source_note text;

-- Só aceita link https para a fonte (o link vira <a href> na página).
alter table public.news_articles
  add constraint news_articles_source_url_https
  check (source_url is null or source_url ~ '^https://');

-- ADD VALUE não pode ser usado na mesma transação em que é criado; os
-- INSERTs que usam esses valores ficam na migration seguinte.
alter type public.news_category add value if not exists 'dados';
alter type public.news_category add value if not exists 'educacao';
alter type public.news_category add value if not exists 'desenvolvimento';
