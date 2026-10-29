"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

/**
 * Inclinaison 3D + projecteur lumineux qui suit le curseur (souris uniquement).
 * Les valeurs passent par des variables CSS : aucun re-rendu React.
 */
export function Tilt({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.dataset.active = "";
      el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    delete el.dataset.active;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={`tilt spotlight ${className}`}>
      {children}
    </div>
  );
}
