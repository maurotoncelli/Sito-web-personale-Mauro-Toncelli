/**
 * Slide della hero (blueprint: ordine per forza — Moda, E-commerce,
 * Architettura; media misti immagini + clip video mute in loop).
 * I titoli localizzati arrivano dalle etichette delle categorie portfolio.
 */
export type HeroSlideDef = {
  /** immagine (o poster, se c'è video) */
  src: string;
  /** crop verticale 9:16 art-directed per mobile (blueprint: spec Home & slider) */
  srcMobile?: string;
  /** clip video muta in loop (blueprint: spec Home & slider) */
  video?: string;
  /** variante verticale della clip per mobile */
  videoMobile?: string;
  categoria: string;
  /** slug del filtro portfolio se diverso da `categoria` (slide "fuse") */
  filterSlug?: string;
  /** ancora interna invece del portfolio filtrato */
  anchor?: string;
};

export type HeroSlide = {
  src: string;
  srcMobile?: string;
  video?: string;
  videoMobile?: string;
  title: string;
  href: string;
};

export const heroSlideDefs: HeroSlideDef[] = [
  {
    src: "/images/home/DSC7090-copia.jpg",
    srcMobile: "/images/home/mobile/DSC7090-copia.jpg",
    categoria: "moda",
  },
  {
    src: "/images/home/815834-2048x.jpg-copia-copia-scaled-e1729706764474.jpg",
    srcMobile: "/images/home/mobile/815834-2048x.jpg-copia-copia-scaled-e1729706764474.jpg",
    categoria: "e-commerce",
  },
  {
    // slide unica per Architettura + Real Estate (esterno villa, leggibile per entrambi)
    src: "/images/home/Ext-15-enhanced-sito-web.jpg",
    srcMobile: "/images/home/mobile/Ext-15-enhanced-sito-web.jpg",
    categoria: "architettura-real-estate",
    filterSlug: "architettura-interni",
  },
  {
    src: "/images/home/Bocelli1831-2024Bottles-Blackbackground8.jpg",
    srcMobile: "/images/home/mobile/Bocelli1831-2024Bottles-Blackbackground8.jpg",
    categoria: "prodotto",
  },
  {
    src: "/images/home/DSC4132.jpg",
    srcMobile: "/images/home/mobile/DSC4132.jpg",
    categoria: "food",
  },
  {
    src: "/images/home/M.C.-Weddings-Castelfalfi-Maurotoncelli11.jpg",
    srcMobile: "/images/home/mobile/M.C.-Weddings-Castelfalfi-Maurotoncelli11.jpg",
    categoria: "matrimonio",
  },
  {
    src: "/videos/showreel-45s-poster.jpg",
    video: "/videos/showreel-45s.mp4",
    // Su mobile un reel verticale vero (formato nativo 9:16)
    videoMobile: "/videos/reel-beach.mp4",
    categoria: "video",
    anchor: "#video",
  },
];
