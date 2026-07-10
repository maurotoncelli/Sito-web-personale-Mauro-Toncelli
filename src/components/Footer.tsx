import Link from "next/link";
import { site } from "@/data/site";
import type { Messages } from "@/i18n";
import { SocialIcons } from "./SocialIcons";
import { CookiePrefsLink } from "./CookiePrefsLink";

export function Footer({
  locale,
  nav,
  claim,
  locations,
  droneLink,
  proofLink,
  cookiePrefsLabel,
}: {
  locale: string;
  nav: Messages["nav"];
  claim: string;
  locations: string;
  droneLink: string;
  proofLink: string;
  cookiePrefsLabel: string;
}) {
  const items = [
    { href: `/${locale}/portfolio`, label: nav.portfolio },
    { href: `/${locale}/servizi`, label: nav.services },
    { href: `/${locale}/journal`, label: nav.journal },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contatti`, label: nav.contact },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="max-w-[7.5em] text-xl font-extrabold uppercase leading-[1.05]">{site.name}</p>
          <p className="mt-3 text-sm text-muted">{claim}</p>
          <p className="mt-4 text-sm text-muted">{locations}</p>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Footer">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium tracking-[0.1em] uppercase text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/servizi/drone`}
            className="text-[13px] font-medium tracking-[0.1em] uppercase text-muted transition-colors hover:text-foreground"
          >
            {droneLink}
          </Link>
          <Link
            href={`/${locale}/proof`}
            className="text-[13px] font-medium tracking-[0.1em] uppercase text-muted transition-colors hover:text-foreground"
          >
            {proofLink}
          </Link>
          <CookiePrefsLink label={cookiePrefsLabel} />
        </nav>

        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            {site.email}
          </a>
          <SocialIcons />
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name} — Photographer & Videomaker
      </div>
    </footer>
  );
}
