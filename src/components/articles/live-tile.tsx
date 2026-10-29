"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

type Headline = { id: string; slug: string; title: string; category: string };

const TIME = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Conakry" });
const DAY = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Conakry" });

function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}

// Seconde courante (0 côté serveur) : évite tout décalage d'hydratation.
function useNowSeconds() {
  return useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 1000), () => 0);
}

/** Tuile « en direct » : heure de Conakry + titres qui défilent toutes les 4 s. */
export function LiveTile({ headlines }: { headlines: Headline[] }) {
  const now = useNowSeconds();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (headlines.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % headlines.length), 4000);
    return () => clearInterval(id);
  }, [headlines.length]);

  const date = now ? new Date(now * 1000) : null;
  const [hh, mm] = date ? TIME.format(date).split(":") : ["--", "--"];
  const current = headlines[index];

  return (
    <div className="border-spin relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-card p-6">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,#FF4D2E_0%,transparent_65%)] opacity-40 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,#6A4DFF_0%,transparent_65%)] opacity-40 blur-2xl" />

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <span className="live-dot h-2 w-2 rounded-full bg-primary" />
          En direct
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Conakry</span>
      </div>

      <div className="relative">
        <p className="font-display text-7xl font-bold leading-none tabular-nums text-foreground">
          {hh}
          <span className="blink text-gradient">:</span>
          {mm}
        </p>
        <p className="mt-2 text-sm capitalize text-muted-foreground">{date ? DAY.format(date) : " "}</p>
      </div>

      <div className="relative min-h-[4.5rem] border-t border-card-border pt-4">
        {current && (
          <Link
            key={current.id}
            href={`/article/${current.slug}`}
            transitionTypes={["nav-forward"]}
            className="headline-in group block"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{current.category}</span>
            <span className="mt-1 line-clamp-2 block text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
              {current.title}
            </span>
          </Link>
        )}
        {headlines.length > 1 && (
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {headlines.map((h, i) => (
              <span
                key={h.id}
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-primary" : "w-1.5 bg-foreground/20"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
