"use client";

import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-gradient mb-4 text-8xl font-extrabold leading-none">Oups</p>
      <h1 className="font-display mb-2 text-3xl font-bold">Une erreur est survenue</h1>
      <p className="text-muted-foreground">Veuillez réessayer ou consulter les journaux du serveur.</p>
    </div>
  );
}
