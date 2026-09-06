import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function uploadImage(file: File, folder = "covers"): Promise<string> {
  const ext = ALLOWED[file.type];
  if (!ext) {
    throw new Error("Format d'image non autorisé (JPEG, PNG, WebP, AVIF ou GIF).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image trop volumineuse (5 Mo maximum).");
  }

  const supabase = createClient();
  const safeFolder = /^[a-z0-9_-]+$/i.test(folder) ? folder : "covers";
  const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("covers").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("covers").getPublicUrl(path);
  return data.publicUrl;
}
