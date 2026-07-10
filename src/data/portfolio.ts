import media from "./media.json";

export type MediaItem = { src: string; width: number; height: number; title?: string };

const groups = media as Record<string, MediaItem[]>;

export function mediaGroup(key: string): MediaItem[] {
  return groups[key] ?? [];
}

export type PortfolioCategory = {
  slug: string;
  /** true = categoria di primo livello (lavoro forte), false = tag/nicchia */
  primary: boolean;
  /** gruppi di media.json che compongono la gallery (uniti in ordine) */
  mediaKeys: string[];
  /** copertina esplicita (default: prima immagine del primo gruppo) */
  cover?: string;
};

/**
 * Ordine per forza attuale (blueprint §4): Moda → E-commerce → Architettura.
 * Le etichette e descrizioni localizzate vivono in src/i18n/messages/.
 * Architettura & Interni ingloba interior design e hospitality (meno filtri,
 * meno confusione); Punti vendita resta separato.
 */
export const portfolioCategories: PortfolioCategory[] = [
  {
    slug: "moda",
    primary: true,
    mediaKeys: ["portfolio/moda"],
    // ragazza in total white sulle rocce bianche (come cover servizio e hero)
    cover: "/images/portfolio/moda/DSC7090-copia.jpg",
  },
  { slug: "e-commerce", primary: true, mediaKeys: ["portfolio/e-commerce"] },
  {
    slug: "architettura-interni",
    primary: true,
    mediaKeys: ["portfolio/architettura", "portfolio/interior", "portfolio/hospitality"],
  },
  { slug: "real-estate", primary: true, mediaKeys: ["portfolio/real-estate"] },
  { slug: "prodotto", primary: true, mediaKeys: ["portfolio/prodotto"] },
  { slug: "negozi", primary: false, mediaKeys: ["portfolio/negozi"] },
  { slug: "corporate", primary: false, mediaKeys: ["portfolio/corporate"] },
  { slug: "food", primary: false, mediaKeys: ["portfolio/food"] },
  { slug: "eventi", primary: false, mediaKeys: ["portfolio/eventi"] },
  { slug: "matrimonio", primary: false, mediaKeys: ["portfolio/matrimonio"] },
  { slug: "coppia", primary: false, mediaKeys: ["portfolio/coppia"] },
  { slug: "maternita", primary: false, mediaKeys: ["portfolio/maternita"] },
];

export function categoryBySlug(slug: string) {
  return portfolioCategories.find((c) => c.slug === slug);
}
