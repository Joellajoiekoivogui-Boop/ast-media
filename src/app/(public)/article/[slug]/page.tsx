import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatDate, initials, readingTime } from "@/lib/utils";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data/articles";
import { getApprovedComments } from "@/lib/data/comments";
import { ArticleContent } from "@/components/articles/article-content";
import { ArticleDock } from "@/components/articles/article-dock";
import { ArticleGrid } from "@/components/articles/article-grid";
import { Cover } from "@/components/articles/cover";
import { ViewCounter } from "@/components/articles/view-counter";
import { CategoryChip } from "@/components/articles/category-chip";
import { CountUp } from "@/components/ui/count-up";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionTitle } from "@/components/ui/section-title";
import { SplitText } from "@/components/ui/split-text";
import type { CSSProperties } from "react";
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
    <PageTransition>
      <ViewCounter slug={article.slug} />
      <div aria-hidden className="bg-flame sd-progress-page fixed inset-x-0 top-0 z-50 h-[3px]" />

      <article className="pt-28 sm:pt-36">
        <header className="mx-auto max-w-5xl px-4">
          <nav className="rise mb-8 flex flex-wrap items-center gap-2 text-sm" aria-label="Fil d'Ariane">
            <Link
              href="/"
              transitionTypes={["nav-back"]}
              className="glass group inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-foreground-secondary transition-colors hover:text-foreground"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 transition-transform duration-500 group-hover:-translate-x-0.5">
                ←
              </span>
              Accueil
            </Link>
            <Link href={`/categorie/${article.category.slug}`} transitionTypes={["nav-back"]}>
              <CategoryChip name={article.category.name} glass />
            </Link>
          </nav>

          <h1 className="font-display text-[2.6rem] font-bold leading-[0.95] text-foreground sm:text-6xl lg:text-[5.2rem]">
            <SplitText text={article.title} delay={100} />
          </h1>

          <p className="rise mt-8 max-w-3xl text-xl leading-relaxed text-foreground-secondary sm:text-2xl" style={{ "--d": "500ms" } as CSSProperties}>
            {article.excerpt}
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-4" style={{ "--d": "650ms" } as CSSProperties}>
            <span className="flex items-center gap-3">
              <span className="bg-flame rounded-full p-[2px]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground">
                  {initials(article.author.full_name)}
                </span>
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{article.author.full_name}</span>
                <span className="block text-xs text-muted-foreground">Rédaction AST Media</span>
              </span>
            </span>
            <span className="hidden h-8 w-px bg-card-border sm:block" />
            {[
              article.published_at ? formatDate(article.published_at) : null,
              `${minutes} min de lecture`,
            ]
              .filter(Boolean)
              .map((label) => (
                <span key={label} className="glass rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground-secondary">
                  {label}
                </span>
              ))}
            <span className="glass rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground-secondary">
              <CountUp value={article.view_count} /> vues
            </span>
          </div>
        </header>

        {article.cover_image_url && (
          <figure className="sd-shrink mx-auto mt-14 max-w-7xl px-3 sm:px-4">
            <Cover article={article} priority className="aspect-[16/9] w-full rounded-[2rem] sm:rounded-[2.5rem]" />
          </figure>
        )}

        <div className="mx-auto mt-16 max-w-[720px] px-4">
          <ArticleContent content={article.content as JSONContent} />

          {article.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag.id} className="sd-reveal glass rounded-full px-4 py-2 text-sm text-foreground-secondary">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-32 max-w-7xl px-3 sm:px-4">
            <SectionTitle eyebrow={article.category.name} title="À lire" accent="ensuite" />
            <ArticleGrid articles={related.slice(0, 3)} />
          </section>
        )}

        <div className="mx-auto mt-32 max-w-3xl px-4">
          <CommentList comments={comments} articleId={article.id} articleSlug={article.slug} />
        </div>
      </article>

      <ArticleDock url={shareUrl} title={article.title} />
    </PageTransition>
  );
}
