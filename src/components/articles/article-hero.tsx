import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/data/articles";
import { CoverPlaceholder } from "./cover-placeholder";

export function ArticleHero({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative flex min-h-[360px] items-end overflow-hidden rounded-2xl border border-card-border bg-muted shadow-sm"
    >
      {article.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="am-kenburns absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0">
          <CoverPlaceholder categoryName={article.category.name} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-8">
        <span className="am-scale-in w-fit rounded px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-gold-foreground bg-gold">
          À la une · {article.category.name}
        </span>
        <h2 className="am-fade-up max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl [animation-delay:80ms]">
          {article.title}
        </h2>
        <p className="am-fade-up max-w-xl font-serif text-sm text-white/85 sm:text-base line-clamp-2 [animation-delay:160ms]">
          {article.excerpt}
        </p>
        <span className="am-fade-up text-xs text-white/70 [animation-delay:220ms]">
          {article.published_at ? formatDate(article.published_at) : ""}
        </span>
      </div>
    </Link>
  );
}
