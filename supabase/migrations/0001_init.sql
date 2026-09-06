-- AST Media — schéma initial
create extension if not exists "pgcrypto";

-- =========================
-- profiles
-- =========================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin','editor','journalist')),
  created_at timestamptz not null default now()
);

-- =========================
-- categories
-- =========================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================
-- articles
-- =========================
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content jsonb not null,
  cover_image_url text,
  category_id uuid not null references public.categories(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft','scheduled','published')),
  is_featured boolean not null default false,
  view_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_status_published_at_idx on public.articles (status, published_at desc);
create index articles_category_idx on public.articles (category_id);
create index articles_featured_idx on public.articles (is_featured) where is_featured = true;

alter table public.articles add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('french', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('french', coalesce(excerpt,'')), 'B')
  ) stored;
create index articles_search_idx on public.articles using gin(search_vector);

-- =========================
-- tags
-- =========================
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- =========================
-- comments
-- =========================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  author_name text not null,
  author_email text,
  body text not null,
  status text not null default 'approved' check (status in ('pending','approved','hidden','reported')),
  report_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index comments_article_idx on public.comments (article_id, status);
create index comments_parent_idx on public.comments (parent_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

-- =========================
-- RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.tags enable row level security;
alter table public.article_tags enable row level security;
alter table public.comments enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles admin write" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "categories public read" on public.categories for select using (true);
create policy "categories admin insert" on public.categories for insert with check (public.is_admin());
create policy "categories admin update" on public.categories for update using (public.is_admin());
create policy "categories admin delete" on public.categories for delete using (public.is_admin());

create policy "articles public read published" on public.articles for select
  using (status = 'published' and published_at <= now());
create policy "articles admin read all" on public.articles for select using (public.is_admin());
create policy "articles admin insert" on public.articles for insert with check (public.is_admin());
create policy "articles admin update" on public.articles for update using (public.is_admin());
create policy "articles admin delete" on public.articles for delete using (public.is_admin());

create policy "tags public read" on public.tags for select using (true);
create policy "tags admin write" on public.tags for all using (public.is_admin()) with check (public.is_admin());

create policy "article_tags public read" on public.article_tags for select using (true);
create policy "article_tags admin write" on public.article_tags for all using (public.is_admin()) with check (public.is_admin());

create policy "comments public read approved" on public.comments for select using (status = 'approved');
create policy "comments admin read all" on public.comments for select using (public.is_admin());
create policy "comments public insert" on public.comments for insert with check (true);
create policy "comments admin update" on public.comments for update using (public.is_admin());
create policy "comments admin delete" on public.comments for delete using (public.is_admin());
