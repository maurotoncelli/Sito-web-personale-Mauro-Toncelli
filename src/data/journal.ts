import legacyPosts from "./journal.json";
import cmsPosts from "./journal-cms.json";

export type JournalPost = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  categories: string[];
  cover: { src: string; width: number; height: number } | null;
  content: string;
};

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
