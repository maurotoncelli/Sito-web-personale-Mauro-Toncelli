import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { proofGalleryBySlug } from "@/data/proof";
import { proofCookieName, proofToken } from "@/lib/proof-auth";
import { mediaGroup } from "@/data/portfolio";
import { ProofGallery } from "@/components/ProofGallery";
import { getMessages, isLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const gallery = proofGalleryBySlug(slug);
  return {
    title: gallery?.title,
    robots: { index: false, follow: false },
  };
}

export default async function ProofGalleryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const gallery = proofGalleryBySlug(slug);
  if (!gallery) notFound();

  const store = await cookies();
  if (store.get(proofCookieName(slug))?.value !== proofToken(slug)) {
    redirect(`/${locale}/proof`);
  }

  const m = getMessages(locale);
  const items = mediaGroup(gallery.mediaKey);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">{m.proof.eyebrow}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{gallery.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{m.proof.galleryHint}</p>

      <div className="mt-10">
        <ProofGallery
          items={items}
          galleryTitle={gallery.title}
          storageKey={`mt-proof-sel-${gallery.slug}`}
          proof={m.proof}
          common={m.common}
        />
      </div>
    </div>
  );
}
