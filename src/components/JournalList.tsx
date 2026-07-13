"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { journalPosts, journalCategories, formatDate, localizedPost } from "@/data/journal";

export function JournalList({ locale, allLabel }: { locale: string; allLabel: string }) {
  const [cat, setCat] = useState<string | null>(null);
  const posts = (cat ? journalPosts.filter((p) => p.categories.includes(cat)) : journalPosts).map(
    (p) => localizedPost(p, locale)
  );

  const chip = (value: string | null, label: string) => (
    <button
      key={label}
      type="button"
      onClick={() => setCat(value)}
      aria-pressed={cat === value}
      className={`rounded-full border px-4 py-1.5 text-[13px] font-medium tracking-[0.05em] uppercase transition-colors ${
        cat === value
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {chip(null, allLabel)}
        {journalCategories.map((c) => chip(c, c))}
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/${locale}/journal/${post.slug}`} className="group block">
            {post.cover && (
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={post.cover.src}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}
            <p className="mt-4 text-xs font-medium tracking-[0.2em] text-muted uppercase">
              {formatDate(post.date, locale)}
              {post.categories.length > 0 && <> — {post.categories.join(", ")}</>}
            </p>
            <h2 className="mt-2 text-lg leading-snug tracking-[0.03em]">{post.title}</h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
