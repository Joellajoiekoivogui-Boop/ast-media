import { ViewTransition } from "react";
import type { ArticleCardData } from "@/lib/data/articles";
import { CoverPlaceholder } from "./cover-placeholder";

/**
 * Image de couverture partagée entre la carte et la page article : React
 * <ViewTransition> la fait « voyager » d'une page à l'autre (même `name`).
 * Un même article ne doit apparaître qu'une fois par page avec `shared`.
 */
export function Cover({
  article,
  className = "",
  imgClassName = "",
  shared = true,
  priority = false,
}: {
  article: Pick<ArticleCardData, "id" | "title" | "cover_image_url" | "category">;
  className?: string;
  imgClassName?: string;
  shared?: boolean;
  priority?: boolean;
}) {
  const content = (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {article.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt=""
          loading={priority ? "eager" : "lazy"}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <CoverPlaceholder categoryName={article.category.name} />
      )}
    </div>
  );

  if (!shared) return content;
  return (
    <ViewTransition name={`cover-${article.id}`} share="morph" default="none">
      {content}
    </ViewTransition>
  );
}
