"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import type { Messages } from "@/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { SocialIcons } from "./SocialIcons";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({
  locale,
  nav,
  languageLabel,
}: {
  locale: string;
  nav: Messages["nav"];
  languageLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Chiude il menu mobile al cambio pagina (state adjustment durante il render)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const items = [
    { href: `/${locale}/portfolio`, label: nav.portfolio },
    { href: `/${locale}/servizi`, label: nav.services },
    { href: `/${locale}/journal`, label: nav.journal },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contatti`, label: nav.contact },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Fascia ampia con menu centrato, come il tema attuale */}
      <div className="relative mx-auto flex h-[84px] max-w-[1400px] items-center justify-between px-5 md:h-[104px] md:px-8">
        {/* Logo: due righe, extra bold, come tema attuale */}
        <Link
          href={`/${locale}`}
          className="max-w-[7.5em] text-[1.35rem] font-extrabold uppercase leading-[1.05] tracking-[0.01em]"
        >
          {site.name}
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
          aria-label="Principale"
        >
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-semibold tracking-[0.1em] uppercase text-foreground transition-opacity hover:opacity-70 ${
                  active ? "underline decoration-wavy decoration-1 underline-offset-[6px]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <SocialIcons />
          <LanguageSwitcher locale={locale} label={languageLabel} />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher locale={locale} label={languageLabel} />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-6 bg-foreground transition-transform ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-foreground transition-transform ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        // absolute top-full (non fixed): il backdrop-blur dell'header crea un
        // containing block che su iOS àncora i `fixed` all'header stesso,
        // facendo collassare il pannello. Altezza esplicita in dvh.
        <nav
          className="absolute inset-x-0 top-full z-40 flex h-[calc(100dvh-84px)] flex-col gap-2 overflow-y-auto bg-background px-8 py-10 md:hidden"
          aria-label="Menu mobile"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-border py-4 text-xl font-semibold tracking-[0.1em] uppercase"
            >
              {item.label}
            </Link>
          ))}
          <SocialIcons className="mt-8" />
        </nav>
      )}
    </header>
  );
}
