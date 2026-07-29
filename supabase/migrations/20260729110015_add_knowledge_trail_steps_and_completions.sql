-- Trilhas de conhecimento — passos reais + progresso (sem quiz, fora de escopo).
-- Transforma "Continuar Trilha" (hoje inerte) numa tela de passo-a-passo real.

create table public.knowledge_trail_steps (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references public.knowledge_trails(id) on delete cascade,
  title text not null,
  content text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.knowledge_trail_steps enable row level security;
create policy knowledge_trail_steps_read on public.knowledge_trail_steps for select to public using (true);
create policy knowledge_trail_steps_admin_insert on public.knowledge_trail_steps for insert to authenticated with check ((select private.is_admin()));
create policy knowledge_trail_steps_admin_update on public.knowledge_trail_steps for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy knowledge_trail_steps_admin_delete on public.knowledge_trail_steps for delete to authenticated using ((select private.is_admin()));

-- Denormaliza trail_id (evita join só pra filtrar por trilha na Server Action).
create table public.trail_step_completions (
  step_id uuid not null references public.knowledge_trail_steps(id) on delete cascade,
  trail_id uuid not null references public.knowledge_trails(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (step_id, profile_id)
);

alter table public.trail_step_completions enable row level security;
create policy trail_step_completions_own on public.trail_step_completions for all to authenticated
  using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create index idx_trail_step_completions_trail_profile on public.trail_step_completions (trail_id, profile_id);

-- Seed: 4 passos por trilha demo, conteúdo factual/informativo (mesmo tom de
-- knowledge_pills), ancorado em legislação real (Lei Berenice Piana e LBI) —
-- não é aconselhamento jurídico.
insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'O que é o laudo de TEA', 'O laudo é um documento emitido por um médico (neurologista, psiquiatra ou pediatra do desenvolvimento) que confirma o diagnóstico de Transtorno do Espectro Autista com base nos critérios do DSM-5/CID-11. Uma avaliação multidisciplinar (fonoaudiologia, psicologia, terapia ocupacional) enriquece o laudo, mas o diagnóstico médico formal é o que garante validade legal.', 1
from public.knowledge_trails where title = 'Trilha: Entendendo o Laudo de TEA';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'Quem pode emitir o laudo', 'Médicos como neurologistas, psiquiatras e pediatras do desenvolvimento podem emitir o laudo. Profissionais como fonoaudiólogos, psicólogos e terapeutas ocupacionais contribuem com avaliações complementares importantes, mas o documento com validade legal para fins de direitos precisa vir de um médico.', 2
from public.knowledge_trails where title = 'Trilha: Entendendo o Laudo de TEA';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'Direitos garantidos pela Lei Berenice Piana (Lei 12.764/2012)', 'Essa lei considera a pessoa com TEA como pessoa com deficiência para todos os efeitos legais. Isso garante prioridade em atendimentos, acesso à educação inclusiva e, quando os critérios socioeconômicos são cumpridos, acesso a benefícios previdenciários como o BPC.', 3
from public.knowledge_trails where title = 'Trilha: Entendendo o Laudo de TEA';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'Como usar o laudo no dia a dia', 'O laudo pode ser apresentado na escola para solicitar o Plano de Ensino Individualizado (PEI) e professor de apoio, em consultas de saúde para garantir prioridade de atendimento, em concursos e processos seletivos para reserva de vagas para pessoas com deficiência, e em pedidos de benefícios sociais.', 4
from public.knowledge_trails where title = 'Trilha: Entendendo o Laudo de TEA';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'Direito à educação inclusiva', 'A Lei Brasileira de Inclusão (Lei 13.146/2015) garante a matrícula em escola regular — ela não pode ser negada por causa da deficiência. A escola é quem deve se adaptar às necessidades da criança, não o contrário.', 1
from public.knowledge_trails where title = 'Trilha: Primeiros Passos na Escola';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'O que é o PEI e como solicitá-lo', 'O Plano de Ensino Individualizado (PEI) adapta objetivos, métodos e formas de avaliação às necessidades do aluno. Pode ser solicitado formalmente à direção ou coordenação pedagógica da escola, apresentando o laudo.', 2
from public.knowledge_trails where title = 'Trilha: Primeiros Passos na Escola';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'O papel do profissional de apoio escolar', 'O profissional de apoio (também chamado de mediador) acompanha o aluno em sala de aula quando necessário, ajudando nas atividades e na comunicação. Ele não substitui o professor regular, que continua responsável pelo ensino da turma.', 3
from public.knowledge_trails where title = 'Trilha: Primeiros Passos na Escola';

insert into public.knowledge_trail_steps (trail_id, title, content, sort_order)
select id, 'Como acompanhar o desenvolvimento escolar', 'Reuniões periódicas com a escola, registro do progresso e comunicação constante entre família, escola e profissionais de saúde ajudam a ajustar o PEI conforme a criança se desenvolve.', 4
from public.knowledge_trails where title = 'Trilha: Primeiros Passos na Escola';
