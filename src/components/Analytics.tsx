"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_CHANGE_EVENT, getConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4 (blueprint §8), caricato SOLO dopo il consenso del cookie banner
 * (approccio conforme GDPR/Garante). Consent Mode v2: ads sempre negati,
 * statistiche concesse perché l'utente ha accettato.
 */
export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(getConsent() === "granted");
    check();
    window.addEventListener(CONSENT_CHANGE_EVENT, check);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, check);
  }, []);

  if (!GA_ID || !enabled) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}

/** Helper per eventi GA4 dai client component (CTA, form, gallery). */
export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params);
}
