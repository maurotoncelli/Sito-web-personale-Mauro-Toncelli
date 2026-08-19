import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, serviceBySlug } from "@/data/services";
import { mediaGroup } from "@/data/portfolio";
import { videosForCategories } from "@/data/videos";
import { toGalleryItems } from "@/data/gallery-items";
import { Gallery } from "@/components/Gallery";
import { CtaSection } from "@/components/CtaSection";
import { CtaLink } from "@/components/CtaLink";
import { StickyQuoteCta } from "@/components/StickyQuoteCta";
import {
  IconColorAccuracy,
  IconConsistency,
  IconDelivery,
  IconDetail,
} from "@/components/EcommerceIcons";
import { site } from "@/data/site";
import { getMessages } from "@/i18n";
import { pageAlternates, metaDescription, serviceJsonLd } from "@/lib/seo";

const SLUG = "e-commerce-prodotto";

/** Immagini chiave della landing (dai nuovi scatti Akris/Versace). */
const IMG = {
  heroFront: "/images/portfolio/e-commerce/ecommerce-camicia-seta-fucsia-fronte.jpg",
  colorFront: "/images/portfolio/e-commerce/ecommerce-camicia-seta-fucsia-fronte.jpg",
  colorBack: "/images/portfolio/e-commerce/ecommerce-camicia-seta-fucsia-retro.jpg",
  detailFull: "/images/portfolio/e-commerce/ecommerce-blazer-stampa-geometrica-fronte.jpg",
  detailCrop: "/images/portfolio/e-commerce/ecommerce-blazer-dettaglio-manica.jpg",
  studio: "/images/about/mauro-toncelli-studio-ecommerce.jpg",
};

const VALUE_ICONS = [IconColorAccuracy, IconDetail, IconConsistency, IconDelivery];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  const text = m.services.items[SLUG];
  return {
    title: text.name,
    description: metaDescription(text.description),
    alternates: pageAlternates(locale, `/servizi/${SLUG}`),
    openGraph: {
      title: text.name,
      description: metaDescription(text.description),
      images: [{ url: IMG.heroFront, width: 768, height: 1024, alt: text.name }],
    },
  };
}

