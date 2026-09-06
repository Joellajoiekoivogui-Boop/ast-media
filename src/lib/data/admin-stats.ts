import { createClient } from "@/lib/supabase/server";

export interface AdminStats {
  publishedCount: number;
  draftCount: number;
  commentCount: number;
  totalViews: number;
  topArticles: { title: string; view_count: number }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [published, draft, comments, topArticles, allViews] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("title, view_count")
      .eq("status", "published")
      .order("view_count", { ascending: false })
      .limit(5),
    supabase.from("articles").select("view_count").eq("status", "published"),
  ]);

  const totalViews = (allViews.data ?? []).reduce((sum, a) => sum + (a.view_count ?? 0), 0);

  return {
    publishedCount: published.count ?? 0,
    draftCount: draft.count ?? 0,
    commentCount: comments.count ?? 0,
    totalViews,
    topArticles: topArticles.data ?? [],
  };
}
