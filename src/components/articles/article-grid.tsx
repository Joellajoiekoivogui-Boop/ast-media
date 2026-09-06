import type { ArticleCardData } from "@/lib/data/articles";
import { ArticleCard } from "./article-card";

export function ArticleGrid({
  articles,
  bento = false,
}: {
  articles: ArticleCardData[];
  bento?: boolean;
}) {
  if (articles.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Aucun article pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 am-stagger">
      {articles.map((article, i) => (
        <div key={article.id} className={bento && i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}
