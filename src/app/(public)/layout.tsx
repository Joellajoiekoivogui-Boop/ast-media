import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grain flex min-h-full flex-1 flex-col">
      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <Header />
      {/* overflow-x: clip (et non hidden) : coupe les bandeaux inclinés sans casser les éléments sticky */}
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
