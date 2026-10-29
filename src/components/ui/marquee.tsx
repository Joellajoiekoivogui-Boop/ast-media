import type { CSSProperties, ReactNode } from "react";

/** Bandeau infini : le contenu est dupliqué pour une boucle sans couture. */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        data-reverse={reverse ? "" : undefined}
        style={{ "--speed": `${speed}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
