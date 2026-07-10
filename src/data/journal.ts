import posts from "./journal.json";

export type JournalPost = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  categories: string[];
  cover: { src: string; width: number; height: number } | null;
  content: string;
};

export const journalPosts = posts as JournalPost[];

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
