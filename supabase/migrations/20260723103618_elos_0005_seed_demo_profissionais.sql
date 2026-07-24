-- elos_0005_seed_demo_profissionais
-- Reconstruído a partir dos dados reais atuais (ver README.md desta pasta).
-- Usa os ids reais já em produção (com id explícito + ON CONFLICT DO
-- NOTHING) para que qualquer FK existente (ex.: reviews) continue válida.
-- registration_number no formato DEMO-xxx de propósito, para não colidir
-- com registro profissional real.

insert into public.professionals (id, kind, display_name, specialty, registration_number, description, phone, email, image_url, verification_status)
values
  ('1a1990be-fcf0-4edd-a2c6-be08be2320a5', 'liberal', 'Ana Beatriz Moura (demo)', 'Psicóloga', 'DEMO-101', 'Psicóloga de exemplo. Atendimento a cuidadores e famílias, com foco em manejo do estresse e rotina.', '(81) 0000-0101', 'ana.demo@elos.app', 'https://placehold.co/400x400/a78bfa/ffffff?text=AM', 'pending'),
  ('ee12dbdd-a7bc-48db-bfbe-bb4f9bf60009', 'liberal', 'Carlos Eduardo Lima (demo)', 'Fonoaudiólogo', 'DEMO-102', 'Fonoaudiólogo de exemplo. Comunicação alternativa e aumentativa (CAA) e linguagem funcional.', '(81) 0000-0102', 'carlos.demo@elos.app', 'https://placehold.co/400x400/60a5fa/ffffff?text=CL', 'pending'),
  ('48315151-0d3e-4d14-855a-aa3bf412f0f3', 'liberal', 'Juliana Prado (demo)', 'Terapeuta Ocupacional', 'DEMO-103', 'T.O. de exemplo. Integração sensorial e autonomia nas atividades de vida diária.', '(81) 0000-0103', 'juliana.demo@elos.app', 'https://placehold.co/400x400/f472b6/ffffff?text=JP', 'pending'),
  ('17fe5216-82a5-4454-8cd6-0acae34fb3a4', 'liberal', 'Marcos Vinícius Tavares (demo)', 'Neurologista', 'DEMO-104', 'Neurologista de exemplo. Diagnóstico precoce e acompanhamento clínico.', '(81) 0000-0104', 'marcos.demo@elos.app', 'https://placehold.co/400x400/34d399/ffffff?text=MT', 'pending'),
  ('208b5d75-7972-44a2-b816-72621cef1b27', 'liberal', 'Renata Souza Campos (demo)', 'Psicopedagoga', 'DEMO-105', 'Psicopedagoga de exemplo. Apoio ao PEI e mediação entre família e escola.', '(81) 0000-0105', 'renata.demo@elos.app', 'https://placehold.co/400x400/fbbf24/ffffff?text=RC', 'pending')
on conflict (id) do nothing;

insert into public.clinics (id, name, specialty, description, phone, email, image_url, verification_status)
values
  ('be3a20dd-134e-4415-851d-29116ec2a187', 'Clínica Ponto de Apoio (demo)', 'Multidisciplinar', 'Clínica de exemplo com equipe de psicologia, fonoaudiologia e terapia ocupacional voltada ao TEA.', '(81) 0000-0001', 'contato@pontodeapoio.demo', 'https://placehold.co/400x400/8b5cf6/ffffff?text=Clinica', 'pending'),
  ('3f238562-1029-4893-b930-32d452eee1df', 'Espaço Integrar (demo)', 'Neurodesenvolvimento', 'Clínica de exemplo focada em intervenção precoce e acompanhamento familiar.', '(81) 0000-0002', 'contato@integrar.demo', 'https://placehold.co/400x400/3b82f6/ffffff?text=Clinica', 'pending')
on conflict (id) do nothing;

insert into public.professional_skills (professional_id, skill)
select p.id, s.skill
from (values
  ('1a1990be-fcf0-4edd-a2c6-be08be2320a5'::uuid, 'Burnout do cuidador'),
  ('1a1990be-fcf0-4edd-a2c6-be08be2320a5'::uuid, 'Manejo de crise'),
  ('1a1990be-fcf0-4edd-a2c6-be08be2320a5'::uuid, 'Terapia familiar'),
  ('ee12dbdd-a7bc-48db-bfbe-bb4f9bf60009'::uuid, 'CAA'),
  ('ee12dbdd-a7bc-48db-bfbe-bb4f9bf60009'::uuid, 'Linguagem funcional'),
  ('ee12dbdd-a7bc-48db-bfbe-bb4f9bf60009'::uuid, 'PECS'),
  ('48315151-0d3e-4d14-855a-aa3bf412f0f3'::uuid, 'AVDs'),
  ('48315151-0d3e-4d14-855a-aa3bf412f0f3'::uuid, 'Integração sensorial'),
  ('48315151-0d3e-4d14-855a-aa3bf412f0f3'::uuid, 'Seletividade alimentar'),
  ('17fe5216-82a5-4454-8cd6-0acae34fb3a4'::uuid, 'Comorbidades'),
  ('17fe5216-82a5-4454-8cd6-0acae34fb3a4'::uuid, 'Diagnóstico precoce'),
  ('208b5d75-7972-44a2-b816-72621cef1b27'::uuid, 'Alfabetização inclusiva'),
  ('208b5d75-7972-44a2-b816-72621cef1b27'::uuid, 'Mediação escolar'),
  ('208b5d75-7972-44a2-b816-72621cef1b27'::uuid, 'PEI')
) as s(professional_id, skill)
join public.professionals p on p.id = s.professional_id
where not exists (
  select 1 from public.professional_skills ps where ps.professional_id = s.professional_id and ps.skill = s.skill
);

insert into public.professional_experiences (professional_id, description, sort_order)
select e.professional_id, e.description, e.sort_order
from (values
  ('1a1990be-fcf0-4edd-a2c6-be08be2320a5'::uuid, 'Atendimento clínico a famílias atípicas', 1),
  ('1a1990be-fcf0-4edd-a2c6-be08be2320a5'::uuid, 'Grupos de apoio a cuidadores', 2),
  ('ee12dbdd-a7bc-48db-bfbe-bb4f9bf60009'::uuid, 'Implantação de CAA em ambiente escolar', 1),
  ('48315151-0d3e-4d14-855a-aa3bf412f0f3'::uuid, 'Sala de integração sensorial', 1),
  ('17fe5216-82a5-4454-8cd6-0acae34fb3a4'::uuid, 'Ambulatório de neurodesenvolvimento infantil', 1),
  ('208b5d75-7972-44a2-b816-72621cef1b27'::uuid, 'Elaboração e acompanhamento de PEI', 1)
) as e(professional_id, description, sort_order)
where not exists (
  select 1 from public.professional_experiences pe where pe.professional_id = e.professional_id and pe.description = e.description
);
