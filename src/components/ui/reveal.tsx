"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  stagger = false,
  className = "",
}: {
  children: ReactNode;
  stagger?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("am-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${stagger ? "am-reveal-stagger" : "am-reveal"} ${className}`}>
      {children}
    </div>
  );
}
