-- elos_0003_seed_conteudo_publico
-- Reconstruído a partir dos dados reais atuais (ver README.md desta pasta).
-- Idempotente: ON CONFLICT DO NOTHING nas chaves naturais conhecidas.

insert into public.news_articles (slug, title, description, category, author_name, published_at)
values
  ('nova-lei-amplia-direitos-no-trabalho', 'Nova Lei Amplia Direitos para Cuidadores no Ambiente de Trabalho', 'Entenda as principais mudanças na legislação que garantem mais flexibilidade e apoio para pais e responsáveis por pessoas com TEA.', 'legislacao', 'Redação E.L.O.S', now()),
  ('tecnologia-assistiva-para-comunicacao', 'Tecnologia Assistiva para Comunicação', 'Ferramentas de comunicação alternativa e aumentativa (CAA) que apoiam o dia a dia.', 'tecnologia', 'Redação E.L.O.S', now()),
  ('importancia-diagnostico-precoce', 'A Importância do Diagnóstico Precoce', 'Por que identificar os sinais cedo muda o percurso de desenvolvimento.', 'saude', 'Redação E.L.O.S', now()),
  ('evento-comunitario-promove-inclusao', 'Evento Comunitário Promove Inclusão', 'Encontros presenciais fortalecem a rede de apoio entre famílias.', 'comunidade', 'Redação E.L.O.S', now())
on conflict (slug) do nothing;

insert into public.library_items (type, title, author_name, downloadable, tags, approved)
values
  ('video', 'Entendendo o Comportamento no TEA', 'Dr. Ana Silva', true, array['Comportamento','TEA','Palestra'], true),
  ('document', 'Guia de Atividades Sensoriais', 'Carlos Mendes', true, array['Atividades','Sensorial','PDF'], true),
  ('document', 'Modelo de Plano de Ensino Individualizado (PEI)', 'Mariana Costa', true, array['Escola','PEI','PDF'], true)
on conflict do nothing;

insert into public.knowledge_pills (title, content, category)
values
  ('Você sabia?', 'O BPC garante 1 salário mínimo a quem tem direito e cumpre os critérios do CadÚnico.', 'Direitos'),
  ('Dica Rápida', 'Fones com cancelamento de ruído ajudam muito em ambientes de sobrecarga sensorial.', 'Bem-estar'),
  ('Fato Importante', 'O diagnóstico precoce, idealmente antes dos 3 anos, amplia os ganhos da intervenção.', 'Saúde')
on conflict do nothing;

insert into public.knowledge_trails (title, description)
values
  ('Trilha: Entendendo o Laudo de TEA', 'Do diagnóstico aos direitos que ele habilita.'),
  ('Trilha: Primeiros Passos na Escola', 'Inclusão escolar e o Plano de Ensino Individualizado (PEI).')
on conflict do nothing;
