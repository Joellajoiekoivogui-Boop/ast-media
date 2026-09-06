"use client";

import { useSyncExternalStore } from "react";
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
    return <div className="h-9 w-9" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className="am-scale-in flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-card-border bg-card text-foreground transition-all duration-200 hover:-rotate-12 hover:scale-110 hover:bg-muted active:scale-95"
    >
      {isDark ? (
        <svg
          key="sun"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="am-scale-in"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          key="moon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="am-scale-in"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}
