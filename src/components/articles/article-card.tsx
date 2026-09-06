import { formatDate } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/data/articles";
import { CategoryChip } from "./category-chip";
import { CoverPlaceholder } from "./cover-placeholder";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TransitionLink } from "@/components/ui/transition-link";

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <SpotlightCard className="h-full">
    <TransitionLink
      href={`/article/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-card-border bg-card shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
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
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryChip name={article.category.name} />
        <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
          {article.title}
        </h3>
        <p className="line-clamp-2 font-serif text-sm text-foreground-secondary">
          {article.excerpt}
        </p>
        <span className="mt-auto pt-1 text-xs text-muted-foreground">
          {article.published_at ? formatDate(article.published_at) : ""}
        </span>
      </div>
    </TransitionLink>
    </SpotlightCard>
  );
}
