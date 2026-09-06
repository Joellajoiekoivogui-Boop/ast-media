export const CATEGORY_COLORS: Record<string, string> = {
  "Société": "#CE1126",
  "Politique": "#1F4E79",
  "Sport": "#009460",
  "Culture": "#8E44AD",
  "Économie": "#B7791F",
  "Technologie": "#0E7490",
  "Éducation": "#C2410C",
  "Santé": "#0F766E",
  "International": "#374151",
};

export function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? "#CE1126";
}
