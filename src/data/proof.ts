/**
 * Proof gallery — area clienti protetta da password, come il PixProof
 * del sito WordPress originale: ogni cliente riceve una password che
 * apre solo la sua gallery.
 *
 * Le password stanno nella variabile d'ambiente PROOF_GALLERIES nel
 * formato "slug:password,slug2:password2" (su Vercel: Settings →
 * Environment Variables). La gallery demo ha un fallback per lo sviluppo.
 */
export type ProofGallery = {
  slug: string;
  title: string;
  /** gruppo immagini in media.json */
  mediaKey: string;
};

export const proofGalleries: ProofGallery[] = [
  { slug: "demo", title: "Wedding — Castelfalfi (demo)", mediaKey: "portfolio/matrimonio" },
];

export function proofGalleryBySlug(slug: string) {
  return proofGalleries.find((g) => g.slug === slug);
}

export function proofPasswords(): Record<string, string> {
  const map: Record<string, string> = { demo: "anteprima" };
  const env = process.env.PROOF_GALLERIES;
  if (env) {
    for (const pair of env.split(",")) {
      const [slug, password] = pair.split(":");
      if (slug?.trim() && password?.trim()) map[slug.trim()] = password.trim();
    }
  }
  return map;
}
