"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { portfolioCategories, mediaGroup } from "@/data/portfolio";
import { videosForCategory } from "@/data/videos";
import { toGalleryItems } from "@/data/gallery-items";
import type { Messages } from "@/i18n";
import { Gallery } from "./Gallery";
import { trackEvent } from "./Analytics";

/**
 * Portfolio come vista filtrata dei lavori reali (blueprint §5):
 * categorie forti come filtri principali, nicchie come sotto-filtri,
 * gallery mista foto+video per ogni categoria (niente sezione video a parte).
 */
export function PortfolioExplorer({
  locale,
  categories,
  common,
}: {
  locale: string;
  categories: Messages["portfolio"]["categories"];
  common: Messages["common"];
}) {
  const params = useSearchParams();
  const initial = params.get("categoria") ?? portfolioCategories[0].slug;
  const [active, setActive] = useState(initial);

  const category = useMemo(
    () => portfolioCategories.find((c) => c.slug === active) ?? portfolioCategories[0],
    [active]
  );
  const items = toGalleryItems(
    category.mediaKeys.flatMap((k) => mediaGroup(k)),
    videosForCategory(category.slug)
  );
  const text = categories[category.slug as keyof typeof categories];

  const primary = portfolioCategories.filter((c) => c.primary);
  const tags = portfolioCategories.filter((c) => !c.primary);

  function select(slug: string) {
    setActive(slug);
    trackEvent("portfolio_filter", { category: slug });
    window.history.replaceState(null, "", `/${locale}/portfolio?categoria=${slug}`);
  }

  const chip = (slug: string) => {
    const label = categories[slug as keyof typeof categories]?.label ?? slug;
    return (
      <button
        key={slug}
        type="button"
        onClick={() => select(slug)}
        aria-pressed={active === slug}
        className={`rounded-full border px-4 py-1.5 text-[13px] font-medium tracking-[0.05em] uppercase transition-colors ${
          active === slug
            ? "border-foreground bg-foreground text-background"
            : "border-border text-muted hover:border-foreground hover:text-foreground"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">{primary.map((c) => chip(c.slug))}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium tracking-[0.2em] text-muted uppercase">
          {common.niches}
        </span>
        {tags.map((c) => chip(c.slug))}
      </div>

      <p className="mt-8 max-w-2xl text-muted">{text?.description}</p>

      <div className="mt-8">
        {items.length > 0 ? (
          <Gallery items={items} label={text?.label ?? category.slug} common={common} />
        ) : (
          <p className="py-16 text-center text-muted">{common.emptyGallery}</p>
        )}
      </div>
    </div>
  );
}
