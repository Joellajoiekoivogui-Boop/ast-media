import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}
