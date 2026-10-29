// Teintes vives, lisibles sur fond sombre comme sur fond clair.
export const CATEGORY_COLORS: Record<string, string> = {
  "Société": "#FF5533",
  "Politique": "#4D7CFF",
  "Sport": "#16C79A",
  "Culture": "#B468FF",
  "Économie": "#F5A100",
  "Technologie": "#16B8E0",
  "Éducation": "#FF7A3D",
  "Santé": "#1FC7B6",
  "International": "#9A9AAE",
};

export function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? "#FF5533";
}
