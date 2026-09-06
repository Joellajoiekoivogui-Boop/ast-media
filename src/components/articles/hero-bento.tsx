import { formatDate } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/data/articles";
import { ArticleHero } from "./article-hero";
import { CoverPlaceholder } from "./cover-placeholder";
import { TransitionLink } from "@/components/ui/transition-link";

function SecondaryStory({ article, delay }: { article: ArticleCardData; delay: number }) {
  return (
    <TransitionLink
      href={`/article/${article.slug}`}
      className="am-fade-up group flex items-center gap-3 rounded-xl border border-card-border bg-card p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {article.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <CoverPlaceholder categoryName={article.category.name} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
          {article.category.name}
        </span>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
          {article.title}
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {article.published_at ? formatDate(article.published_at) : ""}
        </span>
      </div>
    </TransitionLink>
  );
}

export function HeroBento({
  featured,
  secondary,
}: {
  featured: ArticleCardData;
  secondary: ArticleCardData[];
}) {
  if (secondary.length === 0) {
    return <ArticleHero article={featured} />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <ArticleHero article={featured} />
      <div className="flex flex-col gap-3">
        {secondary.slice(0, 3).map((article, i) => (
          <SecondaryStory key={article.id} article={article} delay={100 + i * 80} />
        ))}
      </div>
    </div>
  );
}
