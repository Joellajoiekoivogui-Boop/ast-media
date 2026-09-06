import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteArticle } from "@/app/actions/articles";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Programmé",
  published: "Publié",
};

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, status, is_featured, view_count, published_at, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Nouvel article
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Titre</th>
              <th className="px-4 py-2 font-medium">Catégorie</th>
              <th className="px-4 py-2 font-medium">Statut</th>
              <th className="px-4 py-2 font-medium">Vues</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-t border-card-border">
                <td className="px-4 py-2 text-foreground">
                  {a.title}
                  {a.is_featured && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      À la une
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {(a.category as unknown as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{STATUS_LABEL[a.status]}</td>
                <td className="px-4 py-2 text-muted-foreground">{a.view_count}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {a.published_at ? formatDate(a.published_at) : "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="text-xs font-medium text-foreground hover:text-primary"
                    >
                      Modifier
                    </Link>
                    <form action={deleteArticle.bind(null, a.id)}>
                      <button type="submit" className="text-xs font-medium text-primary hover:underline">
                        Supprimer
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(articles ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Aucun article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
