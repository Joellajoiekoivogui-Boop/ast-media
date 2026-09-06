import { categoryColor } from "@/lib/category-colors";

export function CategoryChip({ name }: { name: string }) {
  return (
    <span
      className="inline-flex w-fit items-center gap-1 rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white"
      style={{ backgroundColor: categoryColor(name) }}
    >
      {name}
    </span>
  );
}
