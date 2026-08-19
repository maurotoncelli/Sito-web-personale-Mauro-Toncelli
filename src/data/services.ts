/**
 * Dati strutturali dei servizi (blueprint §7). I testi localizzati
 * (nome, claim, descrizione, deliverable) vivono in src/i18n/messages/.
 */
export type TierId = "intimate" | "essential" | "signature" | "grand";

export type Service = {
  slug: string;
  /** immagine di anteprima nella pagina indice (default: prima della gallery) */
  cover?: string;
  /** chiavi di media.json per la gallery mista; vuoto = niente gallery (blueprint §5) */
  galleryKeys: string[];
  /** slug delle categorie portfolio collegate (solo se c'è lavoro vero) */
  portfolioSlugs: string[];
  pricing:
    | { type: "quote" }
    | { type: "from"; from: string }
    | { type: "tiers"; tiers: { id: TierId; name: string; price: string }[] };
};

export const services: Service[] = [
  {
    slug: "moda",
    // ragazza in total white davanti alle rocce bianche (scelta esplicita)
    cover: "/images/portfolio/moda/DSC7090-copia.jpg",
    galleryKeys: ["portfolio/moda"],
    portfolioSlugs: ["moda"],
    pricing: { type: "quote" },
  },
  {
    slug: "e-commerce-prodotto",
    // scatto pubblicitario sneakers Versace: quadrato, resa piena nel box 4:3
    cover: "/images/portfolio/e-commerce/ecommerce-sneakers-argento.jpg",
    galleryKeys: ["portfolio/e-commerce", "portfolio/prodotto"],
    portfolioSlugs: ["e-commerce", "prodotto"],
    pricing: { type: "quote" },
  },
  {
    slug: "architettura-interni",
    galleryKeys: [
      "portfolio/architettura",
      "portfolio/interior",
      "portfolio/real-estate",
      "portfolio/hospitality",
      "portfolio/negozi",
    ],
    portfolioSlugs: ["architettura-interni", "real-estate", "negozi"],
    pricing: { type: "quote" },
  },
  {
    slug: "corporate-brand",
    cover: "/images/portfolio/corporate/Corporate-photography10-copia.jpg",
    galleryKeys: ["portfolio/corporate"],
    portfolioSlugs: ["corporate"],
    pricing: { type: "quote" },
  },
  {
    slug: "matrimoni",
    cover: "/images/home/M.C.-Weddings-Castelfalfi-Maurotoncelli11.jpg",
    galleryKeys: ["portfolio/matrimonio"],
    portfolioSlugs: ["matrimonio"],
    pricing: {
      type: "tiers",
      tiers: [
        { id: "intimate", name: "Intimate", price: "€800" },
        { id: "essential", name: "Essential", price: "€1.200" },
        { id: "signature", name: "Signature", price: "€2.800" },
        { id: "grand", name: "Grand", price: "€4.500" },
      ],
    },
  },
  {
    slug: "eventi",
    galleryKeys: ["portfolio/eventi"],
    portfolioSlugs: ["eventi"],
    pricing: { type: "quote" },
  },
];

export const droneServiceSlugs = ["ispezioni", "sal-cantiere", "rilievi", "perizie"] as const;
export type DroneSlug = (typeof droneServiceSlugs)[number];

export function serviceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
