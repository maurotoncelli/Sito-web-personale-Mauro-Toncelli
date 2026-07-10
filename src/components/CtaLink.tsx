"use client";

import Link from "next/link";
import { trackEvent } from "@/components/Analytics";

/** Link CTA con evento GA4 (blueprint §8: tracciare i click "richiedi preventivo"). */
export function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("cta_quote_click", { from: window.location.pathname })}
    >
      {children}
    </Link>
  );
}
