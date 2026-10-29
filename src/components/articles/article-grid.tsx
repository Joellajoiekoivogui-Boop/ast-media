import type { ArticleCardData } from "@/lib/data/articles";
import { ArticleCard } from "./article-card";

/**
 * Grille asymétrique : la première carte peut occuper deux colonnes
 * (« bento »). Chaque carte apparaît au défilement.
 */
export function ArticleGrid({
  articles,
  bento = false,
  shared = true,
}: {
  articles: ArticleCardData[];
  bento?: boolean;
  shared?: boolean;
}) {
  if (articles.length === 0) {
    return (
      <div className="glass rounded-[2rem] px-6 py-20 text-center">
        <p className="font-display text-3xl font-bold text-foreground">Rien pour le moment</p>
        <p className="mt-2 text-muted-foreground">Les prochains articles arrivent très vite.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) =>
        bento && i === 0 ? (
          <div key={article.id} className="sd-reveal h-[420px] sm:col-span-2 sm:h-[520px]">
            <ArticleCard article={article} variant="feature" shared={shared} />
          </div>
        ) : (
          <div key={article.id} className="sd-reveal">
            <ArticleCard article={article} shared={shared} />
          </div>
        )
      )}
    </div>
  );
}
