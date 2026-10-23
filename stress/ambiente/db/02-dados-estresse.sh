#!/bin/sh
# Massa de dados sintética para o teste de estresse.
#
# Produção hoje tem 0 posts e 0 comentários — testar com o banco vazio mediria
# um sistema que não existe. O volume é ajustável por variável de ambiente
# (dimensão "volume de dados" do teste de estresse), por exemplo:
#   ESTRESSE_POSTS=5000 ESTRESSE_COMENTARIOS_POR_POST=30 docker compose up
set -eu
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q \
  -v usuarios="${ESTRESSE_USUARIOS:-200}" \
  -v posts="${ESTRESSE_POSTS:-600}" \
  -v comentarios="${ESTRESSE_COMENTARIOS_POR_POST:-6}" \
  -v curtidas="${ESTRESSE_CURTIDAS_POR_POST:-12}" <<'SQL'
-- Usuários: o trigger on_auth_user_created cria o profile de cada um.
insert into auth.users (email, raw_user_meta_data)
select format('estresse%s@exemplo.local', n),
       jsonb_build_object('full_name', format('Usuária de Estresse %s', n))
from generate_series(1, :usuarios) as n;

-- Posts espalhados nos últimos 60 dias.
insert into public.posts (author_id, content, created_at)
select (select id from public.profiles order by random() limit 1 offset 0),
       format('Post de estresse %s: relato sobre rotina, terapias e apoio entre cuidadores.', n),
       now() - (random() * interval '60 days')
from generate_series(1, :posts) as n;

-- Autor aleatório por post (o subselect acima é avaliado uma vez só).
update public.posts p
set author_id = (select id from public.profiles where p.id is not null order by random() limit 1);

insert into public.comments (post_id, author_id, content, created_at)
select p.id,
       (select id from public.profiles where p.id is not null and c > 0 order by random() limit 1),
       format('Comentário de estresse %s no post.', c),
       p.created_at + (c * interval '7 minutes')
from public.posts p
cross join generate_series(1, :comentarios) as c;

insert into public.post_likes (post_id, profile_id)
select p.id, u.id
from public.posts p
cross join lateral (
  select id from public.profiles where p.id is not null order by random() limit :curtidas
) u
on conflict do nothing;

insert into public.groups (name, description, tags)
select format('Grupo de estresse %s', g), 'Grupo sintético para o teste de estresse.', array['estresse', 'apoio']
from generate_series(1, 8) as g;

insert into public.group_members (group_id, profile_id)
select g.id, u.id
from public.groups g
cross join lateral (
  select id from public.profiles where g.id is not null order by random() limit 25
) u
on conflict do nothing;

insert into public.events (title, description, starts_at, type, location)
select format('Evento de estresse %s', e), 'Encontro sintético.', now() + (e * interval '3 days'), 'online', null
from generate_series(1, 10) as e;

analyze;
SQL
