"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/comments", label: "Commentaires" },
];

export function AdminSidebar({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col bg-foreground p-4 text-background md:h-screen md:w-60">
      <div className="mb-6">
        <p className="text-lg font-extrabold tracking-tight">
          AST<span className="text-primary">.</span>MEDIA
        </p>
        <p className="text-xs uppercase tracking-widest text-background/60">Administration</p>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${
                active ? "bg-primary text-primary-foreground" : "text-background/75 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="mb-2 truncate text-xs text-background/60">{fullName}</p>
        <button
          onClick={handleLogout}
          className="w-full rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-background hover:bg-white/10"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
