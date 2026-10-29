import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/articles/article-grid";
import { getArticlesByCategory } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { categoryColor } from "@/lib/category-colors";
import { Marquee } from "@/components/ui/marquee";
import { PageTransition } from "@/components/ui/page-transition";
import type { CSSProperties } from "react";

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

  const color = categoryColor(category.name);

  return (
    <PageTransition>
      <header className="relative pt-32 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
        />
        <div className="mx-auto max-w-7xl px-4">
          <span className="rise glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-secondary">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }} />
            Rubrique · {total} article{total > 1 ? "s" : ""}
          </span>
          <h1
            className="font-display mt-6 font-extrabold leading-[0.82] text-foreground"
            aria-label={category.name}
            // Taille calculée pour que le nom tienne toujours sur une ligne.
            style={{ fontSize: `min(11rem, ${(85 / (0.6 * (category.name.length + 1))).toFixed(1)}vw)` }}
          >
            {category.name.split("").map((ch, i) => (
              <span key={i} className="split-word" aria-hidden>
                <span style={{ "--i": i, "--d": "80ms" } as CSSProperties}>{ch}</span>
              </span>
            ))}
            <span className="split-word" aria-hidden>
              <span style={{ "--i": category.name.length, "--d": "80ms", color } as CSSProperties}>.</span>
            </span>
          </h1>
        </div>
        <div className="text-outline mt-8 select-none border-y border-card-border py-4" aria-hidden>
          <Marquee speed={30}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="font-display px-8 text-5xl font-extrabold uppercase">
                {category.name} <span className="font-accent normal-case">✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      </header>

      <div className="mx-auto mt-16 max-w-7xl px-3 sm:px-4">
        <ArticleGrid articles={articles} bento={page === 1} />

        {totalPages > 1 && (
          <nav className="mt-16 flex justify-center" aria-label="Pagination">
            <div className="glass flex gap-1 rounded-full p-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/categorie/${slug}?page=${p}`}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-full px-3 font-mono text-sm transition-all duration-300 ${
                    p === page ? "bg-foreground text-background" : "text-foreground-secondary hover:bg-foreground/10 hover:text-foreground"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </PageTransition>
  );
}
