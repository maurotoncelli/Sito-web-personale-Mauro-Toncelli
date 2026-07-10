export const locales = ["it", "en", "de", "fr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const localeLabels: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Sostituisce il prefisso lingua in un pathname (es. /it/servizi → /en/servizi). */
export function switchLocalePath(pathname: string, locale: Locale): string {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}
