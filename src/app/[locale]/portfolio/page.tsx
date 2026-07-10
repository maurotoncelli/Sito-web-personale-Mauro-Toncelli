import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioExplorer } from "@/components/PortfolioExplorer";
import { CtaSection } from "@/components/CtaSection";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.portfolio.title, description: m.portfolio.metaDescription, alternates: pageAlternates(locale, "/portfolio") };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <p className="eyebrow">{m.portfolio.eyebrow}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{m.portfolio.title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{m.portfolio.intro}</p>
        <div className="mt-10">
          <Suspense>
            <PortfolioExplorer locale={locale} categories={m.portfolio.categories} common={m.common} />
          </Suspense>
        </div>
      </div>
      <CtaSection locale={locale} title={m.cta.title} subtitle={m.cta.subtitle} button={m.cta.button} />
    </>
  );
}
