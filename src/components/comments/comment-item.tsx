"use client";

import { useState } from "react";
import { formatDate, initials } from "@/lib/utils";
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
    <div className="sd-reveal space-y-3">
      <div className="glass rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-3">
          <Avatar name={comment.author_name} />
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">{comment.author_name}</span>
            <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground-secondary">{comment.body}</p>
        <div className="mt-4 flex gap-2 text-xs font-medium">
          <button
            onClick={() => setReplying((v) => !v)}
            className="rounded-full bg-foreground/5 px-3 py-1.5 text-foreground-secondary transition-colors hover:bg-foreground hover:text-background"
          >
            Répondre
          </button>
          <button
            onClick={async () => {
              await reportComment(comment.id);
              setReported(true);
            }}
            disabled={reported}
            className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
          >
            {reported ? "Signalé" : "Signaler"}
          </button>
        </div>
      </div>

      {replying && (
        <div className="rise ml-6 sm:ml-12">
          <CommentForm
            articleId={articleId}
            articleSlug={articleSlug}
            parentId={comment.id}
            onDone={() => setReplying(false)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l-2 border-card-border pl-4 sm:ml-12 sm:pl-6">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-3xl bg-foreground/[0.03] p-4">
              <div className="mb-2 flex items-center gap-3">
                <Avatar name={reply.author_name} small />
                <span className="text-sm font-semibold text-foreground">{reply.author_name}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {formatDate(reply.created_at)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground-secondary">{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <span className="bg-flame shrink-0 rounded-full p-[2px]">
      <span
        className={`flex items-center justify-center rounded-full bg-background font-bold text-foreground ${
          small ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-xs"
        }`}
      >
        {initials(name)}
      </span>
    </span>
  );
}
