-- Liga as fotos que já estão versionadas em public/ às linhas do banco.
-- Mesmo padrão de use_local_clinic_demo_images (que fez isso para as 2
-- clínicas): os arquivos já existiam no repositório e a home já os exibia
-- via arrays hardcoded, mas as telas que leem do banco caíam no placeholder.

-- 1) Notícias: as 4 linhas tinham image_url NULL, caindo no fallback
-- placehold.co do mapper. O casamento slug -> arquivo é o mesmo que
-- src/components/features/news/news-carousel.tsx já usa na home.
update public.news_articles set image_url = '/noticias/noticia-1.jpg'
  where slug = 'nova-lei-amplia-direitos-no-trabalho';
update public.news_articles set image_url = '/noticias/noticia-2.jpg'
  where slug = 'tecnologia-assistiva-para-comunicacao';
update public.news_articles set image_url = '/noticias/noticia-3.jpg'
  where slug = 'importancia-diagnostico-precoce';
update public.news_articles set image_url = '/noticias/noticia-4.jpg'
  where slug = 'evento-comunitario-promove-inclusao';

-- 2) Profissionais demo: image_url apontava para placehold.co com as
-- iniciais. As 5 fotos em public/perfis/liberais/ correspondem 1:1 às 5
-- especialidades, e display_name passa a usar os mesmos nomes que a home
-- já mostra em new-professionals.tsx — sem isso a foto da "Dra. Beatriz"
-- apareceria num card chamado "Carlos Eduardo Lima". Só o nome muda;
-- registration_number (DEMO-xxx), especialidade, descrição e skills ficam.
update public.professionals
   set display_name = 'Dra. Cristiane (demo)', image_url = '/perfis/liberais/profissional-1.jpg'
 where specialty = 'Psicólogo(a)' and registration_number like 'DEMO-%';
update public.professionals
   set display_name = 'Dr. Fernando (demo)', image_url = '/perfis/liberais/profissional-2.jpg'
 where specialty = 'Neurologista ou Psiquiatra' and registration_number like 'DEMO-%';
update public.professionals
   set display_name = 'Dra. Beatriz (demo)', image_url = '/perfis/liberais/profissional-3.jpg'
 where specialty = 'Fonoaudiólogo(a)' and registration_number like 'DEMO-%';
update public.professionals
   set display_name = 'Dr. Ricardo (demo)', image_url = '/perfis/liberais/profissional-4.jpg'
 where specialty = 'Terapeuta Ocupacional' and registration_number like 'DEMO-%';
update public.professionals
   set display_name = 'Dra. Ana (demo)', image_url = '/perfis/liberais/profissional-5.jpg'
 where specialty = 'Psicopedagogo(a)' and registration_number like 'DEMO-%';
