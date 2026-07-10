"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeLabels, switchLocalePath, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale, label }: { locale: string; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);

  // Chiude il menu al cambio pagina (state adjustment durante il render)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="flex items-center gap-1 text-[13px] font-medium tracking-[0.1em] uppercase text-muted transition-colors hover:text-foreground"
      >
        {locale}
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M1 3l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 mt-2 min-w-32 border border-border bg-background py-1 shadow-lg">
          {locales.map((l: Locale) => (
            <li key={l}>
              <Link
                href={switchLocalePath(pathname, l)}
                className={`block px-4 py-1.5 text-sm transition-colors hover:bg-surface ${
                  l === locale ? "text-foreground font-medium" : "text-muted"
                }`}
              >
                {localeLabels[l]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
