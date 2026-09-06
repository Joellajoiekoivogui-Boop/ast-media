import { SITE_NAME } from "@/lib/constants";

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-extrabold">{SITE_NAME} — Configuration requise</h1>
      <p className="mb-6 text-sm text-gray-500">
        Le site est prêt, mais il n&apos;est pas encore connecté à une base Supabase. Suivez ces
        étapes pour terminer la configuration :
      </p>
      <ol className="list-decimal space-y-3 pl-5 text-sm">
        <li>
          Créez un projet gratuit sur{" "}
          <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline">
            supabase.com
          </a>
          .
        </li>
        <li>
          Dans <strong>Project Settings → API</strong>, copiez l&apos;URL du projet, la clé{" "}
          <code>anon public</code> et la clé <code>service_role</code>.
        </li>
        <li>
          Collez-les dans le fichier <code>ast-media/.env.local</code> (voir{" "}
          <code>.env.local.example</code>) :
          <pre className="mt-2 overflow-x-auto rounded-md bg-black/5 p-3 text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...`}
          </pre>
        </li>
        <li>
          Ouvrez l&apos;éditeur SQL de Supabase et exécutez, dans l&apos;ordre, les fichiers du
          dossier <code>supabase/migrations/</code> (0001, 0002, 0003, 0004), puis{" "}
          <code>supabase/seed.sql</code>.
        </li>
        <li>
          Créez le premier utilisateur admin dans <strong>Authentication → Users</strong>, puis
          liez-le à <code>public.profiles</code> avec <code>role=&apos;admin&apos;</code>.
        </li>
        <li>Redémarrez le serveur (<code>npm run dev</code>) — cette page redirigera automatiquement vers l&apos;accueil.</li>
      </ol>
    </div>
  );
}
