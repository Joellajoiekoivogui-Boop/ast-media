"use client";

import { useActionState, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { createArticle, updateArticle } from "@/app/actions/articles";
import { TiptapEditor } from "./tiptap-editor";
import { ImageUpload } from "./image-upload";
import type { Category, Tag } from "@/lib/supabase/types";
import type { ArticleDetail } from "@/lib/data/articles";

type FormState = { error: string | null } | null;

export function ArticleForm({
  categories,
  article,
}: {
  categories: Category[];
  article?: ArticleDetail & { tags: Tag[] };
}) {
  const isEditing = Boolean(article);
  const boundAction = isEditing
    ? (_prev: FormState, formData: FormData) => updateArticle(article!.id, formData)
    : (_prev: FormState, formData: FormData) => createArticle(formData);

  const [state, action, pending] = useActionState<FormState, FormData>(boundAction, null);

  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url ?? "");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">(
    article?.status ?? "draft"
  );
  const contentRef = useRef<JSONContent>(article?.content ?? { type: "doc", content: [] });
  const contentInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (contentInputRef.current) {
      contentInputRef.current.value = JSON.stringify(contentRef.current);
    }
  }

  const defaultScheduledAt = article?.published_at
    ? new Date(article.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <form action={action} onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <input ref={contentInputRef} type="hidden" name="content" />

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Titre</label>
        <input
          type="text"
          name="title"
          required
          minLength={3}
          defaultValue={article?.title}
          className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Résumé</label>
        <textarea
          name="excerpt"
          required
          minLength={10}
          maxLength={300}
          rows={3}
          defaultValue={article?.excerpt}
          className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Catégorie</label>
          <select
            name="categoryId"
            required
            defaultValue={article?.category_id}
            className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="" disabled>
              Choisir…
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Mots-clés (séparés par des virgules)
          </label>
          <input
            type="text"
            name="tags"
            defaultValue={article?.tags.map((t) => t.name).join(", ")}
            placeholder="guinée, élections, économie"
            className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Image de couverture
        </label>
        <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
        <ImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Contenu</label>
        <TiptapEditor
          initialContent={article?.content}
          onChange={(json) => {
            contentRef.current = json;
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Statut</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="draft">Brouillon</option>
            <option value="scheduled">Programmé</option>
            <option value="published">Publié</option>
          </select>
        </div>
        {status === "scheduled" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Date de publication
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              required
              defaultValue={defaultScheduledAt}
              className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input type="checkbox" name="isFeatured" defaultChecked={article?.is_featured} />
        Mettre à la une
      </label>

      {state?.error && <p className="text-sm text-primary">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : isEditing ? "Mettre à jour" : "Créer l'article"}
      </button>
    </form>
  );
}
