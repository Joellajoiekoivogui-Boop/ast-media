-- AST Media — durcissement sécurité
-- Corrige : écriture publique arbitraire dans `comments`, fuite des e-mails,
-- élévation via profiles.role, censure via report_comment, search_path mutable.

-- =====================================================================
-- 1. Fonctions internes : search_path verrouillé + schéma qualifié
-- =====================================================================

-- is_admin() devient SECURITY DEFINER pour éviter la récursion RLS sur
-- profiles (la policy "profiles self read" appelle is_admin()).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =====================================================================
-- 2. profiles.role : plus de défaut 'admin'
-- =====================================================================
alter table public.profiles alter column role drop default;

-- Empêche un compte de modifier son propre rôle (double barrière avec la
-- policy "profiles admin write") : seul un admin peut écrire la colonne role.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'not authorized to change role';
  end if;
  return new;
end $$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
before update on public.profiles
for each row execute function public.prevent_role_self_escalation();

-- =====================================================================
-- 3. comments : plus d'INSERT direct par le client
-- =====================================================================
drop policy if exists "comments public insert" on public.comments;

-- Aucune écriture directe : les insertions passent obligatoirement par
-- public.post_comment() (SECURITY DEFINER, donc non soumis à cette policy).
create policy "comments no direct insert" on public.comments
  for insert with check (false);

-- =====================================================================
-- 4. comments : l'e-mail n'est plus lisible par le public (anon)
-- =====================================================================
revoke select on public.comments from anon;
grant select (id, article_id, parent_id, author_name, body, status, report_count, created_at)
  on public.comments to anon;
-- `authenticated` = personnel de la rédaction uniquement (aucune inscription
-- publique) : accès complet conservé pour la modération.
grant select on public.comments to authenticated;

-- =====================================================================
-- 5. post_comment() : insertion validée + modération
-- =====================================================================
create or replace function public.post_comment(
  p_article_id  uuid,
  p_parent_id   uuid,
  p_author_name text,
  p_author_email text,
  p_body        text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name  text := btrim(coalesce(p_author_name, ''));
  v_email text := nullif(btrim(coalesce(p_author_email, '')), '');
  v_body  text := btrim(coalesce(p_body, ''));
  v_id    uuid;
begin
  -- Validation
  if char_length(v_name) < 2 or char_length(v_name) > 80 then
    raise exception 'invalid author name';
  end if;
  if char_length(v_body) < 2 or char_length(v_body) > 4000 then
    raise exception 'invalid body';
  end if;
  if v_email is not null and
     (char_length(v_email) > 160 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    raise exception 'invalid email';
  end if;

  -- L'article doit exister et être publié
  if not exists (
    select 1 from public.articles
    where id = p_article_id and status = 'published'
      and (published_at is null or published_at <= now())
  ) then
    raise exception 'article not available';
  end if;

  -- La réponse doit cibler un commentaire approuvé du même article
  if p_parent_id is not null then
    if not exists (
      select 1 from public.comments
      where id = p_parent_id and article_id = p_article_id and status = 'approved'
    ) then
      raise exception 'invalid parent comment';
    end if;
  end if;

  -- Anti-flood : pas de doublon exact sur l'article dans la dernière heure
  if exists (
    select 1 from public.comments
    where article_id = p_article_id and body = v_body
      and created_at > now() - interval '1 hour'
  ) then
    return null;
  end if;

  insert into public.comments (article_id, parent_id, author_name, author_email, body, status)
  values (p_article_id, p_parent_id, v_name, v_email, v_body, 'pending')
  returning id into v_id;

  return v_id;
end $$;

revoke execute on function public.post_comment(uuid, uuid, text, text, text) from public;
grant execute on function public.post_comment(uuid, uuid, text, text, text) to anon, authenticated;

-- =====================================================================
-- 6. report_comment() : ne masque plus le commentaire (fin de la censure)
-- =====================================================================
create or replace function public.report_comment(p_comment_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.comments
  set report_count = least(report_count + 1, 100000)
  where id = p_comment_id and status = 'approved';
$$;
revoke execute on function public.report_comment(uuid) from public;
grant execute on function public.report_comment(uuid) to anon, authenticated;

-- =====================================================================
-- 7. increment_article_view() : search_path verrouillé
-- =====================================================================
create or replace function public.increment_article_view(p_slug text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.articles set view_count = view_count + 1
  where slug = p_slug and status = 'published';
$$;
revoke execute on function public.increment_article_view(text) from public;
grant execute on function public.increment_article_view(text) to anon, authenticated;

-- =====================================================================
-- 8. Storage `covers` : restreint aux images, taille <= 5 Mo
-- =====================================================================
drop policy if exists "covers admin insert" on storage.objects;
create policy "covers admin insert" on storage.objects
  for insert with check (
    bucket_id = 'covers'
    and public.is_admin()
    and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','avif','gif')
    and coalesce((metadata->>'size')::bigint, 0) <= 5242880
  );
