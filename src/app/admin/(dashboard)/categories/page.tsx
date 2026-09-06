import { getCategories } from "@/lib/data/categories";
import { deleteCategory } from "@/app/actions/categories";
import { CategoryForm } from "@/components/admin/category-form";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-foreground">Catégories</h1>

      <CategoryForm />

      <div className="overflow-hidden rounded-xl border border-card-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Nom</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-card-border">
                <td className="px-4 py-2 text-foreground">{cat.name}</td>
                <td className="px-4 py-2 text-muted-foreground">/{cat.slug}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteCategory.bind(null, cat.id)}>
                    <button type="submit" className="text-xs font-medium text-primary hover:underline">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  Aucune catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
