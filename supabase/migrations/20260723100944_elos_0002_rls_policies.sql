-- elos_0002_rls_policies
-- Reconstruído por introspecção (ver README.md desta pasta).

-- schema privado — is_admin() é isolado aqui (não exposto pelo PostgREST) e
-- só refletido depois de 0006; já é assim no estado atual, então já criamos
-- direto no schema private.
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable security definer
set search_path to 'public'
as $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$function$;

-- ==================== ENABLE RLS ====================
alter table public.profiles enable row level security;
alter table public.clinics enable row level security;
alter table public.professionals enable row level security;
alter table public.professional_skills enable row level security;
alter table public.professional_experiences enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_saves enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.events enable row level security;
alter table public.news_articles enable row level security;
alter table public.library_items enable row level security;
alter table public.library_favorites enable row level security;
alter table public.knowledge_pills enable row level security;
alter table public.knowledge_trails enable row level security;
alter table public.trail_progress enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;
alter table public.dependents enable row level security;
alter table public.caregiver_journal enable row level security;

-- ==================== PROFILES ====================
create policy profiles_select on public.profiles for select to anon, authenticated using (true);
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- ==================== CLINICS ====================
create policy clinics_read on public.clinics for select to public using (true);
create policy clinics_owner_insert on public.clinics for insert to authenticated
  with check (owner_id = (select auth.uid()) or (select private.is_admin()));
create policy clinics_owner_update on public.clinics for update to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()))
  with check (owner_id = (select auth.uid()) or (select private.is_admin()));
create policy clinics_owner_delete on public.clinics for delete to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()));

-- ==================== PROFESSIONALS ====================
create policy professionals_read on public.professionals for select to public using (true);
create policy professionals_owner_insert on public.professionals for insert to authenticated
  with check (owner_id = (select auth.uid()) or (select private.is_admin()));
create policy professionals_owner_update on public.professionals for update to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()))
  with check (owner_id = (select auth.uid()) or (select private.is_admin()));
create policy professionals_owner_delete on public.professionals for delete to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()));

-- ==================== PROFESSIONAL_SKILLS ====================
create policy prof_skill_read on public.professional_skills for select to public using (true);
create policy prof_skill_insert on public.professional_skills for insert to authenticated
  with check (exists (select 1 from public.professionals p where p.id = professional_skills.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))));
create policy prof_skill_update on public.professional_skills for update to authenticated
  using (exists (select 1 from public.professionals p where p.id = professional_skills.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))))
  with check (exists (select 1 from public.professionals p where p.id = professional_skills.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))));
create policy prof_skill_delete on public.professional_skills for delete to authenticated
  using (exists (select 1 from public.professionals p where p.id = professional_skills.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))));

-- ==================== PROFESSIONAL_EXPERIENCES ====================
create policy prof_exp_read on public.professional_experiences for select to public using (true);
create policy prof_exp_insert on public.professional_experiences for insert to authenticated
  with check (exists (select 1 from public.professionals p where p.id = professional_experiences.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))));
create policy prof_exp_update on public.professional_experiences for update to authenticated
  using (exists (select 1 from public.professionals p where p.id = professional_experiences.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))))
  with check (exists (select 1 from public.professionals p where p.id = professional_experiences.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))));
create policy prof_exp_delete on public.professional_experiences for delete to authenticated
  using (exists (select 1 from public.professionals p where p.id = professional_experiences.professional_id and (p.owner_id = (select auth.uid()) or (select private.is_admin()))));

-- ==================== POSTS / COMMENTS / LIKES / SAVES ====================
create policy posts_read on public.posts for select to public using (true);
create policy posts_insert on public.posts for insert to authenticated with check (author_id = (select auth.uid()));
create policy posts_update_own on public.posts for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy posts_delete_own on public.posts for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.is_admin()));

create policy comments_read on public.comments for select to public using (true);
create policy comments_insert on public.comments for insert to authenticated with check (author_id = (select auth.uid()));
create policy comments_delete_own on public.comments for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.is_admin()));

create policy likes_read on public.post_likes for select to public using (true);
create policy likes_insert on public.post_likes for insert to authenticated with check (profile_id = (select auth.uid()));
create policy likes_delete on public.post_likes for delete to authenticated using (profile_id = (select auth.uid()));

