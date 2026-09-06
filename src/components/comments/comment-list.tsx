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
    <section id="commentaires" className="space-y-6">
      <h2 className="text-xl font-extrabold text-foreground">
        Commentaires ({comments.length})
      </h2>

      <CommentForm articleId={articleId} articleSlug={articleSlug} />

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
          <p className="text-sm text-muted-foreground">
            Soyez le premier à commenter cet article.
          </p>
        )}
      </div>
    </section>
  );
}
