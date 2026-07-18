import { site, siteSameAs } from "@/data/site";
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

/** Nodo LocalBusiness (senza @context) allineato a Google Business Profile. */
export function localBusinessNode(opts: {
  url: string;
  description?: string;
  name?: string;
}) {
  const { business } = site;
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}/#localbusiness`,
    name: opts.name ?? business.name,
    url: opts.url,
    image: `${site.url}/images/home/DSC7090-copia.jpg`,
    email: site.email,
    telephone: business.telephone,
    description: opts.description ?? site.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: business.address.addressRegion,
      addressCountry: business.address.addressCountry,
    },
    areaServed: business.areaServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    sameAs: siteSameAs(),
    priceRange: "€€",
  };
}

/** LocalBusiness standalone (pagine drone). */
export function localBusinessJsonLd(opts: {
  url: string;
  description?: string;
  name?: string;
}) {
  return {
    "@context": "https://schema.org",
    ...localBusinessNode(opts),
  };
}
