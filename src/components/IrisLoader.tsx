"use client";

import { useEffect, useState } from "react";

/**
 * Loader "diaframma" (blueprint §3): un'apertura circolare rivela la pagina
 * al primo caricamento della sessione. Leggero (solo SVG + CSS), rispetta
 * prefers-reduced-motion e non blocca l'LCP.
 */
export function IrisLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("iris-seen")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      sessionStorage.setItem("iris-seen", "1");
      const raf = requestAnimationFrame(() => setShow(true));
      const t = setTimeout(() => setShow(false), 1600);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    } catch {}
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ animation: "iris-fade 0.4s ease 1.2s forwards" }}
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="iris-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle
              cx="50%"
              cy="50%"
              r="4%"
              fill="black"
              style={{ animation: "iris-open 1.2s cubic-bezier(0.7, 0, 0.3, 1) forwards" }}
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#0a0a0a" mask="url(#iris-mask)" />
      </svg>
    </div>
  );
}
