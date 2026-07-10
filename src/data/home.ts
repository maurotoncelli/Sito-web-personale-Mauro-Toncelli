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

// Le slide sono gestite dal pannello /keystatic (content/hero.yaml) e
// trasformate in hero.json dallo script prebuild (blueprint §13).
import slides from "./hero.json";

export const heroSlideDefs: HeroSlideDef[] = slides as HeroSlideDef[];
