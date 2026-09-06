"use server";

import { searchArticles, type ArticleCardData } from "@/lib/data/articles";

export async function quickSearch(query: string): Promise<ArticleCardData[]> {
  if (typeof query !== "string") return [];
  const results = await searchArticles(query.slice(0, 120));
  return results.slice(0, 6);
}
