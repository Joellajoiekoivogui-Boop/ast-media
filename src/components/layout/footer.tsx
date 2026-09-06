import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/constants";

const CATEGORY_LINKS = [
  { name: "Société", slug: "societe" },
  { name: "Politique", slug: "politique" },
  { name: "Sport", slug: "sport" },
  { name: "Culture", slug: "culture" },
  { name: "Économie", slug: "economie" },
  { name: "Technologie", slug: "technologie" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-8 border-b border-white/10 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Image
              src="/logo-ast-media.png"
              alt="AST Media"
              width={219}
              height={279}
              className="h-20 w-auto"
            />
            <span className="text-xl font-extrabold tracking-tight">
              AST<span className="text-primary">.</span>MEDIA
            </span>
          </div>
          <p className="text-sm text-background/70">
            L&apos;actualité en Guinée et ailleurs : société, politique, sport, culture,
            économie et technologie.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-widest">Catégories</h3>
          <ul className="space-y-2 text-sm text-background/70">
            {CATEGORY_LINKS.map((c) => (
              <li key={c.slug}>
                <Link href={`/categorie/${c.slug}`} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-widest">Le média</h3>
          <ul className="space-y-2 text-sm text-background/70">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/recherche" className="transition-colors hover:text-primary">
                Recherche
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-widest">Suivez-nous</h3>
          <div className="flex gap-3">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:border-primary hover:bg-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.x}
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:border-primary hover:bg-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.2-9.4L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.7L7.4 4h-1.8l12.1 16Z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:border-primary hover:bg-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4c-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-background/60">
        © {new Date().getFullYear()} AST Media. Tous droits réservés.
      </div>
    </footer>
  );
}
