"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { Category } from "@/lib/supabase/types";

/** Liens du menu : une capsule de survol glisse d'un lien à l'autre. */
export function NavLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const items = [{ name: "Accueil", href: "/" }, ...categories.map((c) => ({ name: c.name, href: `/categorie/${c.slug}` }))];

  function moveTo(el: HTMLElement) {
    const box = ref.current;
    if (!box) return;
    box.style.setProperty("--hx", `${el.offsetLeft}px`);
    box.style.setProperty("--hw", `${el.offsetWidth}px`);
    box.dataset.hover = "true";
  }

  return (
    <div
      ref={ref}
      onMouseLeave={() => {
        if (ref.current) ref.current.dataset.hover = "false";
      }}
      className="group/nav relative flex items-center"
      data-hover="false"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-foreground/10 opacity-0 transition-[transform,width,opacity] duration-500 [transition-timing-function:var(--ease-out)] group-data-[hover=true]/nav:opacity-100"
        style={{ width: "var(--hw, 0px)", transform: "translateX(var(--hx, 0px))" }}
      />
      {items.map((item) => {
        const active = item.href === pathname;
        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={(e) => moveTo(e.currentTarget)}
            onFocus={(e) => moveTo(e.currentTarget)}
            aria-current={active ? "page" : undefined}
            className={`relative z-10 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-foreground text-background" : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
