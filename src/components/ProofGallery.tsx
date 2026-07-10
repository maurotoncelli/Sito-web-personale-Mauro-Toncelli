"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "@/data/portfolio";
import type { Messages } from "@/i18n";
import { site } from "@/data/site";

type Mark = "like" | "dislike";
type Selection = { marks: Record<string, Mark>; stars: Record<string, boolean> };

const EMPTY: Selection = { marks: {}, stars: {} };

/**
 * Gallery di proofing (come il PixProof del sito originale): foto numerate,
 * il cliente segna Mi piace / No / Preferita (stellina). La selezione resta
 * salvata nel suo browser e viene inviata via email con un click.
 */
export function ProofGallery({
  items,
  galleryTitle,
  storageKey,
  proof,
  common,
}: {
  items: MediaItem[];
  galleryTitle: string;
  storageKey: string;
  proof: Messages["proof"];
  common: Pick<Messages["common"], "openImage" | "close" | "previous" | "next">;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [sel, setSel] = useState<Selection>(EMPTY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ripristino client-only da localStorage
      if (raw) setSel(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const update = useCallback(
    (fn: (prev: Selection) => Selection) => {
      setSel((prev) => {
        const next = fn(prev);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [storageKey]
  );

  const toggleMark = (src: string, mark: Mark) =>
    update((p) => ({
      ...p,
      marks: { ...p.marks, [src]: p.marks[src] === mark ? undefined : mark } as Record<string, Mark>,
    }));

  const toggleStar = (src: string) =>
    update((p) => ({ ...p, stars: { ...p.stars, [src]: !p.stars[src] } }));

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) => (cur === null ? null : (cur + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const num = (i: number) => String(i + 1).padStart(3, "0");

  const starred = items.map((it, i) => (sel.stars[it.src] ? num(i) : null)).filter(Boolean);
  const liked = items
    .map((it, i) => (sel.marks[it.src] === "like" && !sel.stars[it.src] ? num(i) : null))
    .filter(Boolean);
  const disliked = items.map((it, i) => (sel.marks[it.src] === "dislike" ? num(i) : null)).filter(Boolean);
  const total = starred.length + liked.length + disliked.length;

  const mailto = () => {
    const lines = [
      `${proof.title}: ${galleryTitle}`,
      "",
      starred.length ? `★ ${proof.star}: ${starred.join(", ")}` : null,
      liked.length ? `♥ ${proof.like}: ${liked.join(", ")}` : null,
      disliked.length ? `✕ ${proof.dislike}: ${disliked.join(", ")}` : null,
    ].filter((l) => l !== null);
    return `mailto:${site.email}?subject=${encodeURIComponent(
      `${proof.emailSubject} — ${galleryTitle}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const markButtons = (src: string, light = false) => {
    const mark = sel.marks[src];
    const star = !!sel.stars[src];
    const base = `flex h-8 w-8 items-center justify-center rounded-full border transition-colors`;
    const off = light
      ? "border-white/40 text-white/70 hover:text-white hover:border-white"
      : "border-border text-muted hover:text-foreground hover:border-foreground";
    return (
      <span className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleStar(src);
          }}
          aria-label={proof.star}
          aria-pressed={star}
          title={proof.star}
          className={`${base} ${star ? "border-amber-500 bg-amber-500/15 text-amber-500" : off}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={star ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMark(src, "like");
          }}
          aria-label={proof.like}
          aria-pressed={mark === "like"}
          title={proof.like}
          className={`${base} ${mark === "like" ? "border-emerald-600 bg-emerald-600/15 text-emerald-600" : off}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={mark === "like" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 21s-7.5-4.6-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5C19 5 21 8.5 19.5 12c-2 4.4-7.5 9-7.5 9z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMark(src, "dislike");
          }}
          aria-label={proof.dislike}
          aria-pressed={mark === "dislike"}
          title={proof.dislike}
          className={`${base} ${mark === "dislike" ? "border-red-500 bg-red-500/15 text-red-500" : off}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </span>
    );
  };

  const current = open !== null ? items[open] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <figure key={item.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full cursor-zoom-in overflow-hidden"
              aria-label={`${common.openImage} ${i + 1} / ${items.length}`}
            >
              <span className="relative block aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={`${proof.photoLabel} ${num(i)}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-[1.02] ${
                    sel.marks[item.src] === "dislike" ? "opacity-40" : ""
                  }`}
                />
                {sel.stars[item.src] && (
                  <span className="absolute top-2 right-2 text-amber-400 drop-shadow" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" />
                    </svg>
                  </span>
                )}
              </span>
            </button>
            <figcaption className="mt-1.5 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted">
                {proof.photoLabel} {num(i)}
              </span>
              {markButtons(item.src)}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Barra riepilogo selezione */}
      <div className="sticky bottom-0 z-30 mt-10 -mx-5 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-sm md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {total === 0 ? (
              proof.noMarks
            ) : (
              <>
                {starred.length > 0 && (
                  <span className="mr-4">★ {proof.star}: {starred.join(", ")}</span>
                )}
                {liked.length > 0 && (
                  <span className="mr-4">♥ {proof.like}: {liked.join(", ")}</span>
                )}
                {disliked.length > 0 && <span>✕ {proof.dislike}: {disliked.join(", ")}</span>}
              </>
            )}
          </p>
          <a
            href={mailto()}
            aria-disabled={total === 0}
            className={`border px-5 py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors ${
              total === 0
                ? "pointer-events-none border-border text-muted"
                : "border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground"
            }`}
          >
            {proof.sendSelection}
          </a>
        </div>
      </div>

      {current && open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${proof.photoLabel} ${num(open)}`}
          onClick={close}
        >
          <Image
            src={current.src}
            alt={`${proof.photoLabel} ${num(open)}`}
            width={current.width}
            height={current.height}
            sizes="100vw"
            className="max-h-[84vh] w-auto max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={close}
            aria-label={common.close}
            className="absolute top-5 right-5 text-3xl text-white/70 hover:text-white"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label={common.previous}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-2xl text-white/70 hover:text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label={common.next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-2xl text-white/70 hover:text-white"
          >
            →
          </button>
          <div
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/80">
              {proof.photoLabel} {num(open)} — {open + 1} / {items.length}
            </span>
            {markButtons(current.src, true)}
          </div>
        </div>
      )}
    </>
  );
}
