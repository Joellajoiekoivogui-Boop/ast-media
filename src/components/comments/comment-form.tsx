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
      <div className="pop glass flex items-center gap-3 rounded-3xl px-5 py-4 text-sm text-foreground">
        <span className="bg-flame flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#07070B]">✓</span>
        Merci ! Votre commentaire sera publié après validation par la rédaction.
      </div>
    );
  }

  const field =
    "peer w-full rounded-2xl border border-card-border bg-background/60 px-4 pb-2.5 pt-6 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-transparent focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)]";
  const label =
    "pointer-events-none absolute left-4 top-4 origin-left text-[15px] text-muted-foreground transition-all duration-300 [transition-timing-function:var(--ease-out)] peer-focus:top-2 peer-focus:scale-75 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75";

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
        <label className="relative block">
          <input type="text" name="authorName" placeholder="Votre nom" required minLength={2} className={field} />
          <span className={label}>Votre nom</span>
        </label>
        <label className="relative block">
          <input type="email" name="authorEmail" placeholder="E-mail (optionnel)" className={field} />
          <span className={label}>E-mail (optionnel)</span>
        </label>
      </div>
      <label className="relative block">
        <textarea
          name="body"
          placeholder={parentId ? "Votre réponse" : "Votre commentaire"}
          required
          minLength={2}
          rows={4}
          className={`${field} resize-y`}
        />
        <span className={label}>{parentId ? "Votre réponse" : "Votre commentaire"}</span>
      </label>

      {state?.error && <p className="text-sm text-primary">{state.error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground py-2 pl-6 pr-2 text-sm font-semibold text-background transition-transform active:scale-95 disabled:opacity-60"
        >
          {pending ? "Envoi…" : parentId ? "Répondre" : "Publier"}
          <span className="bg-flame flex h-9 w-9 items-center justify-center rounded-full text-[#07070B] transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:rotate-[-45deg]">
            {pending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#07070B] border-t-transparent" />
            ) : (
              "→"
            )}
          </span>
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
