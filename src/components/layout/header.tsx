import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data/categories";
import { CommandSearch } from "./command-search";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { SmartHeader } from "./smart-header";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

const PILL =
  "glass-strong flex h-14 items-center rounded-full shadow-[0_10px_40px_-15px_rgba(0,0,0,0.35)] transition-[height,box-shadow] duration-500 group-data-[scrolled=true]/header:h-12";

export async function Header() {
  const categories = await getCategories();

  return (
    <SmartHeader>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 sm:px-4">
        <Link href="/" transitionTypes={["nav-back"]} aria-label="AST Media — accueil" className={`${PILL} group gap-2.5 pl-2 pr-5`}>
          <Image
            src="/logo-ast-media.png"
            alt=""
            width={219}
            height={279}
            className="h-10 w-auto transition-transform duration-700 [transition-timing-function:var(--ease-spring)] group-hover:rotate-[-8deg] group-hover:scale-110"
            priority
          />
          <span className="font-display text-[17px] font-bold leading-none text-foreground">
            AST<span className="text-gradient">.</span>MEDIA
          </span>
        </Link>

        <nav className={`${PILL} hidden px-1.5 xl:flex`}>
          <NavLinks categories={categories} />
        </nav>

        <div className={`${PILL} gap-0.5 px-1.5`}>
          <CommandSearch />
          <DarkModeToggle />
          <Link
            href="/admin/login"
            className="hidden h-10 items-center rounded-full px-4 text-sm font-medium text-foreground-secondary transition-colors hover:bg-foreground/10 hover:text-foreground sm:flex"
          >
            Connexion
          </Link>
          <MobileNav categories={categories} />
        </div>
      </div>
    </SmartHeader>
  );
}
