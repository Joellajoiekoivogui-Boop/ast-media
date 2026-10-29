import { ViewTransition, type ReactNode } from "react";

/**
 * Enveloppe chaque page : glissement directionnel quand le lien précise
 * `transitionTypes`, fondu flou sinon. Le header reste fixe (voir globals.css).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const map = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" };
  return (
    <ViewTransition enter={map} exit={map} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
