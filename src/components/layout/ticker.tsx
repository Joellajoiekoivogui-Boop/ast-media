import Link from "next/link";
import type { ArticleCardData } from "@/lib/data/articles";

export function Ticker({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;

  const items = [...articles, ...articles];

  return (
    <div className="am-marquee-row overflow-hidden">
      <div className="am-marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((article, i) => (
          <Link
            key={`${article.id}-${i}`}
            href={`/article/${article.slug}`}
            className="text-xs font-medium text-accent-foreground/90 transition-colors hover:text-accent-foreground"
          >
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
