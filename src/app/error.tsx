"use client";

import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-xl font-bold">Une erreur est survenue</h1>
      <p className="text-sm text-gray-500">Veuillez réessayer ou consulter les journaux du serveur.</p>
    </div>
  );
}
