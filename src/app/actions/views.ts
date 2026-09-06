"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const COOKIE = "ast_seen";
const MAX_TRACKED = 60;

export async function incrementView(slug: string) {
  // `slug` provient du client : on le normalise et on le borne.
  const parsed = z.string().min(1).max(200).safeParse(slug);
  if (!parsed.success) return;
  const safeSlug = slugify(parsed.data);
  if (!safeSlug) return;

  const jar = await cookies();
  const seen = (jar.get(COOKIE)?.value ?? "").split(",").filter(Boolean);
  if (seen.includes(safeSlug)) return; // déjà comptabilisé pour ce visiteur

  const supabase = await createClient();
  await supabase.rpc("increment_article_view", { p_slug: safeSlug });

  const next = [safeSlug, ...seen].slice(0, MAX_TRACKED);
  jar.set(COOKIE, next.join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
