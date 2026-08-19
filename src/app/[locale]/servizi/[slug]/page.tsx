import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, serviceBySlug } from "@/data/services";
import { mediaGroup } from "@/data/portfolio";
import { videosForCategories } from "@/data/videos";
import { toGalleryItems } from "@/data/gallery-items";
import { Gallery } from "@/components/Gallery";
import { CtaSection } from "@/components/CtaSection";
import { site } from "@/data/site";
import { getMessages } from "@/i18n";
import { pageAlternates, metaDescription, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  // e-commerce-prodotto ha una landing dedicata (route statica omonima che
  // vince su questa dinamica): la escludiamo per non generare due volte lo
  // stesso path.
  return services.filter((s) => s.slug !== "e-commerce-prodotto").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  const m = getMessages(locale);
  const text = m.services.items[slug as keyof typeof m.services.items];
  return {
    title: text.name,
    description: metaDescription(text.description),
    alternates: pageAlternates(locale, `/servizi/${slug}`),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const m = getMessages(locale);
  const text = m.services.items[slug as keyof typeof m.services.items];
  const d = m.services.detail;

  // Interleave dei gruppi (round-robin): con più galleryKeys l'anteprima
  // mostra un mix di tutti i gruppi, non solo il primo.
  const groups = service.galleryKeys.map((k) => mediaGroup(k));
  const maxLen = Math.max(0, ...groups.map((g) => g.length));
  const photos = Array.from({ length: maxLen }, (_, i) =>
    groups.flatMap((g) => (g[i] ? [g[i]] : []))
  ).flat();
  // Gallery mista foto+video (blueprint §5) — anteprima compatta (max 12
  // elementi, griglia uniforme) per non spezzare la lettura della pagina:
  // il resto si vede nel portfolio filtrato.
  const gallery = toGalleryItems(photos, videosForCategories(service.portfolioSlugs)).slice(0, 12);
  // Hero: la cover esplicita (se definita) vince sulla prima foto della gallery
  const hero = service.cover ? { src: service.cover } : photos[0];
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const tierIncludes =
    "tiers" in text ? (text as { tiers: Record<string, string[]> }).tiers : undefined;
  const faq = "faq" in text ? (text as { faq: { q: string; a: string }[] }).faq : undefined;

  const jsonLd = serviceJsonLd({
    name: text.name,
    description: text.description,
    url: `${site.url}/${locale}/servizi/${slug}`,
    serviceType: text.name,
    areaServed: ["Europa", "Italia", "Svizzera", "Toscana"],
    pricing: service.pricing,
    fromPrefix: m.services.fromPrefix,
    onQuoteLabel: m.common.onQuote,
  });

  /** FAQPage: idoneo ai rich result Google e leggibile dai crawler AI. */
  const faqJsonLd = faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Hero servizio */}
      <section className="relative">
        {hero && (
          <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-black">
            <Image
              src={hero.src}
              alt={text.name}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        )}
        <div
          className={
            hero
              ? "absolute bottom-0 left-0 right-0 mx-auto max-w-[1400px] px-5 pb-10 text-white md:px-8"
              : "mx-auto max-w-[1400px] px-5 pt-16 md:px-8"
          }
        >
          <p className={`eyebrow ${hero ? "!text-white/70" : ""}`}>{m.services.eyebrow}</p>
          <h1 className="mt-1 text-3xl md:text-5xl">{text.name}</h1>
          <p className={`mt-2 text-lg ${hero ? "text-white/85" : "text-muted"}`}>{text.claim}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        {/* Descrizione + deliverable */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="eyebrow">{d.theService}</h2>
            <p className="mt-4 text-lg leading-relaxed">{text.description}</p>
          </div>
          <div>
            <h2 className="eyebrow">{d.includes}</h2>
            <ul className="mt-4 space-y-3">
              {text.deliverables.map((item) => (
                <li key={item} className="flex gap-3 border-b border-border pb-3">
                  <span aria-hidden className="text-muted">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prezzi */}
        <div className="mt-16">
          <h2 className="eyebrow">{d.investment}</h2>
          {service.pricing.type === "tiers" ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.pricing.tiers.map((tier) => (
                <div key={tier.id} className="border border-border p-6">
                  <h3 className="text-sm tracking-[0.15em]">{tier.name}</h3>
                  <p className="mt-2 text-2xl font-light">{tier.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {(tierIncludes?.[tier.id] ?? []).map((inc) => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-2xl font-light">
              {service.pricing.type === "from"
                ? `${m.services.fromPrefix} ${service.pricing.from}`
                : m.common.onQuote}
            </p>
          )}
          {"pricingNote" in text && (
            <p className="mt-3 text-sm text-muted">{(text as { pricingNote: string }).pricingNote}</p>
          )}
          <p className="mt-3 text-xs text-muted">{m.common.plusVat}</p>
        </div>

        {/* Gallery mista — solo se c'è lavoro vero (blueprint §5) */}
        {gallery.length > 0 && (
          <div className="mt-16">
            <h2 className="eyebrow">{d.fromPortfolio}</h2>
            <div className="mt-6">
              <Gallery items={gallery} label={text.name} common={m.common} preview />
            </div>
            {service.portfolioSlugs.length > 0 && (
              <Link
                href={`/${locale}/portfolio?categoria=${service.portfolioSlugs[0]}`}
                className="mt-6 inline-block border-b border-foreground/40 pb-0.5 text-[13px] font-medium tracking-[0.2em] uppercase hover:border-foreground"
              >
                {m.common.seeAllPortfolio}
              </Link>
            )}
          </div>
        )}

        {/* Come lavoro */}
        <div className="mt-16">
          <h2 className="eyebrow">{d.howIWork}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {d.steps.map((step, i) => (
              <li key={step.title} className="border-t border-border pt-4">
                <span className="text-2xl font-extrabold text-muted/50">0{i + 1}</span>
                <h3 className="mt-2 text-sm tracking-[0.05em]">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ (dal vecchio sito, riviste con i dati attuali) */}
        {faq && faq.length > 0 && (
          <div className="mt-16">
            <h2 className="eyebrow">{d.faqTitle}</h2>
            <div className="mt-6 max-w-3xl">
              {faq.map((f) => (
                <details key={f.q} className="group border-b border-border py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                    {f.q}
                    <span
                      aria-hidden
                      className="text-xl font-light text-muted transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Servizi correlati */}
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="eyebrow">{d.otherServices}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/${locale}/servizi/${s.slug}`}
                className="rounded-full border border-border px-4 py-1.5 text-[13px] font-medium tracking-[0.05em] uppercase text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {m.services.items[s.slug as keyof typeof m.services.items].name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CtaSection locale={locale} title={d.ctaTitle} subtitle={d.ctaSubtitle} button={m.cta.button} />
    </>
  );
}
