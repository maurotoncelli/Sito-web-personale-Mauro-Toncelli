"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { HeroSlide } from "@/data/home";

const AUTO_MS = 6500;
const STRIP_W = 72;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px)";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Art direction mobile-first (blueprint: crop verticale via <picture>):
 * sotto i 768px il browser scarica SOLO il crop 9:16, sopra solo l'orizzontale.
 */
function SlideImage({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const common = { alt: slide.title, sizes: "100vw", quality: 75, priority };
  const desktop = getImageProps({ ...common, src: slide.src, width: 1920, height: 1280 });
  if (!slide.srcMobile) {
    return (
      <Image
        src={slide.src}
        alt={slide.title}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    );
  }
  const mobile = getImageProps({ ...common, src: slide.srcMobile, width: 1080, height: 1920 });
  const { srcSet: _drop, ...imgProps } = desktop.props;
  return (
    <picture>
      <source media={MOBILE_QUERY} srcSet={mobile.props.srcSet} />
      <source media="(min-width: 768px)" srcSet={desktop.props.srcSet} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt è dentro imgProps */}
      <img {...imgProps} className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

/**
 * Slider fullscreen come il tema attuale: scorrimento laterale vero,
 * strisce laterali con sliver della slide adiacente + titolo verticale,
 * dots in basso. Auto-avanza lento, pausa su hover/tocco, swipe,
 * prima slide preloaded (LCP), prefers-reduced-motion rispettato.
 */
export function HeroSlider({
  slides,
  ctaLabel,
  ariaLabel,
  prevLabel,
  nextLabel,
}: {
  slides: HeroSlide[];
  ctaLabel: string;
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reduced = useMediaQuery(REDUCED_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const n = slides.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [paused, reduced, next]);

  const prevIdx = (index - 1 + n) % n;
  const nextIdx = (index + 1) % n;

  return (
    <section
      aria-roledescription="carosello"
      aria-label={ariaLabel}
      className="relative h-[calc(100svh-84px)] w-full overflow-hidden bg-black md:h-[calc(100svh-104px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        setPaused(true);
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        setPaused(false);
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 50) prev();
        else if (dx < -50) next();
        touchX.current = null;
      }}
    >
      {/* Track a scorrimento laterale */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0" aria-hidden={i !== index}>
            {/* Clip video muta in loop (blueprint: media misti nella hero);
                su mobile usa la variante verticale se disponibile */}
            {slide.video && (i === index || i === prevIdx || i === nextIdx) && !reduced ? (
              <video
                key={isMobile && slide.videoMobile ? slide.videoMobile : slide.video}
                src={isMobile && slide.videoMobile ? slide.videoMobile : slide.video}
                poster={isMobile && slide.srcMobile ? slide.srcMobile : slide.src}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <SlideImage slide={slide} priority={i === 0} />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

            {/* Titolo slide, grande, a sinistra (come tema attuale) */}
            <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-8 text-white md:px-24 lg:px-32">
              <h2 className="text-5xl font-bold tracking-[0.02em] uppercase md:text-7xl lg:text-8xl">
                {slide.title}
              </h2>
              <Link
                href={slide.href}
                className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.2em] uppercase text-white/85 transition-colors hover:text-white"
              >
                <span aria-hidden>→</span> {ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Striscia laterale sinistra: slide precedente con titolo verticale */}
      <button
        type="button"
        onClick={prev}
        aria-label={prevLabel}
        className="group absolute inset-y-0 left-0 z-20 hidden overflow-hidden border-r border-white/10 md:block"
        style={{ width: STRIP_W }}
      >
        <Image
          src={slides[prevIdx].src}
          alt=""
          fill
          sizes={`${STRIP_W}px`}
          className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
        <span className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/25" />
        <span className="vertical-title absolute inset-0 flex items-center justify-center text-white">
          {slides[prevIdx].title}
        </span>
      </button>

      {/* Striscia laterale destra: slide successiva con titolo verticale */}
      <button
        type="button"
        onClick={next}
        aria-label={nextLabel}
        className="group absolute inset-y-0 right-0 z-20 hidden overflow-hidden border-l border-white/10 md:block"
        style={{ width: STRIP_W }}
      >
        <Image
          src={slides[nextIdx].src}
          alt=""
          fill
          sizes={`${STRIP_W}px`}
          className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
        <span className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/25" />
        <span className="vertical-title absolute inset-0 flex items-center justify-center text-white">
          {slides[nextIdx].title}
        </span>
      </button>

      {/* Dots (area tap ampia per mobile, pallino piccolo visivo) */}
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={slide.title}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="flex h-10 w-7 items-center justify-center"
          >
            <span
              className={`h-2 w-2 rounded-full transition-all ${
                i === index ? "scale-110 bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
