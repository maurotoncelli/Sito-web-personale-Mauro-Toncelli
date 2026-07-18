import { it, type Messages } from "./messages/it";
import { en } from "./messages/en";
import { de } from "./messages/de";
import { fr } from "./messages/fr";
import { es } from "./messages/es";
import { zh } from "./messages/zh";
import { ru } from "./messages/ru";
import { ar } from "./messages/ar";
import { defaultLocale, isLocale, type Locale } from "./config";

const all: Record<Locale, Messages> = { it, en, de, fr, es, zh, ru, ar };

export function getMessages(locale: string): Messages {
  return all[isLocale(locale) ? locale : defaultLocale];
}

export type { Messages };
export * from "./config";
