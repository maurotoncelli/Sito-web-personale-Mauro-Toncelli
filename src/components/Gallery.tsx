"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/data/gallery-items";
import type { Messages } from "@/i18n";
import { trackEvent } from "./Analytics";

/**
 * Gallery unificata foto+video (blueprint §5): stessa griglia masonry,
 * i video hanno il badge play e si aprono a schermo intero con audio
 * e controlli nativi.
 */
export function Gallery({
  items,
  label,
  common,
}: {
  items: GalleryItem[];
  label: string;
  common: Pick<Messages["common"], "openImage" | "close" | "previous" | "next" | "playVideo">;
}) {
  const [open, setOpen] = useState<number | null>(null);

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

  const current = open !== null ? items[open] : null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>button]:mb-4">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => {
              setOpen(i);
              trackEvent(item.kind === "video" ? "video_play" : "gallery_open", {
                gallery: label,
              });
            }}
            className={`group block w-full overflow-hidden ${
              item.kind === "video" ? "cursor-pointer" : "cursor-zoom-in"
            }`}
            aria-label={
              item.kind === "video"
                ? `${common.playVideo}: ${item.client} — ${item.title}`
                : `${common.openImage} ${i + 1} / ${items.length}`
            }
          >
            {item.kind === "photo" ? (
              <Image
                src={item.src}
                alt={item.title || `${label} ${i + 1}`}
                width={item.width}
                height={item.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <span className={`relative block ${item.vertical ? "aspect-[9/16]" : "aspect-video"}`}>
                <Image
                  src={item.poster}
                  alt={`${item.client} — ${item.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="absolute bottom-2 left-3 text-[11px] font-medium tracking-[0.15em] uppercase text-white/90">
                  {item.client} — {item.title}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      {current && open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} ${open + 1} / ${items.length}`}
          onClick={close}
        >
          {current.kind === "photo" ? (
            <Image
              src={current.src}
              alt={current.title || `${label} ${open + 1}`}
              width={current.width}
              height={current.height}
              sizes="100vw"
              className="max-h-[90vh] w-auto max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              key={current.src}
              src={current.src}
              poster={current.poster}
              controls
              autoPlay
              playsInline
              className={`max-h-[90vh] max-w-full ${current.vertical ? "h-[90vh]" : "w-full max-w-6xl"}`}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button
            type="button"
            onClick={close}
            aria-label={common.close}
            className="absolute top-5 right-5 text-3xl text-white/70 hover:text-white"
          >
            ×
          </button>
          {items.length > 1 && (
            <>
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
            </>
          )}
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/60">
            {open + 1} / {items.length}
          </span>
        </div>
      )}
    </>
  );
}
