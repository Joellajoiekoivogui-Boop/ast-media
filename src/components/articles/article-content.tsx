import sanitizeHtml from "sanitize-html";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { tiptapExtensions } from "@/lib/tiptap-extensions";
import type { JSONContent } from "@tiptap/core";

// Le contenu est rédigé par la rédaction via TipTap, mais on ne fait jamais
// confiance à du HTML injecté dans `dangerouslySetInnerHTML` : allow-list stricte.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "blockquote", "pre", "code", "span",
    "strong", "b", "em", "i", "s", "u", "mark", "sub", "sup",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["class"],
    code: ["class"],
    "*": [],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "nofollow noopener noreferrer",
    }),
  },
};

export function ArticleContent({ content }: { content: JSONContent }) {
  const rendered = renderToHTMLString({ content, extensions: tiptapExtensions });
  const html = sanitizeHtml(rendered, SANITIZE_OPTIONS);

  return (
    <div
      className="prose-article max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
