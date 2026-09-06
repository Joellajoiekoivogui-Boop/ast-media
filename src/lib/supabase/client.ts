import { createBrowserClient } from "@supabase/ssr";

// No generic Database type here: our hand-written types.ts doesn't match the
// { Row, Insert, Update, Relationships } shape supabase-js expects for full
// type inference. Swap in `supabase gen types typescript` output once the
// project is provisioned, then reintroduce the generic.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
