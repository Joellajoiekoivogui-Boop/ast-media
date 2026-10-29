"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

/** Attire légèrement son contenu vers le curseur, puis revient avec un ressort. */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function handleMove(e: PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transition = "transform 0.15s ease-out";
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "translate(0, 0)";
  }

  return (
    <span ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
