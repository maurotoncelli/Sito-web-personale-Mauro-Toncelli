"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { VideoItem } from "@/data/videos";
import { trackEvent } from "./Analytics";

/**
 * Griglia video del portfolio: anteprime brevi mute in AUTOPLAY quando entrano
 * nello schermo (clip ~4s, <400KB), click → lightbox con video completo e
 * audio. Con prefers-reduced-motion si torna al poster statico.
 */
function AutoPreview({ video, className }: { video: VideoItem; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Play solo quando visibile (risparmia batteria/banda su liste lunghe)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={video.preview}
      poster={video.poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      aria-hidden
    />
  );
}
export function VideoShowcase({
  videos,
  playLabel,
  closeLabel,
}: {
  videos: VideoItem[];
  playLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState<VideoItem | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const horizontal = videos.filter((v) => !v.vertical);
  const vertical = videos.filter((v) => v.vertical);

  const card = (video: VideoItem) => (
    <button
      key={video.src}
      type="button"
      onClick={() => {
        setOpen(video);
        trackEvent("video_play", { video: `${video.client} — ${video.title}` });
      }}
      className="group block w-full text-left"
      aria-label={`${playLabel}: ${video.client} — ${video.title}`}
    >
      <div className={`relative overflow-hidden ${video.vertical ? "aspect-[9/16]" : "aspect-video"}`}>
        {reduced ? (
          <Image
            src={video.poster}
            alt={`${video.client} — ${video.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <AutoPreview
            video={video}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur-sm transition-transform group-hover:scale-110">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <p className="mt-2 text-[13px] font-medium tracking-[0.1em] uppercase">{video.client}</p>
      <p className="text-sm text-muted">{video.title}</p>
    </button>
  );

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">{horizontal.map(card)}</div>
      {vertical.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">{vertical.map(card)}</div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${open.client} — ${open.title}`}
          onClick={() => setOpen(null)}
        >
          <video
            src={open.src}
            poster={open.poster}
            controls
            autoPlay
            playsInline
            className={`max-h-[90vh] max-w-full ${open.vertical ? "h-[90vh]" : "w-full max-w-6xl"}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label={closeLabel}
            className="absolute top-5 right-5 text-3xl text-white/70 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
