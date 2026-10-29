"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { ArticleCardData } from "@/lib/data/articles";
import { categoryColor } from "@/lib/category-colors";
import { CountUp } from "@/components/ui/count-up";

/**
 * Classement « Les plus lus » : lignes géantes ; au survol, la photo de
 * l'article suit le curseur avec un léger retard (interpolation rAF).
 */
export function MostRead({ articles }: { articles: ArticleCardData[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0 });

  const isHovering = hovered !== null;

  // La boucle d'animation ne tourne que pendant le survol.
  useEffect(() => {
    if (!isHovering) return;
    let raf = 0;
    const loop = () => {
      const el = preview.current;
      if (el) {
        pos.current.x += (target.current.x - pos.current.x) * 0.14;
        pos.current.y += (target.current.y - pos.current.y) * 0.14;
        const velocity = pos.current.x - last.current.x;
        last.current.x = pos.current.x;
        const tilt = Math.max(-12, Math.min(12, velocity * 0.6));
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isHovering]);

  function handleMove(e: PointerEvent<HTMLOListElement>) {
    target.current = { x: e.clientX, y: e.clientY };
    // Premier mouvement : on part de la position du curseur, pas de (0, 0).
    if (!isHovering) {
      pos.current = { ...target.current };
      last.current.x = e.clientX;
    }
  }

  if (articles.length === 0) {
    return <p className="text-muted-foreground">Aucune vue enregistrée pour le moment.</p>;
  }

  const active = hovered !== null ? articles[hovered] : null;

  return (
    <>
      <ol onPointerMove={handleMove} onPointerLeave={() => setHovered(null)} className="border-t border-card-border">
        {articles.map((article, i) => (
          <li key={article.id} className="sd-reveal">
            <Link
              href={`/article/${article.slug}`}
              transitionTypes={["nav-forward"]}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
              className="group relative flex items-center gap-4 overflow-hidden border-b border-card-border py-6 sm:gap-8 sm:py-8"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-foreground/[0.04] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-y-100"
              />
              <span className="font-display text-outline relative w-14 shrink-0 text-5xl font-extrabold leading-none transition-colors duration-500 group-hover:text-primary group-hover:[-webkit-text-stroke-color:transparent] sm:w-24 sm:text-7xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative min-w-0 flex-1 transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3">
                <span className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor(article.category.name) }} />
                  {article.category.name}
                  <span className="opacity-40">/</span>
                  <CountUp value={article.view_count} /> vues
                </span>
                <span className="font-display line-clamp-2 block text-2xl font-bold leading-[1.05] text-foreground sm:text-4xl">
                  {article.title}
                </span>
              </span>
              {article.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.cover_image_url} alt="" className="relative h-16 w-16 shrink-0 rounded-2xl object-cover md:hidden" />
              )}
              <span className="relative hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-card-border text-foreground transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground md:flex">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      >
        <div
          className={`relative h-56 w-72 overflow-hidden rounded-3xl shadow-2xl transition-[opacity,scale] duration-500 [transition-timing-function:var(--ease-out)] ${
            active?.cover_image_url ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          {articles.map((a, i) =>
            a.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={a.id}
                src={a.cover_image_url}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-500 ${
                  i === hovered ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ) : null
          )}
        </div>
      </div>
    </>
  );
}
