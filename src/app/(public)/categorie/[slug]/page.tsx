import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/articles/article-grid";
import { getArticlesByCategory } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { categoryColor } from "@/lib/category-colors";

const PAGE_SIZE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const { articles, total } = await getArticlesByCategory(slug, { page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <h1
          className="whitespace-nowrap text-2xl font-extrabold tracking-tight"
          style={{ color: categoryColor(category.name) }}
        >
          {category.name}
        </h1>
        <span className="h-px flex-1 bg-card-border" />
        <span className="shrink-0 text-sm text-muted-foreground">
          {total} article{total > 1 ? "s" : ""}
        </span>
      </div>
      <ArticleGrid articles={articles} bento={page === 1} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/categorie/${slug}?page=${p}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-card-border text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
