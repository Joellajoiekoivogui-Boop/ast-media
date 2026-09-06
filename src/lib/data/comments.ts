import { createClient } from "@/lib/supabase/server";
import type { Comment } from "@/lib/supabase/types";

export async function getApprovedComments(articleId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("id, article_id, parent_id, author_name, body, status, report_count, created_at")
    .eq("article_id", articleId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getAllComments(): Promise<
  (Comment & { article: { title: string; slug: string } })[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, article:articles(title, slug)")
    .order("created_at", { ascending: false });
  return (data as unknown as (Comment & { article: { title: string; slug: string } })[]) ?? [];
}
