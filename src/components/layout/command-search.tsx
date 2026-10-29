"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { quickSearch } from "@/app/actions/search";
import type { ArticleCardData } from "@/lib/data/articles";
import { categoryColor } from "@/lib/category-colors";

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await quickSearch(query);
      setResults(data);
      setLoading(false);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
        className="group flex h-10 items-center gap-2 rounded-full px-3 text-sm text-foreground-secondary transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <kbd className="hidden rounded-md border border-card-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-background/60 px-4 pt-[14vh] backdrop-blur-md [animation:rise_0.3s_ease-out_both]"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-label="Recherche"
              className="glass-strong shadow-glow pop w-full max-w-2xl overflow-hidden rounded-[2rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-card-border px-6 py-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-primary">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un article, un sujet…"
                  className="font-display flex-1 bg-transparent text-2xl font-semibold text-foreground outline-none placeholder:text-muted-foreground/70"
                />
                <kbd className="rounded-md border border-card-border px-2 py-1 font-mono text-[10px] text-muted-foreground">Échap</kbd>
              </form>

              <div className="max-h-[50vh] overflow-y-auto p-3">
                {loading && (
                  <div className="space-y-2 p-2" aria-label="Recherche…">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-12 animate-pulse rounded-2xl bg-foreground/5" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                )}
                {!loading && query.trim() && results.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">Aucun résultat pour « {query} ».</p>
                )}
                {!loading &&
                  results.map((article, i) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      transitionTypes={["nav-forward"]}
                      onClick={() => setOpen(false)}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className="rise group flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-foreground/5"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: categoryColor(article.category.name), boxShadow: `0 0 12px ${categoryColor(article.category.name)}` }}
                      />
                      <span className="line-clamp-1 flex-1 text-[15px] font-medium text-foreground">{article.title}</span>
                      <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {article.category.name}
                      </span>
                      <span className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">→</span>
                    </Link>
                  ))}
                {!query.trim() && (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    Tapez pour chercher, ou{" "}
                    <kbd className="rounded-md border border-card-border px-1.5 py-0.5 font-mono text-[10px]">Entrée</kbd>{" "}
                    pour voir tous les résultats.
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
