"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const postCommentSchema = z.object({
  articleId: z.string().uuid(),
  articleSlug: z.string().min(1).max(200),
  parentId: z.string().uuid().nullable(),
  authorName: z.string().trim().min(2).max(80),
  authorEmail: z.string().trim().email().max(160).optional().or(z.literal("")),
  body: z.string().trim().min(2).max(4000),
  // honeypot: real users never fill this hidden field
  website: z.string().max(0).optional().or(z.literal("")),
});

export type PostCommentState = { success: boolean; error?: string } | null;

// Fenêtre minimale entre deux commentaires d'un même visiteur (anti-flood).
const COMMENT_COOLDOWN_MS = 30_000;

export async function postComment(
  _prevState: PostCommentState,
  formData: FormData
): Promise<PostCommentState> {
  const parsed = postCommentSchema.safeParse({
    articleId: formData.get("articleId"),
    articleSlug: formData.get("articleSlug"),
    parentId: formData.get("parentId") || null,
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail") || "",
    body: formData.get("body"),
    website: formData.get("website") || "",
  });

  if (!parsed.success) {
    return { success: false, error: "Formulaire invalide." };
  }
  if (parsed.data.website) {
    // honeypot triggered — pretend success, drop silently
    return { success: true };
  }

  const jar = await cookies();
  const last = Number(jar.get("ast_lc")?.value ?? 0);
  if (Date.now() - last < COMMENT_COOLDOWN_MS) {
    return { success: false, error: "Vous commentez trop vite, patientez un instant." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("post_comment", {
    p_article_id: parsed.data.articleId,
    p_parent_id: parsed.data.parentId,
    p_author_name: parsed.data.authorName,
    p_author_email: parsed.data.authorEmail || "",
    p_body: parsed.data.body,
  });

  if (error) {
    return { success: false, error: "Impossible d'enregistrer le commentaire." };
  }

  jar.set("ast_lc", String(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  revalidatePath(`/article/${parsed.data.articleSlug}`);
  return { success: true };
}

export async function reportComment(commentId: string) {
  const id = z.string().uuid().safeParse(commentId);
  if (!id.success) return;

  const jar = await cookies();
  const key = `ast_rc_${id.data.replace(/-/g, "")}`;
  if (jar.get(key)) return; // déjà signalé par ce visiteur

  const supabase = await createClient();
  await supabase.rpc("report_comment", { p_comment_id: id.data });

  jar.set(key, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });

  revalidatePath("/admin/comments");
}

export async function moderateComment(
  commentId: string,
  action: "approve" | "hide" | "delete",
  articleSlug: string
) {
  await requireAdmin();
  const supabase = await createClient();

  if (action === "delete") {
    await supabase.from("comments").delete().eq("id", commentId);
  } else {
    await supabase
      .from("comments")
      .update({ status: action === "approve" ? "approved" : "hidden" })
      .eq("id", commentId);
  }

  revalidatePath("/admin/comments");
  revalidatePath(`/article/${articleSlug}`);
}
