"use client";

import { useActionState, useEffect, useRef } from "react";
import { postComment, type PostCommentState } from "@/app/actions/comments";

export function CommentForm({
  articleId,
  articleSlug,
  parentId = null,
  onDone,
}: {
  articleId: string;
  articleSlug: string;
  parentId?: string | null;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState<PostCommentState, FormData>(
    postComment,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      const t = setTimeout(() => onDone?.(), 2500);
      return () => clearTimeout(t);
    }
  }, [state, onDone]);

  if (state?.success) {
    return (
      <p className="rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground">
        Merci ! Votre commentaire sera publié après validation par la rédaction.
      </p>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="articleSlug" value={articleSlug} />
      <input type="hidden" name="parentId" value={parentId ?? ""} />
      <div className="hidden" aria-hidden>
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="authorName"
          placeholder="Votre nom"
          required
          minLength={2}
          className="rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
        <input
          type="email"
          name="authorEmail"
          placeholder="Votre e-mail (optionnel)"
          className="rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>
      <textarea
        name="body"
        placeholder={parentId ? "Écrire une réponse…" : "Écrire un commentaire…"}
        required
        minLength={2}
        rows={3}
        className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />

      {state?.error && <p className="text-sm text-primary">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Envoi…" : parentId ? "Répondre" : "Publier le commentaire"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
