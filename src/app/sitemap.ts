import type { MetadataRoute } from "next";
import { services, droneServiceSlugs } from "@/data/services";
import { journalPosts } from "@/data/journal";
import { site } from "@/data/site";
import { defaultLocale, locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/portfolio",
    "/servizi",
    "/servizi/drone",
    "/journal",
    "/about",
    "/contatti",
    ...services.map((s) => `/servizi/${s.slug}`),
    ...droneServiceSlugs.map((s) => `/servizi/drone/${s}`),
    ...journalPosts.map((p) => `/journal/${p.slug}`),
  ];

  return locales.flatMap((locale) =>
    paths.map((p) => ({
      url: `${site.url}/${locale}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${p}`])),
          "x-default": `${site.url}/${defaultLocale}${p}`,
        },
      },
    }))
  );
}
