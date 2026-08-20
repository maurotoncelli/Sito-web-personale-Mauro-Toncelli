import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { ClientLogos } from "@/components/ClientLogos";
import { StudioSet } from "@/components/StudioSet";
import { site } from "@/data/site";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.about.eyebrow, description: m.about.metaDescription, alternates: pageAlternates(locale, "/about") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);
  const a = m.about;

  const studioPhotos = [
    { src: "/images/about/studio-peccioli-set.webp", width: 1024, height: 682, alt: a.studio.altSet },
    { src: "/images/about/studio-peccioli-fondale.webp", width: 1024, height: 682, alt: a.studio.altFondale },
    { src: "/images/about/studio-peccioli-laterale.webp", width: 1024, height: 682, alt: a.studio.altLaterale },
    { src: "/images/about/studio-peccioli-pianta.webp", width: 1024, height: 765, alt: a.studio.altPianta },
  ];

  const ambiti = [
    { label: a.ambiti.moda, href: `/${locale}/servizi/moda` },
    { label: a.ambiti.ecommerce, href: `/${locale}/servizi/e-commerce-prodotto` },
    { label: a.ambiti.architettura, href: `/${locale}/servizi/architettura-interni` },
    { label: a.ambiti.corporate, href: `/${locale}/servizi/corporate-brand` },
    { label: a.ambiti.matrimoni, href: `/${locale}/servizi/matrimoni` },
    { label: a.ambiti.eventi, href: `/${locale}/servizi/eventi` },
    { label: a.ambiti.drone, href: `/${locale}/servizi/drone` },
  ];

  return (
    <>
      {/* Hero (blueprint spec About §1) */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src="/images/about/myself-teal-light.jpg"
            alt={a.portraitAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">{a.eyebrow}</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{site.name}</h1>
          <p className="mt-2 text-lg text-muted">{m.brand.tagline}</p>
          <p className="mt-1 text-lg font-light">{m.brand.claim}</p>

          {/* Manifesto (blueprint spec About §2) */}
          <div className="mt-8 space-y-4 leading-relaxed">
            {a.manifesto.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium tracking-[0.15em] text-muted uppercase">
            {a.keywords}
          </p>
        </div>
      </section>

      {/* Cosa faccio (§3) */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
          <h2 className="eyebrow">{a.whatIDo}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {ambiti.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border px-4 py-1.5 text-[13px] font-medium tracking-[0.05em] uppercase text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lo studio */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
          <p className="eyebrow">{a.studio.eyebrow}</p>
          <h2 className="mt-2 max-w-2xl text-2xl md:text-3xl">{a.studio.title}</h2>
          <div className="mt-4 max-w-2xl space-y-3 leading-relaxed text-muted">
            {a.studio.text.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <StudioSet photos={studioPhotos} caption={a.studio.caption} common={m.common} />
        </div>
      </section>

      {/* Brand (§4) */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
          <h2 className="eyebrow text-center">{a.brands}</h2>
          <div className="mt-8">
            <ClientLogos />
          </div>
        </div>
      </section>

      {/* Testimonianze (dal sito attuale) */}
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <h2 className="eyebrow">{a.testimonialsTitle}</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {a.testimonials.map((t) => (
            <blockquote key={t.author} className="border-l-2 border-border pl-5">
              <p className="font-light leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-2 text-sm text-muted">{t.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Pubblicazioni (dal sito attuale) */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
          <h2 className="eyebrow">{a.publications}</h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
            {a.publicationsList.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dove opero + toolkit + lingue (§5-7) */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <h2 className="eyebrow">{a.whereTitle}</h2>
          <p className="mt-4 leading-relaxed">{a.whereText}</p>
        </div>
        <div>
          <h2 className="eyebrow">{a.toolkitTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted">{a.toolkitText}</p>
        </div>
        <div>
          <h2 className="eyebrow">{a.languagesTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted">{a.languagesText}</p>
        </div>
      </section>

      {/* Percorso (§8) */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
          <h2 className="eyebrow">{a.pathTitle}</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {a.path.map((p) => (
              <li key={p.label} className="border-t border-border pt-4">
                <span className="text-sm font-semibold tracking-[0.1em] uppercase">{p.label}</span>
                <p className="mt-1 text-sm text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection locale={locale} title={a.ctaTitle} subtitle={a.ctaSubtitle} button={m.cta.button} />
    </>
  );
}
