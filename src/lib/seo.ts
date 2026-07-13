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

/** Tronca una descrizione alla lunghezza SEO consigliata, a fine parola. */
export function metaDescription(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
