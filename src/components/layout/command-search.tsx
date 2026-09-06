"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
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
        className="order-3 flex w-full items-center gap-2 rounded-full border border-card-border bg-muted px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary md:order-none md:max-w-sm md:flex-1"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="flex-1 truncate">Rechercher une actualité…</span>
        <kbd className="hidden shrink-0 rounded border border-card-border px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="am-fade-in fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="am-scale-in w-full max-w-xl overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-card-border px-4 py-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-foreground">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article, un sujet…"
                className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-card-border px-1.5 py-0.5 text-[10px] text-muted-foreground">Échap</kbd>
            </form>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {loading && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">Recherche…</p>
              )}
              {!loading && query.trim() && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">Aucun résultat pour « {query} ».</p>
              )}
              {!loading &&
                results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: categoryColor(article.category.name) }}
                    />
                    <span className="line-clamp-1 flex-1 text-sm font-medium text-foreground">
                      {article.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{article.category.name}</span>
                  </Link>
                ))}
              {!query.trim() && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Tapez pour chercher, ou <kbd className="rounded border border-card-border px-1 py-0.5 text-[10px]">Entrée</kbd> pour voir tous les résultats.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
