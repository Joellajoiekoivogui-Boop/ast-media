import type { ReactNode } from "react";

/**
 * Titre de section : sur-titre en capsule, titre géant dont le dernier mot
 * passe en italique dégradé. Apparaît avec le défilement.
 */
export function SectionTitle({
  eyebrow,
  title,
  accent,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="sd-reveal mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-secondary">
            <span className="bg-flame h-1.5 w-1.5 rounded-full" />
            {eyebrow}
          </span>
        )}
        <Tag className="font-display text-5xl font-bold leading-[0.92] text-foreground sm:text-7xl">
          {title}
          {accent && (
            <>
              {" "}
              <span className="font-accent text-gradient pr-2">{accent}</span>
            </>
          )}
        </Tag>
      </div>
      {action}
    </div>
  );
}
