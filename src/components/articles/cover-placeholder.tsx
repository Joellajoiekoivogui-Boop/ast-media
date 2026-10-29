import { categoryColor } from "@/lib/category-colors";

/** Visuel de repli : dégradé maillé aux couleurs de la rubrique. */
export function CoverPlaceholder({ categoryName }: { categoryName: string }) {
  const color = categoryColor(categoryName);
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, ${color} 0%, transparent 55%), radial-gradient(90% 80% at 100% 100%, #6A4DFF 0%, transparent 60%), #0B0B12`,
      }}
    >
      <span className="font-display absolute -bottom-10 -right-2 text-[12rem] font-extrabold leading-none text-white/10">
        {categoryName.charAt(0)}
      </span>
    </div>
  );
}
