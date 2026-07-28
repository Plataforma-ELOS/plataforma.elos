-- Upload de imagem no Acervo Digital e em Criar Post (E3/F7).
--
-- posts.image_url: coluna aditiva, nullable — usada por criarPost/PostCard.
--
-- Buckets `library` e `posts`: mesmo padrão já usado em `avatars`/
-- `professionals` (migration add_storage_buckets_avatars_professionals) —
-- público para leitura (servido via URL pública do Storage, sem policy de
-- select), insert/update/delete restritos ao dono da pasta
-- ((storage.foldername(name))[1] = auth.uid()).
alter table public.posts add column image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('library', 'library', true, 2097152, array['image/png','image/jpeg','image/webp']),
  ('posts', 'posts', true, 2097152, array['image/png','image/jpeg','image/webp']);

create policy library_bucket_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'library' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy library_bucket_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'library' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'library' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy library_bucket_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'library' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy posts_bucket_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'posts' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy posts_bucket_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'posts' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'posts' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy posts_bucket_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'posts' and (storage.foldername(name))[1] = (select auth.uid())::text);
