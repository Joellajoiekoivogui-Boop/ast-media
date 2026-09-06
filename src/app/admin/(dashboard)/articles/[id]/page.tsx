import { notFound } from "next/navigation";
import { getCategories } from "@/lib/data/categories";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import { ArticleForm } from "@/components/admin/article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, article] = await Promise.all([
    getCategories(),
    getArticleByIdForAdmin(id),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-foreground">Modifier l&apos;article</h1>
      <ArticleForm categories={categories} article={article} />
    </div>
  );
}
