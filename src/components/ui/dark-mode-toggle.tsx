"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

// Renders false on the server and during the first client render (matching
// SSR output), then true after hydration — avoids a setState-in-effect while
// still deferring theme-dependent UI until the client has taken over.
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }

    // Origine du cercle : le clic, ou le centre du bouton au clavier.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.detail > 0 ? e.clientX : rect.left + rect.width / 2;
    const y = e.detail > 0 ? e.clientY : rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.dataset.vt = "theme";
    const transition = document.startViewTransition(() => flushSync(apply));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    transition.finished.finally(() => {
      delete root.dataset.vt;
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-foreground transition-colors hover:bg-foreground/10"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`absolute transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`absolute transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
