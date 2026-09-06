"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCategory } from "@/app/actions/categories";

type State = { error: string | null } | null;

export function CategoryForm() {
  const [state, action, pending] = useActionState<State, FormData>(
    async (_prev, formData) => createCategory(formData),
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.error) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex gap-2">
      <input
        type="text"
        name="name"
        required
        minLength={2}
        placeholder="Nouvelle catégorie (ex. Santé)"
        className="flex-1 rounded-md border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        Ajouter
      </button>
      {state?.error && <span className="self-center text-sm text-primary">{state.error}</span>}
    </form>
  );
}
