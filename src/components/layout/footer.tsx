import Link from "next/link";
import type { CSSProperties } from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { Magnetic } from "@/components/ui/magnetic";
import { BackToTop } from "./back-to-top";

const CATEGORY_LINKS = [
  { name: "Société", slug: "societe" },
  { name: "Politique", slug: "politique" },
  { name: "Sport", slug: "sport" },
  { name: "Culture", slug: "culture" },
  { name: "Économie", slug: "economie" },
  { name: "Technologie", slug: "technologie" },
];

const SOCIALS = [
  { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" /> },
  { href: SOCIAL_LINKS.x, label: "X", icon: <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.2-9.4L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.7L7.4 4h-1.8l12.1 16Z" /> },
  { href: SOCIAL_LINKS.whatsapp, label: "WhatsApp", icon: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4c-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" /> },
];

const WORDMARK = "AST MEDIA".split("");

export function Footer() {
  return (
    <footer className="mx-auto mt-32 w-full max-w-7xl px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-card-border bg-card px-6 pt-14 sm:px-12">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,#FF4D2E_0%,transparent_65%)] opacity-25" />

        <div className="relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-4xl font-bold leading-[0.95] text-foreground sm:text-6xl">
              L&apos;info qui compte,{" "}
              <span className="font-accent text-gradient">en direct.</span>
            </p>
            <p className="mt-5 max-w-md text-foreground-secondary">
              L&apos;actualité en Guinée et ailleurs : société, politique, sport, culture, économie
              et technologie.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="border-spin group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background"
                >
                  Suivre sur WhatsApp
                  <span className="bg-flame flex h-7 w-7 items-center justify-center rounded-full text-[#07070B] transition-transform duration-500 group-hover:rotate-45">
                    ↗
                  </span>
                </a>
              </Magnetic>
              {SOCIALS.map((s) => (
                <Magnetic key={s.label} strength={0.5}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border text-foreground transition-colors hover:border-transparent hover:bg-primary hover:text-primary-foreground"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      {s.icon}
                    </svg>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-6 lg:grid-cols-3">
            <div>
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Rubriques</h3>
              <ul className="space-y-2.5">
                {CATEGORY_LINKS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/categorie/${c.slug}`} className="group inline-flex items-center text-foreground-secondary transition-colors hover:text-foreground">
                      <span className="h-px w-0 bg-primary transition-all duration-500 group-hover:mr-2 group-hover:w-4" />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Le média</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/", label: "Accueil" },
                  { href: "/recherche", label: "Recherche" },
                  { href: "/admin/login", label: "Espace rédaction" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-center text-foreground-secondary transition-colors hover:text-foreground">
                      <span className="h-px w-0 bg-primary transition-all duration-500 group-hover:mr-2 group-hover:w-4" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Rédaction</h3>
              <p className="text-foreground-secondary">Conakry, Guinée</p>
              <p className="mt-1 text-foreground-secondary">7j/7 · 24h/24</p>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="font-display relative mb-6 mt-16 select-none whitespace-nowrap text-center text-[15vw] font-extrabold leading-[0.8] tracking-[-0.06em] lg:text-[13.5rem]"
        >
          {WORDMARK.map((ch, i) => (
            // Dégradé appliqué lettre par lettre (background-clip ne traverse pas
            // les inline-block animés), décalé pour rester continu sur le mot.
            <span
              key={i}
              className="sd-letter text-gradient"
              style={
                {
                  "--i": i,
                  backgroundSize: `${WORDMARK.length * 100}% 100%`,
                  backgroundPosition: `${(i / (WORDMARK.length - 1)) * 100}% 0`,
                } as CSSProperties
              }
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </p>

        <div className="relative flex flex-col items-center justify-between gap-4 border-t border-card-border py-6 sm:flex-row">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © {new Date().getFullYear()} AST Media · Tous droits réservés
          </span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
