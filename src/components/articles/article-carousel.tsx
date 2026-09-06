import type { ArticleCardData } from "@/lib/data/articles";
import { ArticleCard } from "./article-card";

export function ArticleCarousel({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="am-stagger -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
      {articles.map((article) => (
        <div key={article.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}
