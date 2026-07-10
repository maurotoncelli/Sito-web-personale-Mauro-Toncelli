import { defaultLocale, locales } from "@/i18n/config";

/**
 * Canonical + hreflang per una pagina (path senza prefisso lingua, es. "/servizi/moda").
 * metadataBase è impostato nel layout, quindi bastano i percorsi relativi.
 */
export function pageAlternates(locale: string, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${defaultLocale}${path}`,
    },
  };
}
