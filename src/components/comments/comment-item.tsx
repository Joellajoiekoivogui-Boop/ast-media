"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { reportComment } from "@/app/actions/comments";
import { CommentForm } from "./comment-form";
import type { Comment } from "@/lib/supabase/types";

export function CommentItem({
  comment,
  replies,
  articleId,
  articleSlug,
}: {
  comment: Comment;
  replies: Comment[];
  articleId: string;
  articleSlug: string;
}) {
  const [replying, setReplying] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-card-border bg-card p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{comment.author_name}</span>
          <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.body}</p>
        <div className="mt-2 flex gap-4 text-xs font-medium text-muted-foreground">
          <button onClick={() => setReplying((v) => !v)} className="hover:text-primary">
            Répondre
          </button>
          <button
            onClick={async () => {
              await reportComment(comment.id);
              setReported(true);
            }}
            disabled={reported}
            className="hover:text-primary disabled:opacity-50"
          >
            {reported ? "Signalé" : "Signaler"}
          </button>
        </div>
      </div>

      {replying && (
        <div className="ml-6">
          <CommentForm
            articleId={articleId}
            articleSlug={articleSlug}
            parentId={comment.id}
            onDone={() => setReplying(false)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l border-card-border pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border border-card-border bg-card p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {reply.author_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(reply.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
