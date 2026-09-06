import { getAllComments } from "@/lib/data/comments";
import { moderateComment } from "@/app/actions/comments";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  hidden: "Masqué",
  reported: "Signalé",
};

export default async function AdminCommentsPage() {
  const comments = await getAllComments();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-foreground">Commentaires</h1>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-card-border bg-card p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {comment.author_name}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  sur « {comment.article.title} » · {formatDate(comment.created_at)}
                </span>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {STATUS_LABEL[comment.status]}
                {comment.report_count > 0 && ` · ${comment.report_count} signalement(s)`}
              </span>
            </div>
            <p className="mb-3 text-sm text-foreground/90 whitespace-pre-wrap">{comment.body}</p>
            <div className="flex gap-3 text-xs font-medium">
              {comment.status !== "approved" && (
                <form action={moderateComment.bind(null, comment.id, "approve", comment.article.slug)}>
                  <button type="submit" className="text-green-600 hover:underline">
                    Approuver
                  </button>
                </form>
              )}
              {comment.status !== "hidden" && (
                <form action={moderateComment.bind(null, comment.id, "hide", comment.article.slug)}>
                  <button type="submit" className="text-foreground hover:underline">
                    Masquer
                  </button>
                </form>
              )}
              <form action={moderateComment.bind(null, comment.id, "delete", comment.article.slug)}>
                <button type="submit" className="text-primary hover:underline">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun commentaire.</p>
        )}
      </div>
    </div>
  );
}
