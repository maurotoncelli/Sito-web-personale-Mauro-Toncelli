import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { droneServiceSlugs, type DroneSlug } from "@/data/services";
import { site } from "@/data/site";
import { CtaSection } from "@/components/CtaSection";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return droneServiceSlugs.map((sub) => ({ sub }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sub: string }>;
}): Promise<Metadata> {
  const { locale, sub } = await params;
  if (!droneServiceSlugs.includes(sub as DroneSlug)) return {};
  const m = getMessages(locale);
  const item = m.services.drone.items[sub as DroneSlug];
  return { title: item.seoTitle, description: item.description, alternates: pageAlternates(locale, `/servizi/drone/${sub}`) };
}

export default async function DroneSubPage({
  params,
}: {
  params: Promise<{ locale: string; sub: string }>;
}) {
  const { locale, sub } = await params;
  if (!droneServiceSlugs.includes(sub as DroneSlug)) notFound();
  const m = getMessages(locale);
  const drone = m.services.drone;
  const item = drone.items[sub as DroneSlug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.seoTitle,
    description: item.description,
    provider: { "@type": "Person", name: site.name, url: site.url },
    areaServed: "Toscana",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8">
        <Link
          href={`/${locale}/servizi/drone`}
          className="text-xs font-medium tracking-[0.2em] text-muted uppercase hover:text-foreground"
        >
          ← {drone.backLink}
        </Link>
        <h1 className="mt-4 text-3xl md:text-4xl">{item.seoTitle}</h1>
        <p className="mt-2 text-lg font-medium tracking-[0.1em] text-muted uppercase">
          {item.price}
        </p>
        <p className="mt-6 text-lg leading-relaxed">{item.description}</p>

        <h2 className="eyebrow mt-12">{drone.includesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {item.deliverables.map((d) => (
            <li key={d} className="flex gap-3 border-b border-border pb-3">
              <span aria-hidden className="text-muted">—</span>
              {d}
            </li>
          ))}
        </ul>

        <h2 className="eyebrow mt-12">{drone.faqTitle}</h2>
        <dl className="mt-4 space-y-6">
          {item.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 text-sm text-muted">{drone.areaNote}</p>
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
