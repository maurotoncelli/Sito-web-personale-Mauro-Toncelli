"use client";

import { useEffect, useState } from "react";
import type { Messages } from "@/i18n";
import { CONSENT_OPEN_EVENT, getConsent, setConsent } from "@/lib/consent";

/**
 * Cookie banner GDPR: "Accetta tutti" / "Rifiuta" / "Gestisci impostazioni".
 * GA4 parte solo dopo il consenso (vedi Analytics.tsx). La scelta è salvata
 * in localStorage e riapribile dal link "Preferenze cookie" nel footer.
 */
export function CookieBanner({ t }: { t: Messages["cookies"] }) {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [statsChecked, setStatsChecked] = useState(true);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    const open = () => {
      setStatsChecked(getConsent() === "granted");
      setManage(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  if (!visible) return null;

  const close = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
    setManage(false);
  };

  const btn =
    "px-5 py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.title}
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-5 md:px-8">
        <h2 className="text-sm font-semibold tracking-[0.1em] uppercase">{t.title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">{t.text}</p>

        {manage && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 max-w-3xl">
            <div className="border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase">
                  {t.necessaryTitle}
                </h3>
                <input type="checkbox" checked disabled aria-label={t.necessaryTitle} />
              </div>
              <p className="mt-2 text-xs text-muted">{t.necessaryText}</p>
            </div>
            <div className="border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase">
                  {t.statsTitle}
                </h3>
                <input
                  type="checkbox"
                  checked={statsChecked}
                  onChange={(e) => setStatsChecked(e.target.checked)}
                  aria-label={t.statsTitle}
                />
              </div>
              <p className="mt-2 text-xs text-muted">{t.statsText}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {manage ? (
            <button
              type="button"
              onClick={() => close(statsChecked ? "granted" : "denied")}
              className={`${btn} border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground`}
            >
              {t.save}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => close("granted")}
                className={`${btn} border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground`}
              >
                {t.acceptAll}
              </button>
              <button
                type="button"
                onClick={() => close("denied")}
                className={`${btn} border border-border text-muted hover:border-foreground hover:text-foreground`}
              >
                {t.reject}
              </button>
              <button
                type="button"
                onClick={() => setManage(true)}
                className="text-[12px] font-medium tracking-[0.15em] uppercase text-muted underline underline-offset-4 hover:text-foreground"
              >
                {t.manage}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
