import { categoryColor } from "@/lib/category-colors";

export function CategoryChip({ name, glass = false }: { name: string; glass?: boolean }) {
  const color = categoryColor(name);
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
        glass ? "glass text-foreground" : "text-foreground-secondary"
      }`}
      style={glass ? undefined : { backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      {name}
    </span>
  );
}
