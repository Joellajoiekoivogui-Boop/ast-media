import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatDate, initials, readingTime } from "@/lib/utils";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data/articles";
import { getApprovedComments } from "@/lib/data/comments";
import { ArticleContent } from "@/components/articles/article-content";
import { ArticleCarousel } from "@/components/articles/article-carousel";
import { FloatingShare } from "@/components/articles/floating-share";
import { ReadingProgress } from "@/components/articles/reading-progress";
import { ViewCounter } from "@/components/articles/view-counter";
import { CategoryChip } from "@/components/articles/category-chip";
import { CommentList } from "@/components/comments/comment-list";
import type { JSONContent } from "@tiptap/core";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image_url ? [article.cover_image_url] : [],
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, comments] = await Promise.all([
    getRelatedArticles(article.id, article.category_id),
    getApprovedComments(article.id),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const shareUrl = `${siteUrl}/article/${article.slug}`;
  const minutes = readingTime(article.content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 xl:flex xl:max-w-5xl xl:items-start xl:gap-8 xl:px-0">
      <ReadingProgress />

      <aside className="hidden xl:sticky xl:top-32 xl:flex xl:w-14 xl:shrink-0 xl:flex-col xl:gap-2 xl:pt-2">
        <FloatingShare url={shareUrl} title={article.title} variant="vertical" />
      </aside>

      <div className="xl:max-w-3xl xl:flex-1">
      <ViewCounter slug={article.slug} />

      <Link href={`/categorie/${article.category.slug}`} className="mb-3 inline-block">
        <CategoryChip name={article.category.name} />
      </Link>

      <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
        {article.title}
      </h1>

      <p className="mb-5 font-serif text-lg italic text-foreground-secondary">
        {article.excerpt}
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-card-border py-3.5 text-sm text-muted-foreground">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initials(article.author.full_name)}
        </span>
        <span>
          <span className="block font-semibold text-foreground">{article.author.full_name}</span>
          <span className="flex flex-wrap items-center gap-x-2 text-xs">
            <span>{article.published_at ? formatDate(article.published_at) : ""}</span>
            <span>·</span>
            <span>{minutes} min de lecture</span>
            <span>·</span>
            <span>{article.view_count} vues</span>
          </span>
        </span>
      </div>

      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="mb-8 w-full rounded-xl object-cover"
        />
      )}

      <ArticleContent content={article.content as JSONContent} />

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full border border-card-border px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-card-border pt-6 xl:hidden">
        <FloatingShare url={shareUrl} title={article.title} variant="horizontal" />
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 text-xl font-extrabold text-foreground">Articles similaires</h2>
          <ArticleCarousel articles={related} />
        </div>
      )}

      <div className="mt-14 border-t border-card-border pt-10">
        <CommentList comments={comments} articleId={article.id} articleSlug={article.slug} />
      </div>
      </div>
    </div>
  );
}
