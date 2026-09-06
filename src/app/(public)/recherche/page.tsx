import { ArticleGrid } from "@/components/articles/article-grid";
import { searchArticles } from "@/lib/data/articles";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-extrabold text-foreground">Recherche</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {q ? (
          <>
            {results.length} résultat{results.length > 1 ? "s" : ""} pour «&nbsp;{q}&nbsp;»
          </>
        ) : (
          "Saisissez un mot-clé dans la barre de recherche."
        )}
      </p>
      {q && <ArticleGrid articles={results} />}
    </div>
  );
}
