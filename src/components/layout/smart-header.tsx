"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * En-tête flottant : se densifie dès qu'on défile, se cache quand on descend,
 * réapparaît dès qu'on remonte. État écrit en data-attributes (pas de re-rendu).
 */
export function SmartHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = window.scrollY;
    let frame = 0;

    function update() {
      const y = window.scrollY;
      el!.dataset.scrolled = String(y > 24);
      if (y < 160 || y < last - 4) el!.dataset.hidden = "false";
      else if (y > last + 4) el!.dataset.hidden = "true";
      last = y;
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-scrolled="false"
      data-hidden="false"
      className="vt-header group/header fixed inset-x-0 top-0 z-40 pt-3 transition-transform duration-500 [transition-timing-function:var(--ease-out)] data-[hidden=true]:-translate-y-[130%] sm:pt-4"
    >
      {children}
    </div>
  );
}
