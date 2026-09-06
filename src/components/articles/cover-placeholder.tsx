import { categoryColor } from "@/lib/category-colors";

export function CoverPlaceholder({ categoryName }: { categoryName: string }) {
  const color = categoryColor(categoryName);
  return (
    <div
      className="relative flex h-full w-full items-end justify-start p-3"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 55%, #0E141B 100%)`,
      }}
    >
      <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/85">
        AST Media
      </span>
    </div>
  );
}
