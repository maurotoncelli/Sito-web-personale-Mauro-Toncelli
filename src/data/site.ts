export const site = {
  name: "Mauro Toncelli",
  tagline: "Photographer & Videomaker",
  claim: "Fotografo e videomaker emozionale",
  description:
    "Fotografo e videomaker freelance tra Neuchâtel e Firenze. Moda, e-commerce, architettura, corporate e matrimoni in tutta Europa.",
  url: "https://maurotoncelli.it",
  email: "info@maurotoncelli.it",
  /** Numero WhatsApp / telefono IT in formato internazionale senza spazi */
  whatsapp: "+393401710284",
  locations: "Neuchâtel (CH) · Firenze / Peccioli (IT) · tutta Europa",
  social: {
    instagram: "https://www.instagram.com/maurotoncelli/",
    behance: "https://www.behance.net/maurotoncelli",
    linkedin: "http://www.linkedin.com/in/maurotoncelli",
    facebook: "https://www.facebook.com/Maurotoncelliphotography/",
  },
  /**
   * NAP allineato a Google Business Profile (Peccioli).
   * `googleMapsUrl`: incolla il link "Condividi" della scheda Maps quando disponibile.
   */
  business: {
    name: "Mauro Toncelli Photographer & Videomaker",
    telephone: "+393401710284",
    address: {
      addressLocality: "Peccioli",
      addressRegion: "Toscana",
      postalCode: "56037",
      addressCountry: "IT",
    },
    areaServed: ["Toscana", "Peccioli", "Firenze", "Valdera", "Pisa"],
    googleMapsUrl: "",
  },
};

/** Profili sameAs per schema.org (social + Google Business se presente). */
export function siteSameAs(): string[] {
  const links = Object.values(site.social);
  if (site.business.googleMapsUrl) links.push(site.business.googleMapsUrl);
  return links;
}
