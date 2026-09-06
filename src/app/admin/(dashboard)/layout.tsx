import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar fullName={profile.full_name} />
      <div className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</div>
    </div>
  );
}
