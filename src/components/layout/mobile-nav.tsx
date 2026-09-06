"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/supabase/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-card-border text-foreground transition-colors hover:bg-muted"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M4 7h16"
            className={`origin-center transition-transform duration-300 ease-out ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <path
            d="M4 12h16"
            className={`transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
          />
          <path
            d="M4 17h16"
            className={`origin-center transition-transform duration-300 ease-out ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </svg>
      </button>

      <div
        className={`absolute inset-x-0 top-full z-40 overflow-hidden border-card-border bg-background shadow-lg transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[70vh] border-b opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="am-stagger flex flex-col gap-1 px-4 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            Accueil
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorie/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}

          <hr className="my-2 border-card-border" />

          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
            Connexion
          </Link>
        </nav>
      </div>
    </div>
  );
}
