import type { Service } from "@/data/services";
import type { VideoItem } from "@/data/videos";
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

/** VideoObject per clip self-hosted (home / gallery). */
export function videoObjectsJsonLd(items: VideoItem[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map((v) => ({
      "@type": "VideoObject",
      name: `${v.client} — ${v.title}`,
      description: `${v.title} · ${v.client}. ${site.business.name}.`,
      thumbnailUrl: `${site.url}${v.poster}`,
      contentUrl: `${site.url}${v.src}`,
      embedUrl: `${site.url}/${locale}#video`,
      uploadDate: "2024-06-01",
      publisher: {
        "@type": "Organization",
        name: site.business.name,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/icon.png`,
        },
      },
    })),
  };
}

type ServiceOfferInput = {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string[];
  pricing?: Service["pricing"];
  fromPrefix?: string;
  onQuoteLabel?: string;
};

/** Service arricchito con provider LocalBusiness e offers. */
export function serviceJsonLd(input: ServiceOfferInput) {
  const area = (input.areaServed ?? ["Europa", "Italia", "Svizzera"]).map((name) => ({
    "@type": "Place" as const,
    name,
  }));

  type OfferLd = Record<string, string | number>;
  let offers: OfferLd | undefined;

  if (input.pricing?.type === "from") {
    const n = input.pricing.from.replace(/[^\d]/g, "");
    offers = {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: input.fromPrefix
        ? `${input.fromPrefix} ${input.pricing.from}`
        : input.pricing.from,
    };
    if (n) offers.price = n;
  } else if (input.pricing?.type === "tiers") {
    const prices = input.pricing.tiers
      .map((t) => t.price.replace(/[^\d]/g, ""))
      .filter(Boolean)
      .map(Number);
    offers = {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      offerCount: input.pricing.tiers.length,
      description: input.pricing.tiers.map((t) => `${t.name}: ${t.price}`).join(" · "),
    };
    if (prices.length) offers.lowPrice = String(Math.min(...prices));
  } else if (input.pricing?.type === "quote" || input.onQuoteLabel) {
    offers = {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: input.onQuoteLabel ?? "On request",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? input.name,
    url: input.url,
    provider: { "@id": `${site.url}/#localbusiness` },
    areaServed: area,
    ...(offers ? { offers } : {}),
  };
}
