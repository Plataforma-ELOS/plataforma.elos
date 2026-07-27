-- add_storage_buckets_avatars_professionals
--
-- Dois buckets de Storage: avatars (foto de perfil do usuário) e
-- professionals (foto de profissional/clínica, usada no cadastro).
-- Path prefixado pelo auth.uid() do dono (padrão recomendado do Supabase —
-- RLS de Storage não precisa consultar outras tabelas): "{uid}/arquivo.ext".
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, array['image/png','image/jpeg','image/webp']),
  ('professionals', 'professionals', true, 2097152, array['image/png','image/jpeg','image/webp']);

create policy avatars_public_read on storage.objects
  for select to public using (bucket_id = 'avatars');

create policy avatars_owner_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy avatars_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy avatars_owner_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy professionals_bucket_public_read on storage.objects
  for select to public using (bucket_id = 'professionals');

create policy professionals_bucket_owner_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'professionals' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy professionals_bucket_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'professionals' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'professionals' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy professionals_bucket_owner_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'professionals' and (storage.foldername(name))[1] = (select auth.uid())::text);
