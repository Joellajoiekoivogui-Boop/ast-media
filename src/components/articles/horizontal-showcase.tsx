import Link from "next/link";
import type { ArticleCardData } from "@/lib/data/articles";
import { ArticleCard } from "./article-card";

/**
 * Section épinglée : le défilement vertical fait glisser les cartes à
 * l'horizontale (CSS scroll-driven animations). Sans support ou sur mobile,
 * c'est un carrousel horizontal classique à balayer.
 */
export function HorizontalShowcase({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="hs-outer relative mt-32">
      <div className="hs-sticky">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-4">
          <h2 className="font-display text-5xl font-bold leading-[0.92] text-foreground sm:text-7xl">
            À ne pas <span className="font-accent text-gradient pr-2">manquer</span>
          </h2>
          <div className="hs-hint w-48 shrink-0">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Faites défiler</p>
            <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
              <div className="hs-progress bg-flame h-full w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="hs-track flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 pt-20 [scrollbar-width:none] md:px-[max(1rem,calc((100vw-80rem)/2+1rem))]">
          {articles.map((article, i) => (
            <div key={article.id} className="relative h-[460px] w-[78vw] shrink-0 snap-start sm:w-[420px] md:h-[min(62vh,560px)]">
              <span className="font-display text-outline pointer-events-none absolute -top-[4.6rem] left-2 z-10 text-7xl font-extrabold leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ArticleCard article={article} variant="portrait" />
            </div>
          ))}

          <Link
            href="/recherche"
            className="group flex h-[460px] w-[70vw] shrink-0 snap-start flex-col items-center justify-center gap-6 rounded-[2rem] border border-dashed border-card-border text-center sm:w-[320px] md:h-[min(62vh,560px)]"
          >
            <span className="bg-flame flex h-24 w-24 items-center justify-center rounded-full text-3xl text-[#07070B] transition-transform duration-700 [transition-timing-function:var(--ease-spring)] group-hover:rotate-45 group-hover:scale-110">
              ↗
            </span>
            <span className="font-display text-3xl font-bold text-foreground">
              Toutes les
              <br />
              actualités
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
