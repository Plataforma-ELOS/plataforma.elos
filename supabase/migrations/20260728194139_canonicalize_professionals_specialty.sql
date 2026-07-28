-- Canonicaliza specialty dos profissionais demo para a lista fixa usada pelo
-- Select de cadastro (E2/causa raiz de /profissionais) e pelos chips de
-- /profissionais, que agora casam por igualdade exata em vez de prefixo
-- truncado. Clínicas não mudam (specialty delas é descritor livre).
update public.professionals set specialty = 'Psicólogo(a)' where specialty = 'Psicóloga';
update public.professionals set specialty = 'Fonoaudiólogo(a)' where specialty = 'Fonoaudiólogo';
update public.professionals set specialty = 'Neurologista ou Psiquiatra' where specialty = 'Neurologista';
update public.professionals set specialty = 'Psicopedagogo(a)' where specialty = 'Psicopedagoga';
