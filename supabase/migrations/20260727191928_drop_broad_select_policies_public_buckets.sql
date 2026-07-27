-- drop_broad_select_policies_public_buckets
--
-- Buckets public=true já servem os objetos via URL pública no nível do
-- serviço de Storage, sem precisar de policy de SELECT em storage.objects
-- para isso. A policy ampla (using bucket_id = '...') só permitia listar
-- todos os arquivos via API — exposição desnecessária, acusada pelo
-- Security Advisor (public_bucket_allows_listing). Removendo: a URL pública
-- continua funcionando (bucket público), só a listagem via API deixa de ser
-- possível para qualquer um.
drop policy avatars_public_read on storage.objects;
drop policy professionals_bucket_public_read on storage.objects;
