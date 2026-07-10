import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalPosts, postBySlug, formatDate } from "@/data/journal";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: pageAlternates(locale, `/journal/${post.slug}`) };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  const m = getMessages(locale);

  return (
    <article className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/${locale}/journal`}
          className="text-xs font-medium tracking-[0.2em] text-muted uppercase hover:text-foreground"
        >
          ← {m.journal.back}
        </Link>
        <p className="mt-6 text-xs font-medium tracking-[0.2em] text-muted uppercase">
          {formatDate(post.date, locale)}
          {post.categories.length > 0 && <> — {post.categories.join(", ")}</>}
        </p>
        <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{post.title}</h1>
        {locale !== "it" && (
          <p className="mt-4 border-l-2 border-border pl-3 text-sm italic text-muted">
            {m.journal.originalNote}
          </p>
        )}
      </div>

      {post.cover && (
        <div className="relative mx-auto mt-10 max-w-5xl">
          <Image
            src={post.cover.src}
            alt={post.title}
            width={post.cover.width}
            height={post.cover.height}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="h-auto w-full"
          />
        </div>
      )}

      <div
        className="journal-content mt-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