export default async function EcommerceLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const service = serviceBySlug(SLUG)!;
  const m = getMessages(locale);
  const text = m.services.items[SLUG];
  const L = m.services.ecommerceLanding;
  const d = m.services.detail;

  // Gallery: interleave e-commerce + prodotto (nuovi scatti in testa), anteprima
  // compatta; il resto si vede nel portfolio filtrato.
  const groups = service.galleryKeys.map((k) => mediaGroup(k));
  const maxLen = Math.max(0, ...groups.map((g) => g.length));
  const photos = Array.from({ length: maxLen }, (_, i) =>
    groups.flatMap((g) => (g[i] ? [g[i]] : []))
  ).flat();
  const gallery = toGalleryItems(photos, videosForCategories(service.portfolioSlugs)).slice(0, 18);

  const related = services.filter((s) => s.slug !== SLUG).slice(0, 3);
  const contactHref = `/${locale}/contatti`;

  const jsonLd = serviceJsonLd({
    name: text.name,
    description: text.description,
    url: `${site.url}/${locale}/servizi/${SLUG}`,
    serviceType: text.name,
    areaServed: ["Europa", "Italia", "Svizzera", "Toscana"],
    pricing: service.pricing,
    fromPrefix: m.services.fromPrefix,
    onQuoteLabel: m.common.onQuote,
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: text.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero split: testo + CTA immediata a sinistra, prodotto a destra */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-14 md:px-8 md:py-20">
            <p className="eyebrow">{m.services.eyebrow}</p>
            <h1 className="mt-2 text-4xl md:text-6xl">{text.name}</h1>
            <p className="mt-4 text-lg text-muted md:text-xl">{text.claim}</p>
            <p className="mt-5 max-w-md leading-relaxed">{L.heroText}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <CtaLink
                href={contactHref}
                className="border border-foreground bg-foreground px-8 py-3 text-[13px] font-medium tracking-[0.2em] uppercase text-background transition-colors hover:bg-transparent hover:text-foreground"
              >
                {L.heroCta}
              </CtaLink>
              <Link
                href="#lavori"
                className="border-b border-foreground/40 pb-0.5 text-[13px] font-medium tracking-[0.2em] uppercase hover:border-foreground"
              >
                {L.heroSecondary}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[360px] bg-surface md:min-h-[560px]">
            <Image
              src={IMG.heroFront}
              alt={text.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6 md:p-12"
            />
          </div>
        </div>
      </section>

      {/* Barra valore con icone */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] sm:grid-cols-2 lg:grid-cols-4">
          {L.valueProps.map((vp, i) => {
            const Icon = VALUE_ICONS[i] ?? IconColorAccuracy;
            return (
              <div
                key={vp.title}
                className="flex flex-col gap-3 border-border px-5 py-8 md:px-8 [&:not(:last-child)]:border-b sm:[&:nth-child(-n+2)]:border-b sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3)]:border-b-0 lg:[&:not(:last-child)]:border-r"
              >
                <Icon className="h-7 w-7 text-foreground" />
                <h2 className="text-sm font-semibold tracking-[0.1em]">{vp.title}</h2>
                <p className="text-sm text-muted">{vp.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fedeltà cromatica */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">{L.colorEyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-5xl">{L.colorTitle}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{L.colorText}</p>
        </div>
        <figure className="mt-10">
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {[
              { src: IMG.colorFront, alt: `${text.name} — ${L.colorEyebrow} 1` },
              { src: IMG.colorBack, alt: `${text.name} — ${L.colorEyebrow} 2` },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[3/4] border border-border bg-surface">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 40vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <figcaption className="mt-3 text-sm text-muted">{L.colorCaption}</figcaption>
        </figure>
      </section>

      {/* Dettaglio 61MP */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="order-2 grid grid-cols-2 gap-3 md:order-1 md:gap-6">
              <div className="relative aspect-[3/4] border border-border bg-background">
                <Image
                  src={IMG.detailFull}
                  alt={`${text.name} — ${L.detailEyebrow}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-contain"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden border border-border bg-background">
                <Image
                  src={IMG.detailCrop}
                  alt={L.detailCaption}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground/85 px-3 py-1 text-[11px] font-medium tracking-[0.15em] uppercase text-background backdrop-blur">
                  {L.detailBadge}
                </span>
              </div>
            </div>
            <div className="order-1 max-w-lg md:order-2">
              <p className="eyebrow">{L.detailEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-5xl">{L.detailTitle}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">{L.detailText}</p>
              <p className="mt-4 text-sm text-muted">{L.detailCaption}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section id="lavori" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
          <h2 className="eyebrow">{L.galleryTitle}</h2>
          <div className="mt-6">
            <Gallery items={gallery} label={text.name} common={m.common} preview />
          </div>
          <Link
            href={`/${locale}/portfolio?categoria=${service.portfolioSlugs[0]}`}
            className="mt-6 inline-block border-b border-foreground/40 pb-0.5 text-[13px] font-medium tracking-[0.2em] uppercase hover:border-foreground"
          >
            {m.common.seeAllPortfolio}
          </Link>
        </section>
      )}

      {/* CTA intermedia (banner) */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-8">
          <h2 className="text-2xl md:text-3xl">{L.midCtaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-background/70">{L.midCtaText}</p>
          <CtaLink
            href={contactHref}
            className="mt-8 inline-block border border-background px-8 py-3 text-[13px] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-background hover:text-foreground"
          >
            {L.heroCta}
          </CtaLink>
        </div>
      </section>

      {/* In studio */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <Image
              src={IMG.studio}
              alt={L.studioImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-lg">
            <p className="eyebrow">{L.studioEyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-4xl">{L.studioTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{L.studioText}</p>
          </div>
        </div>
      </section>

      {/* Il servizio + investimento + cosa include */}
      <section className="mx-auto max-w-[1400px] border-t border-border px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="eyebrow">{d.theService}</h2>
            <p className="mt-4 text-lg leading-relaxed">{text.description}</p>
            <h2 className="eyebrow mt-10">{d.investment}</h2>
            <p className="mt-4 text-2xl font-light">{m.common.onQuote}</p>
            <p className="mt-3 text-xs text-muted">{m.common.plusVat}</p>
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

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="eyebrow">{d.faqTitle}</h2>
          <div className="mt-6 max-w-3xl">
            {text.faq.map((f) => (
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
      </section>

      <CtaSection locale={locale} title={d.ctaTitle} subtitle={d.ctaSubtitle} button={m.cta.button} />

      <StickyQuoteCta href={contactHref} label={L.stickyCta} />
    </>
  );
}
