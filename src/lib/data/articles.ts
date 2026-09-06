import { createClient } from "@/lib/supabase/server";
import type { Article, Category, Profile, Tag } from "@/lib/supabase/types";

export type ArticleCardData = Pick<
  Article,
  "id" | "slug" | "title" | "excerpt" | "cover_image_url" | "published_at" | "view_count"
> & {
  category: Pick<Category, "name" | "slug">;
};

export type ArticleDetail = Article & {
  category: Category;
  author: Pick<Profile, "full_name">;
  tags: Tag[];
};

const CARD_SELECT =
  "id, slug, title, excerpt, cover_image_url, published_at, view_count, category:categories(name, slug)";

export async function getFeaturedArticle(): Promise<ArticleCardData | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as unknown as ArticleCardData | null;
}

export async function getLatestArticles(
  limit = 9,
  excludeIds: string[] = []
): Promise<ArticleCardData[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data } = await query;
  return (data as unknown as ArticleCardData[]) ?? [];
}

export async function getMostReadArticles(limit = 5): Promise<ArticleCardData[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("view_count", { ascending: false })
    .limit(limit);
  return (data as unknown as ArticleCardData[]) ?? [];
}

export async function getArticlesByCategory(
  categorySlug: string,
  { page = 1, pageSize = 12 }: { page?: number; pageSize?: number } = {}
): Promise<{ articles: ArticleCardData[]; total: number }> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (!category) return { articles: [], total: 0 };

  const { data, count } = await supabase
    .from("articles")
    .select(CARD_SELECT, { count: "exact" })
    .eq("status", "published")
    .eq("category_id", category.id)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, to);

  return { articles: (data as unknown as ArticleCardData[]) ?? [], total: count ?? 0 };
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, content, cover_image_url, category_id, status, is_featured, view_count, published_at, created_at, updated_at, category:categories(*), author:profiles(full_name), tags:article_tags(tag:tags(*))"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (!data) return null;

  const raw = data as unknown as Article & {
    category: Category;
    author: Pick<Profile, "full_name">;
    tags: { tag: Tag }[];
  };

  return { ...raw, tags: raw.tags.map((t) => t.tag) };
}

export async function getArticleByIdForAdmin(id: string): Promise<ArticleDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "*, category:categories(*), author:profiles(full_name), tags:article_tags(tag:tags(*))"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  const raw = data as unknown as Article & {
    category: Category;
    author: Pick<Profile, "full_name">;
    tags: { tag: Tag }[];
  };

  return { ...raw, tags: raw.tags.map((t) => t.tag) };
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit = 4
): Promise<ArticleCardData[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", articleId)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as unknown as ArticleCardData[]) ?? [];
}

export async function searchArticles(query: string): Promise<ArticleCardData[]> {
  const term = (query ?? "").trim().slice(0, 120);
  if (!term) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .textSearch("search_vector", term, { type: "websearch", config: "french" })
    .order("published_at", { ascending: false })
    .limit(30);
  return (data as unknown as ArticleCardData[]) ?? [];
}
