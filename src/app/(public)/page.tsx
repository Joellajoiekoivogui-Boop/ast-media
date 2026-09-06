import Link from "next/link";
import { HeroBento } from "@/components/articles/hero-bento";
import { ArticleTimeline } from "@/components/articles/article-timeline";
import { ArticleCard } from "@/components/articles/article-card";
import { Reveal } from "@/components/ui/reveal";
import {
  getFeaturedArticle,
  getLatestArticles,
  getMostReadArticles,
} from "@/lib/data/articles";

function SectionHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="whitespace-nowrap text-sm font-extrabold uppercase tracking-widest text-foreground">
        {title}
      </h2>
      <span className="h-px flex-1 bg-card-border" />
      {action}
    </div>
  );
}

export default async function HomePage() {
  const featured = await getFeaturedArticle();
  const pool = await getLatestArticles(12, featured ? [featured.id] : []);
  const heroSecondary = pool.slice(0, 3);
  const latest = pool.length > 3 ? pool.slice(3) : pool;
  const mostRead = await getMostReadArticles(5);
  const dontMiss = latest.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-14">
      {featured && (
        <section className="am-fade-up">
          <SectionHead title="À la une" />
          <HeroBento featured={featured} secondary={heroSecondary} />
        </section>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <section>
          <SectionHead
            title="Dernières actualités"
            action={
              <Link href="/recherche" className="shrink-0 text-sm font-semibold text-primary transition-colors hover:text-primary-hover hover:underline">
                Voir plus
              </Link>
            }
          />
          <ArticleTimeline articles={latest} />
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <Reveal className="rounded-xl border border-card-border bg-card p-5 transition-shadow hover:shadow-md">
            <h3 className="mb-4 border-b-2 border-primary pb-2.5 text-xs font-extrabold uppercase tracking-widest text-foreground">
              Les plus lus
            </h3>
            <ol className="space-y-1">
              {mostRead.map((article, i) => (
                <li key={article.id}>
                  <Link
                    href={`/article/${article.slug}`}
                    className="group flex items-start gap-3 border-b border-card-border py-2.5 last:border-0"
                  >
                    <span className="min-w-[26px] text-2xl font-extrabold leading-[0.9] tracking-tighter text-card-border transition-colors group-hover:text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {article.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {article.category.name} · {article.view_count} vues
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
              {mostRead.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune vue enregistrée pour le moment.</p>
              )}
            </ol>
          </Reveal>

          {dontMiss.length > 0 && (
            <Reveal className="rounded-xl border border-card-border bg-card p-5 transition-shadow hover:shadow-md">
              <h3 className="mb-4 border-b-2 border-primary pb-2.5 text-xs font-extrabold uppercase tracking-widest text-foreground">
                À ne pas manquer
              </h3>
              <div className="space-y-4">
                {dontMiss.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </Reveal>
          )}
        </aside>
      </div>
    </div>
  );
}