create policy saves_own on public.post_saves for all to authenticated
  using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

-- ==================== GROUPS / GROUP_MEMBERS ====================
create policy groups_read on public.groups for select to public using (true);
create policy groups_insert on public.groups for insert to authenticated with check (created_by = (select auth.uid()));
create policy groups_update_own on public.groups for update to authenticated
  using (created_by = (select auth.uid()) or (select private.is_admin()))
  with check (created_by = (select auth.uid()) or (select private.is_admin()));

create policy gm_read on public.group_members for select to public using (true);
create policy gm_insert on public.group_members for insert to authenticated with check (profile_id = (select auth.uid()));
create policy gm_update on public.group_members for update to authenticated
  using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy gm_delete on public.group_members for delete to authenticated using (profile_id = (select auth.uid()));

-- ==================== EVENTS ====================
create policy events_read on public.events for select to public using (true);
create policy events_insert on public.events for insert to authenticated
  with check (created_by = (select auth.uid()) or (select private.is_admin()));
create policy events_update on public.events for update to authenticated
  using (created_by = (select auth.uid()) or (select private.is_admin()))
  with check (created_by = (select auth.uid()) or (select private.is_admin()));
create policy events_delete on public.events for delete to authenticated
  using (created_by = (select auth.uid()) or (select private.is_admin()));

-- ==================== NEWS_ARTICLES (conteúdo público, admin escreve) ====================
create policy news_articles_read on public.news_articles for select to public using (true);
create policy news_articles_admin_insert on public.news_articles for insert to authenticated with check ((select private.is_admin()));
create policy news_articles_admin_update on public.news_articles for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy news_articles_admin_delete on public.news_articles for delete to authenticated using ((select private.is_admin()));

-- ==================== LIBRARY_ITEMS / FAVORITES ====================
create policy library_read on public.library_items for select to public using (approved = true or private.is_admin());
create policy library_suggest on public.library_items for insert to authenticated with check (suggested_by = (select auth.uid()));
create policy library_admin_write on public.library_items for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy library_admin_delete on public.library_items for delete to authenticated using ((select private.is_admin()));

create policy lib_fav_own on public.library_favorites for all to authenticated
  using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

-- ==================== KNOWLEDGE_PILLS / TRAILS / PROGRESS ====================
create policy knowledge_pills_read on public.knowledge_pills for select to public using (true);
create policy knowledge_pills_admin_insert on public.knowledge_pills for insert to authenticated with check ((select private.is_admin()));
create policy knowledge_pills_admin_update on public.knowledge_pills for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy knowledge_pills_admin_delete on public.knowledge_pills for delete to authenticated using ((select private.is_admin()));

create policy knowledge_trails_read on public.knowledge_trails for select to public using (true);
create policy knowledge_trails_admin_insert on public.knowledge_trails for insert to authenticated with check ((select private.is_admin()));
create policy knowledge_trails_admin_update on public.knowledge_trails for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy knowledge_trails_admin_delete on public.knowledge_trails for delete to authenticated using ((select private.is_admin()));

create policy trail_prog_own on public.trail_progress for all to authenticated
  using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

-- ==================== REVIEWS ====================
create policy reviews_read on public.reviews for select to public using (true);
create policy reviews_insert on public.reviews for insert to authenticated with check (author_id = (select auth.uid()));
create policy reviews_update_own on public.reviews for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy reviews_delete_own on public.reviews for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.is_admin()));

-- ==================== CONTACT_MESSAGES ====================
create policy contact_insert on public.contact_messages for insert to anon, authenticated
  with check (
    char_length(name) >= 2 and char_length(name) <= 120
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254
    and (subject is null or char_length(subject) <= 160)
    and char_length(message) >= 10 and char_length(message) <= 4000
  );
create policy contact_admin_read on public.contact_messages for select to authenticated using ((select private.is_admin()));

-- ==================== DEPENDENTS / CAREGIVER_JOURNAL (só dono) ====================
create policy dependents_own on public.dependents for all to authenticated
  using (caregiver_id = (select auth.uid())) with check (caregiver_id = (select auth.uid()));

create policy journal_own on public.caregiver_journal for all to authenticated
  using (caregiver_id = (select auth.uid())) with check (caregiver_id = (select auth.uid()));
