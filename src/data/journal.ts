import legacyPosts from "./journal.json";
import cmsPosts from "./journal-cms.json";
import translationsEn from "./journal-i18n/en.json";
import translationsDe from "./journal-i18n/de.json";
import translationsFr from "./journal-i18n/fr.json";
import translationsEs from "./journal-i18n/es.json";

export type JournalPost = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  categories: string[];
  cover: { src: string; width: number; height: number } | null;
  content: string;
};

type Translation = { title: string; excerpt: string; content: string };

const translations: Record<string, Record<string, Translation>> = {
  en: translationsEn,
  de: translationsDe,
  fr: translationsFr,
  es: translationsEs,
};

/**
 * Post nella lingua richiesta: usa la traduzione se esiste, altrimenti
 * l'originale (gli articoli nuovi dal CMS restano in originale finché
 * non vengono tradotti).
 */
export function localizedPost(post: JournalPost, locale: string): JournalPost {
  const t = translations[locale]?.[post.slug];
  return t ? { ...post, title: t.title, excerpt: t.excerpt, content: t.content } : post;
}

export function hasTranslation(slug: string, locale: string) {
  return locale === "it" || Boolean(translations[locale]?.[slug]);
}

/**
 * Articoli storici (importati da WordPress, journal.json) + nuovi articoli
 * creati dal pannello /keystatic (journal-cms.json, generato al prebuild).
 */
export const journalPosts = [
  ...(cmsPosts as JournalPost[]),
  ...(legacyPosts as JournalPost[]),
].sort((a, b) => (a.date < b.date ? 1 : -1));

export const journalCategories = Array.from(
  new Set(journalPosts.flatMap((p) => p.categories))
).sort();

export function postBySlug(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}

export function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
