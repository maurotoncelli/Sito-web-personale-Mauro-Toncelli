"use client";

import { openConsentBanner } from "@/lib/consent";

/** Riapre il cookie banner dal footer (richiesto dal GDPR: revoca del consenso). */
export function CookiePrefsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openConsentBanner}
      className="text-[13px] font-medium tracking-[0.1em] uppercase text-muted transition-colors hover:text-foreground text-left"
    >
      {label}
    </button>
  );
}
