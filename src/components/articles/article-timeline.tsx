import { formatDate } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/data/articles";
import { CategoryChip } from "./category-chip";
import { CoverPlaceholder } from "./cover-placeholder";
import { TransitionLink } from "@/components/ui/transition-link";

export function ArticleTimeline({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Aucun article pour le moment.
      </p>
    );
  }

  return (
    <div className="relative space-y-6 pl-7 am-stagger">
      <div className="absolute bottom-2 left-[9px] top-2 w-px bg-gradient-to-b from-primary to-card-border" />
      {articles.map((article, i) => (
        <div key={article.id} className="relative">
          <span
            className={`absolute -left-7 top-2 h-2.5 w-2.5 rounded-full border-2 border-primary bg-card ${
              i === 0 ? "am-pulse bg-primary" : ""
            }`}
          />
          <TransitionLink
            href={`/article/${article.slug}`}
            className="group grid grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-xl border border-card-border bg-card p-0 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[180px_1fr]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted sm:aspect-auto">
              {article.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <CoverPlaceholder categoryName={article.category.name} />
              )}
            </div>
            <div className="flex flex-col gap-2 py-3 pr-4">
              <CategoryChip name={article.category.name} />
              <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
                {article.title}
              </h3>
              <p className="line-clamp-2 hidden font-serif text-sm text-foreground-secondary sm:block">
                {article.excerpt}
              </p>
              <span className="mt-auto text-xs text-muted-foreground">
                {article.published_at ? formatDate(article.published_at) : ""}
              </span>
            </div>
          </TransitionLink>
        </div>
      ))}
    </div>
  );
}
