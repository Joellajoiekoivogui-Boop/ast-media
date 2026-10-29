"use client";

import { Magnetic } from "@/components/ui/magnetic";

export function BackToTop() {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0 })}
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-card-border text-foreground transition-colors hover:border-transparent hover:bg-primary hover:text-primary-foreground"
        aria-label="Revenir en haut"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-500 group-hover:-translate-y-1">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </Magnetic>
  );
}
