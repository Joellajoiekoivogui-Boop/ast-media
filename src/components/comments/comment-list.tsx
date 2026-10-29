import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import type { Comment } from "@/lib/supabase/types";

export function CommentList({
  comments,
  articleId,
  articleSlug,
}: {
  comments: Comment[];
  articleId: string;
  articleSlug: string;
}) {
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parent_id) {
      repliesByParent.set(c.parent_id, [...(repliesByParent.get(c.parent_id) ?? []), c]);
    }
  }

  return (
    <section id="commentaires" className="scroll-mt-28 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-4xl font-bold leading-none text-foreground sm:text-5xl">
          Le <span className="font-accent text-gradient pr-1">débat</span>
        </h2>
        <span className="glass rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground-secondary">
          {comments.length} commentaire{comments.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="border-spin rounded-[2rem] bg-card p-5 sm:p-6">
        <CommentForm articleId={articleId} articleSlug={articleSlug} />
      </div>

      <div className="space-y-5">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={repliesByParent.get(comment.id) ?? []}
            articleId={articleId}
            articleSlug={articleSlug}
          />
        ))}
        {topLevel.length === 0 && (
          <p className="py-6 text-center text-muted-foreground">
            Soyez le premier à commenter cet article.
          </p>
        )}
      </div>
    </section>
  );
}
