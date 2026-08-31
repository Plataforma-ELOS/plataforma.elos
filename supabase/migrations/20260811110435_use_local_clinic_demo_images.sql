-- Substitui os placeholders de placehold.co pelas 2 fotos locais reais já
-- disponíveis em public/perfis/clinicas/ (trazidas do repositório de
-- referência LeticiaASG/ELOS-TESTANDO) nas 2 linhas demo de clinics.
update public.clinics set image_url = '/perfis/clinicas/instituicao-1.jpg'
where id = 'be3a20dd-134e-4415-851d-29116ec2a187';
update public.clinics set image_url = '/perfis/clinicas/instituicao-2.jpg'
where id = '3f238562-1029-4893-b930-32d452eee1df';
