"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/components/Analytics";

/**
 * CTA sticky mobile per la landing e-commerce: compare dopo lo scroll oltre
 * l'hero, pensata per il traffico da QR/link. Solo mobile (nascosta da md in su,
 * dove la CTA dell'hero resta visibile). Traccia il click come cta_quote_click.
 */
export function StickyQuoteCta({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href={href}
        onClick={() => trackEvent("cta_quote_click", { from: "ecommerce-sticky" })}
        className="block w-full bg-foreground py-3 text-center text-[13px] font-medium tracking-[0.2em] uppercase text-background"
      >
        {label}
      </Link>
    </div>
  );
}
