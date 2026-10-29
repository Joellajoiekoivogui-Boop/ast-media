"use client";

import { useEffect, useRef, useState } from "react";

const ICON = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

const RADIUS = 18;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Dock flottant de lecture : anneau de progression + partage. Il glisse depuis
 * le bas une fois l'en-tête de l'article dépassé.
 */
export function ArticleDock({ url, title }: { url: string; title: string }) {
  const dock = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let frame = 0;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ring.current) ring.current.style.strokeDashoffset = String(CIRC * (1 - p));
      if (label.current) label.current.textContent = `${Math.round(p * 100)}`;
      if (dock.current) dock.current.dataset.visible = String(window.scrollY > 420);
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // partage annulé
      }
    } else {
      handleCopy();
    }
  }

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground active:scale-90";

  return (
    <>
      <div
        ref={dock}
        data-visible="false"
        className="glass-strong shadow-glow fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 translate-y-[150%] items-center gap-1 rounded-full p-1.5 transition-transform duration-700 [transition-timing-function:var(--ease-spring)] data-[visible=true]:translate-y-0 sm:bottom-6"
      >
        <div className="relative flex h-11 w-11 items-center justify-center" title="Progression de lecture">
          <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
            <circle cx="22" cy="22" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="3" className="text-foreground/10" />
            <circle
              ref={ring}
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              stroke="url(#dock-flame)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
            />
            <defs>
              <linearGradient id="dock-flame" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF4D2E" />
                <stop offset="100%" stopColor="#FFC21A" />
              </linearGradient>
            </defs>
          </svg>
          <span ref={label} className="absolute font-mono text-[10px] font-semibold tabular-nums text-foreground">
            0
          </span>
        </div>
        <span className="mx-1 h-6 w-px bg-card-border" />
        <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noreferrer" aria-label="Partager sur WhatsApp" className={btn}>
          <svg {...ICON}>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4c-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
          </svg>
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noreferrer" aria-label="Partager sur Facebook" className={btn}>
          <svg {...ICON}>
            <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
          </svg>
        </a>
        <a href={`https://x.com/intent/tweet?text=${t}&url=${u}`} target="_blank" rel="noreferrer" aria-label="Partager sur X" className={`${btn} hidden sm:flex`}>
          <svg {...ICON}>
            <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.2-9.4L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.7L7.4 4h-1.8l12.1 16Z" />
          </svg>
        </a>
        <button type="button" onClick={handleCopy} aria-label="Copier le lien" className={btn}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5" />
          </svg>
        </button>
        <button type="button" onClick={handleNativeShare} aria-label="Partager" className={`${btn} sm:hidden`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
          </svg>
        </button>
        <a href="#commentaires" className="bg-flame ml-1 hidden h-11 items-center rounded-full px-4 text-sm font-semibold text-[#07070B] transition-transform hover:scale-105 sm:flex">
          Réagir
        </a>
      </div>

      {copied && (
        <div className="pop fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg">
          Lien copié ✓
        </div>
      )}
    </>
  );
}
