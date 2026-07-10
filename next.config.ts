import type { NextConfig } from "next";

/** Redirect 301 dai vecchi URL WordPress (blueprint §11). */
const legacyServiceRedirects: [string, string][] = [
  ["fashion-photography-services", "/it/servizi/moda"],
  ["e-commerce-photography-service", "/it/servizi/e-commerce-prodotto"],
  ["product-photography", "/it/servizi/e-commerce-prodotto"],
  ["product-photography-2", "/it/servizi/e-commerce-prodotto"],
  ["food-photography", "/it/servizi/e-commerce-prodotto"],
  ["real-estate-photography-video-services", "/it/servizi/architettura-interni"],
  ["kitchen-photography", "/it/servizi/architettura-interni"],
  ["hotels-hospitality-photography", "/it/servizi/architettura-interni"],
  ["store-photography", "/it/servizi/architettura-interni"],
  ["store-interior-photography-windows", "/it/servizi/architettura-interni"],
  ["brand-image-and-corporate-photography-services", "/it/servizi/corporate-brand"],
  ["weddingphotography", "/it/servizi/matrimoni"],
  ["wedding-photography-service", "/it/servizi/matrimoni"],
  ["couple-engagement-photography-services", "/it/servizi/matrimoni"],
  ["events-photography", "/it/servizi/eventi"],
  ["maternity-photography", "/it/portfolio?categoria=maternita"],
];

const nextConfig: NextConfig = {
  // Safari a volte apre 127.0.0.1 invece di localhost: senza questo il dev
  // server blocca i chunk JS e la pagina resta bianca.
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      // www → dominio principale (canonical unico per SEO)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.maurotoncelli.it" }],
        destination: "https://maurotoncelli.it/:path*",
        permanent: true,
      },
      // Root → lingua di default
      { source: "/", destination: "/it", permanent: false },

      // Vecchi URL WordPress → nuove pagine IT
      { source: "/studio_servizi", destination: "/it/servizi", permanent: true },
      ...legacyServiceRedirects.map(([slug, destination]) => ({
        source: `/studio_servizi/${slug}`,
        destination,
        permanent: true,
      })),
      { source: "/hello-i-am-mauro-toncelli", destination: "/it/about", permanent: true },
      { source: "/contacts", destination: "/it/contatti", permanent: true },
      { source: "/clients", destination: "/it/proof", permanent: true },
      { source: "/portfolio-archive", destination: "/it/portfolio", permanent: true },
      { source: "/project-type/:slug", destination: "/it/portfolio", permanent: true },

      // Vecchi permalink articoli /YYYY/MM/DD/slug → /it/journal/slug
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/it/journal/:slug",
        permanent: true,
      },

      // Percorsi principali senza prefisso lingua → IT
      { source: "/portfolio", destination: "/it/portfolio", permanent: false },
      { source: "/portfolio/:slug", destination: "/it/portfolio", permanent: true },
      { source: "/servizi", destination: "/it/servizi", permanent: false },
      { source: "/servizi/:path*", destination: "/it/servizi/:path*", permanent: false },
      { source: "/journal", destination: "/it/journal", permanent: false },
      { source: "/journal/:slug", destination: "/it/journal/:slug", permanent: false },
      { source: "/about", destination: "/it/about", permanent: false },
      { source: "/contatti", destination: "/it/contatti", permanent: false },
    ];
  },
};

export default nextConfig;
