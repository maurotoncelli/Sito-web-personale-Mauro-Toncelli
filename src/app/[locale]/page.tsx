import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { VideoShowcase } from "@/components/VideoShowcase";
import { CtaSection } from "@/components/CtaSection";
import { ClientLogos } from "@/components/ClientLogos";
import { heroSlideDefs } from "@/data/home";
import { services } from "@/data/services";
import { videos } from "@/data/videos";
import { mediaGroup, portfolioCategories } from "@/data/portfolio";
import { getMessages } from "@/i18n";

const selectedWorks = ["moda", "e-commerce", "architettura-interni"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = getMessages(locale);

  const slides = heroSlideDefs.map((def) => ({
    src: def.src,
    srcMobile: def.srcMobile,
    video: def.video,
    videoMobile: def.videoMobile,
    title:
      m.portfolio.categories[def.categoria as keyof typeof m.portfolio.categories]?.label ??
      def.categoria,
    href: def.anchor
      ? `/${locale}${def.anchor}`
      : `/${locale}/portfolio?categoria=${def.filterSlug ?? def.categoria}`,
  }));

  return (
    <>
      <HeroSlider
        slides={slides}
        ctaLabel={m.common.seeWorks}
        ariaLabel={m.home.heroLabel}
        prevLabel={m.common.previousSlide}
        nextLabel={m.common.nextSlide}
      />

      {/* Selected Works — solo lavoro reale e forte (blueprint home §2) */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
        <p className="eyebrow">{m.home.selectedWorksEyebrow}</p>
        <h2 className="mt-2 text-2xl md:text-3xl">{m.home.selectedWorksTitle}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {selectedWorks.map((slug) => {
            const cat = portfolioCategories.find((c) => c.slug === slug)!;
            const text = m.portfolio.categories[slug as keyof typeof m.portfolio.categories];
            const cover = cat.cover
              ? { src: cat.cover }
              : mediaGroup(cat.mediaKeys[0])[0];
            return (
              <Link key={slug} href={`/${locale}/portfolio?categoria=${slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {cover && (
                    <Image
                      src={cover.src}
                      alt={text.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-4 text-lg tracking-[0.08em]">{text.label}</h3>
                <p className="mt-1 text-sm text-muted">{text.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Approccio (blueprint home §3) */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
          <p className="text-2xl font-light leading-relaxed md:text-3xl">
            &ldquo;{m.home.approachQuote}&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-muted">{m.home.approachText}</p>
          <Link
            href={`/${locale}/about`}
            className="mt-6 inline-block border-b border-foreground/40 pb-0.5 text-[13px] font-medium tracking-[0.2em] uppercase transition-colors hover:border-foreground"
          >
            {m.home.approachLink}
          </Link>
        </div>
      </section>

      {/* Servizi (blueprint home §4) */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
        <p className="eyebrow">{m.home.servicesEyebrow}</p>
        <h2 className="mt-2 text-2xl md:text-3xl">{m.home.servicesTitle}</h2>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const text = m.services.items[s.slug as keyof typeof m.services.items];
            return (
              <Link
                key={s.slug}
                href={`/${locale}/servizi/${s.slug}`}
                className="group block border-t border-border pt-5"
              >
                <h3 className="text-base tracking-[0.05em]">{text.name}</h3>
                <p className="mt-1 text-sm text-muted">{text.claim}</p>
                <span className="mt-3 inline-block text-xs font-medium tracking-[0.2em] text-muted uppercase transition-colors group-hover:text-foreground">
                  {m.common.discover} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Video reel (blueprint home §5) — tutti i video, cliccabili e a schermo intero */}
      <section id="video" className="border-t border-border scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
          <p className="eyebrow">{m.home.videoEyebrow}</p>
          <h2 className="mt-2 text-2xl md:text-3xl">{m.home.videoTitle}</h2>
          <p className="mt-3 max-w-xl text-muted">{m.home.videoText}</p>
          <div className="mt-10">
            <VideoShowcase videos={videos} playLabel={m.common.playVideo} closeLabel={m.common.close} />
          </div>
        </div>
      </section>

      {/* Fiducia (blueprint home §6) */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
          <p className="eyebrow text-center">{m.home.trustEyebrow}</p>
          <div className="mt-8">
            <ClientLogos />
          </div>
        </div>
      </section>

      {/* Drone — accenno discreto B2B (blueprint home §8) */}
      <section className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">
        <p className="text-center text-sm text-muted">
          {m.home.droneNotice}{" "}
          <Link
            href={`/${locale}/servizi/drone`}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {m.home.droneNoticeLink}
          </Link>{" "}
          {m.home.droneNoticeAfter}
        </p>
      </section>

      <CtaSection locale={locale} title={m.cta.title} subtitle={m.cta.subtitle} button={m.cta.button} />
    </>
  );
}
