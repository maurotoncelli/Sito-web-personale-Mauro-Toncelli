import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { services, type Service } from "@/data/services";
import { mediaGroup } from "@/data/portfolio";
import { CtaSection } from "@/components/CtaSection";
import { getMessages, type Messages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.services.title, description: m.services.metaDescription, alternates: pageAlternates(locale, "/servizi") };
}

function priceLabel(s: Service, m: Messages) {
  if (s.pricing.type === "from") return `${m.services.fromPrefix} ${s.pricing.from}`;
  if (s.pricing.type === "tiers")
    return `${m.services.fromPrefix} ${s.pricing.tiers[0].price}`;
  return m.common.onQuote;
}

export default async function ServiziPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <p className="eyebrow">{m.services.eyebrow}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{m.services.title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{m.services.intro}</p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const text = m.services.items[s.slug as keyof typeof m.services.items];
            const cover = s.cover ?? (s.galleryKeys.length ? mediaGroup(s.galleryKeys[0])[0]?.src : null);
            return (
              <Link key={s.slug} href={`/${locale}/servizi/${s.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={text.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-extrabold uppercase text-muted/40">
                        {text.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-lg tracking-[0.05em]">{text.name}</h2>
                <p className="mt-1 text-sm text-muted">{text.claim}</p>
                <p className="mt-2 text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  {priceLabel(s, m)}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Sezione tecnica — discreta ma presente (blueprint §7) */}
        <div className="mt-16 border-t border-border pt-10">
          <Link href={`/${locale}/servizi/drone`} className="group flex flex-col gap-1">
            <p className="eyebrow">{m.services.droneTeaserEyebrow}</p>
            <h2 className="text-lg normal-case tracking-normal transition-colors group-hover:text-muted">
              {m.services.droneTeaserTitle} →
            </h2>
            <p className="text-sm text-muted">{m.services.droneTeaserText}</p>
          </Link>
        </div>
      </div>
      <CtaSection locale={locale} title={m.cta.title} subtitle={m.cta.subtitle} button={m.cta.button} />
    </>
  );
}
