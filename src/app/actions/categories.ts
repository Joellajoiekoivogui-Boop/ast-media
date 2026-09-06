"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: "Nom de catégorie invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
  });

  if (error) return { error: "Cette catégorie existe déjà." };
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { error: null };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}
