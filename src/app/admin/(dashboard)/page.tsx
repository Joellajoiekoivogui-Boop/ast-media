import { StatCard } from "@/components/admin/stat-card";
import { ArticlesChart } from "@/components/admin/articles-chart";
import { getAdminStats } from "@/lib/data/admin-stats";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-foreground">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Articles publiés" value={stats.publishedCount} />
        <StatCard label="Brouillons" value={stats.draftCount} />
        <StatCard label="Commentaires" value={stats.commentCount} />
        <StatCard label="Vues totales" value={stats.totalViews} />
      </div>

      <div className="rounded-xl border border-card-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Articles les plus consultés
        </h2>
        <ArticlesChart data={stats.topArticles} />
      </div>
    </div>
  );
}
