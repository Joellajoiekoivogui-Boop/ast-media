import { Fragment, type CSSProperties } from "react";

/**
 * Découpe un texte en mots qui remontent un à un derrière un masque.
 * Rendu serveur : aucune dépendance JS, l'animation est purement CSS.
 */
export function SplitText({
  text,
  delay = 0,
  wordClassName = "",
}: {
  text: string;
  delay?: number;
  wordClassName?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="split-word">
              <span className={wordClassName} style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}>
                {word}
              </span>
            </span>
            {/* L'espace reste hors du masque inline-block, sinon il disparaît. */}
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  );
}
