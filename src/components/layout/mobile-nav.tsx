"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Category } from "@/lib/supabase/types";
import { categoryColor } from "@/lib/category-colors";
import { SOCIAL_LINKS } from "@/lib/constants";

const emptySubscribe = () => () => {};

/**
 * Menu plein écran : s'ouvre en cercle depuis le bouton, liens en cascade.
 * Placé sous l'en-tête (z-35 < z-40) pour que les capsules — et le bouton de
 * fermeture — restent par-dessus.
 */
export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [{ name: "Accueil", href: "/", color: "var(--foreground)" }, ...categories.map((c) => ({ name: c.name, href: `/categorie/${c.slug}`, color: categoryColor(c.name) }))];

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-90"
      >
        <span className={`absolute h-[2px] w-4 rounded-full bg-current transition-transform duration-500 [transition-timing-function:var(--ease-spring)] ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
        <span className={`absolute h-[2px] w-4 rounded-full bg-current transition-transform duration-500 [transition-timing-function:var(--ease-spring)] ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
      </button>

      {mounted &&
        createPortal(
          <div
            data-open={open}
            aria-hidden={!open}
            inert={!open}
            className="group/menu fixed inset-0 z-[35] flex flex-col overflow-y-auto bg-background px-6 pb-10 pt-28 transition-[clip-path] duration-700 [clip-path:circle(0%_at_calc(100%-3rem)_2.75rem)] [transition-timing-function:var(--ease-inout)] data-[open=true]:[clip-path:circle(150%_at_calc(100%-3rem)_2.75rem)]"
          >
            <div className="aurora" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <nav className="flex flex-col">
              {items.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ "--d": `${120 + i * 50}ms` } as CSSProperties}
                  className="group flex items-center gap-4 border-b border-card-border py-4 opacity-0 translate-y-6 transition-[opacity,transform] duration-700 [transition-delay:0ms] [transition-timing-function:var(--ease-out)] group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100 group-data-[open=true]/menu:[transition-delay:var(--d)]"
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display flex-1 text-4xl font-bold text-foreground transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl">
                    {item.name}
                  </span>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                </Link>
              ))}
            </nav>

            <div className="mt-10 flex flex-wrap items-center gap-3 opacity-0 transition-opacity delay-500 duration-700 group-data-[open=true]/menu:opacity-100">
              <Link
                href="/recherche"
                onClick={() => setOpen(false)}
                className="glass rounded-full px-5 py-3 text-sm font-medium text-foreground"
              >
                Rechercher
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="glass rounded-full px-5 py-3 text-sm font-medium text-foreground"
              >
                Connexion
              </Link>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="bg-flame rounded-full px-5 py-3 text-sm font-semibold text-[#07070B]"
              >
                WhatsApp
              </a>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
