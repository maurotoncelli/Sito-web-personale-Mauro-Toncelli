import { it, type Messages } from "./messages/it";
import { en } from "./messages/en";
import { de } from "./messages/de";
import { fr } from "./messages/fr";
import { es } from "./messages/es";
import { defaultLocale, isLocale, type Locale } from "./config";

const all: Record<Locale, Messages> = { it, en, de, fr, es };

export function getMessages(locale: string): Messages {
  return all[isLocale(locale) ? locale : defaultLocale];
}

export type { Messages };
export * from "./config";
