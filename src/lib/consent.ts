export type ConsentValue = "granted" | "denied";

const KEY = "cookie-consent";
export const CONSENT_CHANGE_EVENT = "cookie-consent-change";
export const CONSENT_OPEN_EVENT = "cookie-consent-open";

export function getConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

/** Riapre il banner (es. dal link "Preferenze cookie" nel footer). */
export function openConsentBanner() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
