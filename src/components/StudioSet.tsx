"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Messages } from "@/i18n";

type StudioPhoto = { src: string; width: number; height: number; alt: string };

/**
 * Sezione "Lo studio" (About): foto grande di apertura + griglia di 3,
 * tutte apribili a schermo intero. Lightbox coerente con <Gallery>.
 */
export function StudioSet({
  photos,
  caption,
  common,
}: {
  photos: StudioPhoto[];
  caption: string;
  common: Pick<Messages["common"], "openImage" | "close" | "previous" | "next">;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) => (cur === null ? null : (cur + dir + photos.length) % photos.length)),
    [photos.length]
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

  const current = open !== null ? photos[open] : null;

  const tile = (photo: StudioPhoto, i: number, aspect: string) => (
    <button
      key={photo.src}
      type="button"
      onClick={() => setOpen(i)}
      aria-label={`${common.openImage} ${i + 1} / ${photos.length}`}
      className={`group relative block w-full cursor-zoom-in overflow-hidden ${aspect}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 22vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </button>
  );

  return (
    <>
      <div className="mt-8 space-y-3">
        {tile(photos[0], 0, "aspect-[16/9]")}
        {photos.length > 1 && (
          <div
            className={`grid gap-3 ${
              photos.length - 1 >= 3 ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {photos.slice(1).map((p, idx) => tile(p, idx + 1, "aspect-[4/3]"))}
          </div>
        )}
      </div>

      {current && open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${open + 1} / ${photos.length}`}
          onClick={close}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="100vw"
            className="max-h-[90vh] w-auto max-w-full object-contain"
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
          {photos.length > 1 && (
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
          <div
            className="absolute bottom-5 left-1/2 max-w-[min(90vw,40rem)] -translate-x-1/2 px-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[13px] leading-relaxed tracking-[0.04em] text-white/80">{caption}</p>
            <p className="mt-1 text-xs tracking-widest text-white/55">
              {open + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
