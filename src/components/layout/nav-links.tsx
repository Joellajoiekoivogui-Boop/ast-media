"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Category } from "@/lib/supabase/types";

export function NavLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const items = [{ name: "Accueil", href: "/" }, ...categories.map((c) => ({ name: c.name, href: `/categorie/${c.slug}` }))];
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.href === pathname)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  function measure(index: number) {
    const el = linkRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setIndicator({
      left: elRect.left - containerRect.left + container.scrollLeft,
      width: elRect.width,
    });
  }

  useLayoutEffect(() => {
    measure(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, categories.length]);

  useEffect(() => {
    function onResize() {
      measure(activeIndex);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => measure(activeIndex)}
      className="relative mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 text-sm font-semibold"
    >
      {indicator && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-[3px] bg-primary transition-[left,width] duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          ref={(el) => {
            linkRefs.current[i] = el;
          }}
          onMouseEnter={() => measure(i)}
          className={`shrink-0 px-3 py-3 transition-colors duration-200 ${
            i === activeIndex ? "text-primary" : "text-foreground-secondary hover:text-primary"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
