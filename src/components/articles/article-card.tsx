import Link from "next/link";
import type { CSSProperties } from "react";
import { timeAgo } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/data/articles";
import { CategoryChip } from "./category-chip";
import { Cover } from "./cover";
import { Tilt } from "@/components/ui/tilt";
import { SplitText } from "@/components/ui/split-text";

type Variant = "default" | "feature" | "tile" | "horizontal" | "portrait";

const NAV = ["nav-forward"];

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Meta({ article, light = false }: { article: ArticleCardData; light?: boolean }) {
  return (
    <span className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider ${light ? "text-white/70" : "text-muted-foreground"}`}>
      <span>{article.published_at ? timeAgo(article.published_at) : ""}</span>
      <span className="h-1 w-1 rounded-full bg-current opacity-50" />
      <span className="inline-flex items-center gap-1">
        <EyeIcon />
        {new Intl.NumberFormat("fr-FR").format(article.view_count)}
      </span>
    </span>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <span className={`arrow-btn glass flex h-11 w-11 items-center justify-center rounded-full text-foreground ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export function ArticleCard({
  article,
  variant = "default",
  animateTitle = false,
  shared = true,
  priority = false,
}: {
  article: ArticleCardData;
  variant?: Variant;
  animateTitle?: boolean;
  shared?: boolean;
  priority?: boolean;
}) {
  const href = `/article/${article.slug}`;

  // Grande carte à la une : image plein cadre, texte superposé.
  if (variant === "feature" || variant === "tile" || variant === "portrait") {
    const big = variant === "feature";
    return (
      <Tilt className="h-full rounded-[2rem]" max={big ? 4 : 7}>
        <Link href={href} transitionTypes={NAV} className="group relative block h-full overflow-hidden rounded-[2rem]">
          <Cover
            article={article}
            shared={shared}
            priority={priority}
            className={`absolute inset-0 h-full w-full ${big ? "clip-in" : ""}`}
            imgClassName="zoom-img"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/0" />
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
            <CategoryChip name={article.category.name} glass />
            <Arrow />
          </div>
          <div className={`absolute inset-x-0 bottom-0 flex flex-col gap-3 ${big ? "p-6 sm:p-9" : "p-5"}`}>
            <h3
              className={`font-display font-bold leading-[0.98] text-white ${
                big ? "text-3xl sm:text-5xl lg:text-[3.4rem]" : variant === "portrait" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
              }`}
            >
              {animateTitle ? <SplitText text={article.title} delay={350} /> : <span className="link-underline">{article.title}</span>}
            </h3>
            {big && (
              <p className="rise line-clamp-2 max-w-xl text-white/80 sm:text-lg" style={{ "--d": "700ms" } as CSSProperties}>
                {article.excerpt}
              </p>
            )}
            <Meta article={article} light />
          </div>
        </Link>
      </Tilt>
    );
  }

  if (variant === "horizontal") {
    return (
      <Tilt className="h-full rounded-[2rem]" max={5}>
        <Link
          href={href}
          transitionTypes={NAV}
          className="group grid h-full grid-cols-[110px_1fr] gap-4 overflow-hidden rounded-[2rem] border border-card-border bg-card/70 p-2 backdrop-blur sm:grid-cols-[180px_1fr]"
        >
          <Cover article={article} shared={shared} className="h-full min-h-[120px] rounded-[1.5rem]" imgClassName="zoom-img" />
          <div className="flex flex-col justify-center gap-2 py-2 pr-3">
            <CategoryChip name={article.category.name} />
            <h3 className="font-display line-clamp-3 text-lg font-bold leading-tight text-foreground sm:text-xl">
              <span className="link-underline">{article.title}</span>
            </h3>
            <Meta article={article} />
          </div>
        </Link>
      </Tilt>
    );
  }

  return (
    <Tilt className="h-full rounded-[2rem]">
      <Link
        href={href}
        transitionTypes={NAV}
        className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-card-border bg-card/70 p-2 backdrop-blur"
      >
        <div className="relative">
          <Cover article={article} shared={shared} className="aspect-[4/3] w-full rounded-[1.6rem]" imgClassName="zoom-img" />
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
            <CategoryChip name={article.category.name} glass />
            <Arrow />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-4">
          <h3 className="font-display line-clamp-3 text-xl font-bold leading-[1.1] text-foreground">
            <span className="link-underline">{article.title}</span>
          </h3>
          <p className="line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <div className="mt-auto pt-1">
            <Meta article={article} />
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
