import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data/categories";
import { getLatestArticles } from "@/lib/data/articles";
import { CommandSearch } from "./command-search";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { Ticker } from "./ticker";
import { ScrollCompact } from "./scroll-compact";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

const TODAY_LABEL = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

export async function Header() {
  const [categories, tickerArticles] = await Promise.all([
    getCategories(),
    getLatestArticles(6),
  ]);

  return (
    <ScrollCompact>
      <header className="sticky top-0 z-30" style={{ viewTransitionName: "site-header" }}>
        <div className="am-topbar overflow-hidden bg-accent text-accent-foreground transition-[max-height,opacity] duration-300 ease-out">
          <div className="mx-auto flex h-8 max-w-6xl items-center gap-4 px-4 text-xs">
            <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary am-pulse" />
              Fil en direct
            </span>
            <span className="min-w-0 flex-1">
              <Ticker articles={tickerArticles} />
            </span>
            <span className="hidden shrink-0 capitalize opacity-70 sm:inline">{TODAY_LABEL} · Conakry</span>
          </div>
        </div>

        <div className="border-b border-card-border bg-background/95 backdrop-blur">
          <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2 md:flex-nowrap">
            <Link href="/" className="group flex shrink-0 items-center gap-3">
              <Image
                src="/logo-ast-media.png"
                alt="AST Media"
                width={219}
                height={279}
                className="am-logo-img h-16 w-auto transition-[height] duration-300 ease-out group-hover:scale-[1.06] sm:h-20"
                priority
              />
              <span className="hidden flex-col leading-none sm:flex">
                <span className="text-2xl font-extrabold tracking-tight text-foreground">
                  AST<span className="text-primary">.</span>MEDIA
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  L&apos;information, vérifiée
                </span>
              </span>
            </Link>

            <CommandSearch />

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/admin/login"
                className="hidden items-center gap-1.5 rounded-full border border-card-border px-3.5 py-2 text-xs font-semibold text-foreground-secondary transition-colors hover:border-primary hover:text-primary md:flex"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                Connexion
              </Link>
              <DarkModeToggle />
              <MobileNav categories={categories} />
            </div>
          </div>
        </div>

        <nav className="hidden border-b-2 border-foreground bg-background md:block">
          <NavLinks categories={categories} />
        </nav>
      </header>
    </ScrollCompact>
  );
}
