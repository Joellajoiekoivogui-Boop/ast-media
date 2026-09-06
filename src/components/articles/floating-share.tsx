"use client";

import { useState } from "react";

const ICON_PROPS = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "currentColor" } as const;

function WhatsAppIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4c-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.2-9.4L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.7L7.4 4h-1.8l12.1 16Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.6 15.4 6.9M8.6 13.4l6.8 3.7" />
    </svg>
  );
}

export function FloatingShare({
  url,
  title,
  variant = "vertical",
}: {
  url: string;
  title: string;
  variant?: "vertical" | "horizontal";
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — ignore
      }
    }
  }

  const btnClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-foreground-secondary transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:text-primary active:scale-95";

  const links = [
    { href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, label: "WhatsApp", icon: <WhatsAppIcon /> },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: "Facebook", icon: <FacebookIcon /> },
    { href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, label: "X", icon: <XIcon /> },
  ];

  return (
    <div
      className={
        variant === "vertical"
          ? "flex flex-col items-center gap-2"
          : "flex flex-wrap items-center gap-2"
      }
    >
      {variant === "horizontal" && (
        <span className="mr-1 text-sm font-medium text-muted-foreground">Partager :</span>
      )}
      {links.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className={btnClass}>
          {link.icon}
        </a>
      ))}
      <button type="button" onClick={handleCopy} aria-label="Copier le lien" className={btnClass}>
        <LinkIcon />
      </button>
      {variant === "horizontal" && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Partager"
          className={`${btnClass} lg:hidden`}
        >
          <ShareIcon />
        </button>
      )}

      {copied && (
        <div className="am-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
          Lien copié !
        </div>
      )}
    </div>
  );
}
