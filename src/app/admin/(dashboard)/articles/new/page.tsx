import { getCategories } from "@/lib/data/categories";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-foreground">Nouvel article</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
