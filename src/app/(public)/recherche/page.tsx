import type { CSSProperties } from "react";
import { ArticleGrid } from "@/components/articles/article-grid";
import { PageTransition } from "@/components/ui/page-transition";
import { SplitText } from "@/components/ui/split-text";
import { searchArticles } from "@/lib/data/articles";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-3 pt-32 sm:px-4 sm:pt-40">
        <h1 className="font-display text-6xl font-bold leading-[0.9] text-foreground sm:text-8xl">
          <SplitText text="Chercher," />{" "}
          <span className="font-accent">
            <SplitText text="trouver." delay={150} wordClassName="text-gradient pr-[0.06em]" />
          </span>
        </h1>

        <form action="/recherche" className="rise mt-10" style={{ "--d": "350ms" } as CSSProperties}>
          <div className="border-spin group flex items-center gap-3 rounded-full bg-card p-2 pl-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-primary">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="q"
              type="search"
              defaultValue={q}
              aria-label="Rechercher"
              placeholder="Un sujet, un nom, un lieu…"
              className="font-display min-w-0 flex-1 bg-transparent py-3 text-xl font-semibold text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-2xl"
            />
            <button
              type="submit"
              className="bg-flame shrink-0 rounded-full px-6 py-3.5 text-sm font-semibold text-[#07070B] transition-transform hover:scale-105 active:scale-95"
            >
              Chercher
            </button>
          </div>
        </form>

        <p className="rise mb-10 mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground" style={{ "--d": "450ms" } as CSSProperties}>
          {q ? (
            <>
              {results.length} résultat{results.length > 1 ? "s" : ""} pour «&nbsp;{q}&nbsp;»
            </>
          ) : (
            "Saisissez un mot-clé pour lancer la recherche."
          )}
        </p>
        {q && <ArticleGrid articles={results} />}
      </div>
    </PageTransition>
  );
}
