import Link from "next/link";
import type { CSSProperties } from "react";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleGrid } from "@/components/articles/article-grid";
import { HorizontalShowcase } from "@/components/articles/horizontal-showcase";
import { LiveTile } from "@/components/articles/live-tile";
import { MostRead } from "@/components/articles/most-read";
import { Marquee } from "@/components/ui/marquee";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionTitle } from "@/components/ui/section-title";
import { SplitText } from "@/components/ui/split-text";
import { getCategories } from "@/lib/data/categories";
import {
  getFeaturedArticle,
  getLatestArticles,
  getMostReadArticles,
} from "@/lib/data/articles";

function delay(ms: number) {
  return { "--d": `${ms}ms` } as CSSProperties;
}

export default async function HomePage() {
  const [featuredPick, mostRead, categories] = await Promise.all([
    getFeaturedArticle(),
    getMostReadArticles(5),
    getCategories(),
  ]);
  const pool = await getLatestArticles(15, featuredPick ? [featuredPick.id] : []);

  // Sans article « à la une », le plus récent prend la place.
  const featured = featuredPick ?? pool[0] ?? null;
  const rest = featuredPick ? pool : pool.slice(1);
  const tiles = rest.slice(0, 3);
  // 5 articles : la grande carte (2 colonnes) + 4 cartes remplissent 2 rangées pleines.
  const latest = rest.slice(3, 8);
  const showcase = rest.slice(8, 13);
  const headlines = rest.slice(0, 6).map((a) => ({ id: a.id, slug: a.slug, title: a.title, category: a.category.name }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-3 pt-28 sm:px-4 sm:pt-32">
        {/* Intro */}
        <section className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1 className="font-display text-[12.5vw] font-bold leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
            <SplitText text="L'actualité," />{" "}
            <span className="font-accent">
              <SplitText text="en mouvement." delay={180} wordClassName="text-gradient pr-[0.06em]" />
            </span>
          </h1>
          <div className="rise flex max-w-sm flex-col gap-4" style={delay(450)}>
            <p className="text-foreground-secondary">
              Société, politique, sport, culture, économie et technologie : l&apos;info en Guinée et ailleurs,
              vérifiée par notre rédaction.
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((c, i) => (
                <Link
                  key={c.id}
                  href={`/categorie/${c.slug}`}
                  className="pop glass rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                  style={delay(600 + i * 70)}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bento à la une */}
        {featured ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:h-[660px] lg:grid-cols-4 lg:grid-rows-2">
            <div className="rise h-[520px] sm:col-span-2 lg:row-span-2 lg:h-auto" style={delay(100)}>
              <ArticleCard article={featured} variant="feature" animateTitle priority />
            </div>
            <div className="rise h-[320px] lg:h-auto" style={delay(220)}>
              <LiveTile headlines={headlines} />
            </div>
            {tiles.map((article, i) => (
              <div key={article.id} className="rise h-[300px] lg:h-auto" style={delay(300 + i * 90)}>
                <ArticleCard article={article} variant="tile" />
              </div>
            ))}
          </section>
        ) : (
          <ArticleGrid articles={[]} />
        )}
      </div>

      {/* Double bandeau */}
      {(latest.length > 0 || categories.length > 0) && (
        <section className="relative mt-28 -rotate-2 py-6" aria-label="Fil d'actualité">
          <div className="bg-flame -mx-4 py-4 text-[#07070B] shadow-[0_20px_60px_-20px_rgba(255,77,46,0.6)]">
            <Marquee speed={45}>
              {rest.slice(0, 8).map((a) => (
                <Link
                  key={a.id}
                  href={`/article/${a.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="font-display flex items-center gap-6 px-6 text-2xl font-bold whitespace-nowrap hover:underline sm:text-3xl"
                >
                  {a.title}
                  <span aria-hidden>✦</span>
                </Link>
              ))}
            </Marquee>
          </div>
          <div className="-mx-4 mt-3 rotate-[3deg] bg-foreground py-3 text-background">
            <Marquee speed={60} reverse>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categorie/${c.slug}`}
                  className="font-display flex items-center gap-6 px-6 text-4xl font-extrabold uppercase whitespace-nowrap opacity-90 transition-opacity hover:opacity-100 sm:text-5xl"
                >
                  {c.name}
                  <span className="font-accent text-gradient normal-case">&</span>
                </Link>
              ))}
            </Marquee>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        {/* Dernières actualités */}
        {latest.length > 0 && (
          <section className="mt-28">
            <SectionTitle
              eyebrow="Le fil"
              title="Dernières"
              accent="actualités"
              action={
                <Link
                  href="/recherche"
                  className="group glass inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-medium text-foreground"
                >
                  Tout voir
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-[-45deg]">
                    →
                  </span>
                </Link>
              }
            />
            <ArticleGrid articles={latest} bento />
          </section>
        )}

        {/* Les plus lus */}
        <section className="mt-32 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle eyebrow="Classement" title="Les plus" accent="lus" />
            <p className="sd-reveal -mt-4 max-w-sm text-foreground-secondary">
              Les articles qui font parler en ce moment. Survolez un titre pour l&apos;aperçu.
            </p>
          </div>
          <MostRead articles={mostRead} />
        </section>
      </div>

      <HorizontalShowcase articles={showcase} />
    </PageTransition>
  );
}
