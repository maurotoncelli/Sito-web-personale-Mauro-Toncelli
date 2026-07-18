import type { Metadata } from "next";
import Link from "next/link";
import { droneServiceSlugs } from "@/data/services";
import { site } from "@/data/site";
import { CtaSection } from "@/components/CtaSection";
import { getMessages } from "@/i18n";
import { localBusinessJsonLd, pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.services.drone.metaTitle, description: m.services.drone.metaDescription, alternates: pageAlternates(locale, "/servizi/drone") };
}

export default async function DronePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);
  const drone = m.services.drone;

  const jsonLd = localBusinessJsonLd({
    url: `${site.url}/${locale}/servizi/drone`,
    name: `${site.business.name} — ${drone.title}`,
    description: drone.metaDescription,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <p className="eyebrow">{drone.eyebrow}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{drone.title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{drone.intro}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {droneServiceSlugs.map((slug) => {
            const item = drone.items[slug];
            return (
              <Link
                key={slug}
                href={`/${locale}/servizi/drone/${slug}`}
                className="group border border-border p-8 transition-colors hover:border-foreground"
              >
                <h2 className="text-lg tracking-[0.05em]">{item.name}</h2>
                <p className="mt-1 text-sm font-medium tracking-[0.15em] text-muted uppercase">
                  {item.price}
                </p>
                <p className="mt-3 text-sm text-muted">{item.description}</p>
                <span className="mt-4 inline-block text-xs font-medium tracking-[0.2em] uppercase text-muted group-hover:text-foreground">
                  {drone.details} →
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-muted">{drone.zonesNote}</p>
      </div>
      <CtaSection
        locale={locale}
        title={drone.ctaTitle}
        subtitle={drone.ctaSubtitle}
        button={m.cta.button}
      />
    </>
  );
}
