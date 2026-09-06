"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const articleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().min(2).max(500_000),
  categoryId: z.string().uuid(),
  coverImageUrl: z
    .string()
    .url()
    .refine((u) => /^https?:\/\//i.test(u), "URL non autorisée")
    .optional()
    .or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled", "published"]),
  scheduledAt: z.string().optional().or(z.literal("")),
  isFeatured: z.union([z.literal("on"), z.literal(null)]).optional(),
});

function parseArticleForm(formData: FormData) {
  return articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    categoryId: formData.get("categoryId"),
    coverImageUrl: formData.get("coverImageUrl") || "",
    tags: formData.get("tags") || "",
    status: formData.get("status"),
    scheduledAt: formData.get("scheduledAt") || "",
    isFeatured: formData.get("isFeatured") as "on" | null,
  });
}

function parseContentJson(raw: string): Record<string, unknown> | null {
  try {
    const doc = JSON.parse(raw);
    if (!doc || typeof doc !== "object" || Array.isArray(doc) || doc.type !== "doc") {
      return null;
    }
    return doc as Record<string, unknown>;
  } catch {
    return null;
  }
}

function resolvePublishedAt(
  status: "draft" | "scheduled" | "published",
  scheduledAt: string,
  existingPublishedAt: string | null
) {
  if (status === "draft") return null;
  if (status === "scheduled") return scheduledAt ? new Date(scheduledAt).toISOString() : null;
  return existingPublishedAt ?? new Date().toISOString();
}

async function syncTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string,
  tagsCsv: string
) {
  const names = Array.from(
    new Set(
      tagsCsv
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );

  await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (names.length === 0) return;

  const slugs = names.map(slugify);
  const { data: existingTags } = await supabase.from("tags").select("id, slug").in("slug", slugs);
  const existingSlugs = new Set((existingTags ?? []).map((t) => t.slug));

  const newTags = names
    .filter((_, i) => !existingSlugs.has(slugs[i]))
    .map((name) => ({ name, slug: slugify(name) }))
    .filter((t, i, arr) => arr.findIndex((x) => x.slug === t.slug) === i);

  const { data: insertedTags } = newTags.length
    ? await supabase.from("tags").insert(newTags).select("id, slug")
    : { data: [] };

  const allTags = [...(existingTags ?? []), ...(insertedTags ?? [])];
  const links = slugs
    .map((slug) => allTags.find((t) => t.slug === slug)?.id)
    .filter((id): id is string => Boolean(id))
    .map((tagId) => ({ article_id: articleId, tag_id: tagId }));

  if (links.length > 0) {
    await supabase.from("article_tags").insert(links);
  }
}

export async function createArticle(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = parseArticleForm(formData);
  if (!parsed.success) return { error: "Formulaire invalide." };

  const contentDoc = parseContentJson(parsed.data.content);
  if (!contentDoc) return { error: "Contenu de l'article invalide." };

  const supabase = await createClient();
  const slug = slugify(parsed.data.title);
  const publishedAt = resolvePublishedAt(
    parsed.data.status,
    parsed.data.scheduledAt ?? "",
    null
  );

  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: contentDoc,
      cover_image_url: parsed.data.coverImageUrl || null,
      category_id: parsed.data.categoryId,
      author_id: admin.id,
      status: parsed.data.status,
      is_featured: parsed.data.isFeatured === "on",
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (error || !article) return { error: "Impossible de créer l'article (titre déjà utilisé ?)." };

  await syncTags(supabase, article.id, parsed.data.tags ?? "");

  revalidatePath("/admin/articles");
  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

export async function updateArticle(articleId: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseArticleForm(formData);
  if (!parsed.success) return { error: "Formulaire invalide." };

  const contentDoc = parseContentJson(parsed.data.content);
  if (!contentDoc) return { error: "Contenu de l'article invalide." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("articles")
    .select("published_at, slug")
    .eq("id", articleId)
    .single();

  const publishedAt = resolvePublishedAt(
    parsed.data.status,
    parsed.data.scheduledAt ?? "",
    existing?.published_at ?? null
  );

  const { error } = await supabase
    .from("articles")
    .update({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: contentDoc,
      cover_image_url: parsed.data.coverImageUrl || null,
      category_id: parsed.data.categoryId,
      status: parsed.data.status,
      is_featured: parsed.data.isFeatured === "on",
      published_at: publishedAt,
    })
    .eq("id", articleId);

  if (error) return { error: "Impossible de mettre à jour l'article." };

  await syncTags(supabase, articleId, parsed.data.tags ?? "");

  revalidatePath("/admin/articles");
  revalidatePath("/", "layout");
  if (existing?.slug) revalidatePath(`/article/${existing.slug}`);
  redirect("/admin/articles");
}

export async function deleteArticle(articleId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", articleId);
  revalidatePath("/admin/articles");
  revalidatePath("/", "layout");
}
