import type { Metadata } from "next";
import { JournalList } from "@/components/JournalList";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.journal.eyebrow, description: m.journal.metaDescription, alternates: pageAlternates(locale, "/journal") };
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
      <p className="eyebrow">{m.journal.eyebrow}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{m.journal.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{m.journal.intro}</p>
      <div className="mt-10">
        <JournalList locale={locale} allLabel={m.journal.all} />
      </div>
    </div>
  );
}
