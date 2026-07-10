/**
 * Prebuild (blueprint §13): trasforma i contenuti gestiti da Keystatic
 * (content/) nei dati consumati dal sito (src/data/*.json):
 *
 * 1. content/gallerie/*.yaml  → src/data/media.json  (dimensioni via image-size)
 * 2. content/hero.yaml        → src/data/hero.json   (+ crop 9:16 automatici con sharp)
 * 3. content/journal/*.mdoc   → src/data/journal-cms.json (Markdoc → HTML)
 *
 * Gira in `npm run build` (anche su Vercel), quindi ogni commit dal pannello
 * /keystatic produce automaticamente i dati aggiornati nel deploy.
 */
import fs from "node:fs";
import path from "node:path";
import { createReader } from "@keystatic/core/reader";
import Markdoc from "@markdoc/markdoc";
import { imageSize } from "image-size";
import sharp from "sharp";
import keystaticConfig from "../keystatic.config";

const root = process.cwd();
const reader = createReader(root, keystaticConfig);
const SPECIALI = new Set(["home", "about", "clienti"]);

function dimensioni(publicSrc: string) {
  const file = path.join(root, "public", publicSrc);
  const info = imageSize(fs.readFileSync(file));
  // EXIF orientation 5-8 = ruotata di 90°: larghezza e altezza vanno scambiate
  const ruotata = (info.orientation ?? 1) >= 5;
  return {
    width: ruotata ? info.height : info.width,
    height: ruotata ? info.width : info.height,
  };
}

async function generaMedia() {
  const groups: Record<string, unknown[]> = {};
  const entries = await reader.collections.gallerie.all();
  for (const entry of entries) {
    const slug = entry.slug;
    const key = SPECIALI.has(slug) ? slug : `portfolio/${slug}`;
    groups[key] = entry.entry.foto.map((f) => {
      const src = f.immagine as string;
      const { width, height } = dimensioni(src);
      return { src, width, height, ...(f.titolo ? { title: f.titolo } : {}) };
    });
  }
  fs.writeFileSync(
    path.join(root, "src/data/media.json"),
    JSON.stringify(groups, null, 1)
  );
  const tot = Object.values(groups).reduce((n, g) => n + g.length, 0);
  console.log(`media.json — ${entries.length} gruppi, ${tot} foto`);
}

/** Crop 9:16 centrale per la hero mobile, se non esiste già. */
async function cropVerticale(src: string): Promise<string> {
  const nome = path.basename(src);
  const rel = `/images/home/mobile/${nome}`;
  const out = path.join(root, "public", rel);
  if (!fs.existsSync(out)) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(path.join(root, "public", src))
      .rotate() // applica l'orientamento EXIF
      .resize({ width: 1080, height: 1920, fit: "cover", position: "centre" })
      .jpeg({ quality: 78 })
      .toFile(out);
    console.log(`crop 9:16 generato: ${rel}`);
  }
  return rel;
}

async function generaHero() {
  const hero = await reader.singletons.hero.read();
  if (!hero) throw new Error("content/hero.yaml mancante");
  const slides = [];
  for (const s of hero.slides) {
    let srcMobile = s.immagineMobile || undefined;
    if (!srcMobile && !s.video && s.immagine.startsWith("/images/")) {
      srcMobile = await cropVerticale(s.immagine);
    }
    slides.push({
      src: s.immagine,
      ...(srcMobile ? { srcMobile } : {}),
      ...(s.video ? { video: s.video } : {}),
      ...(s.videoMobile ? { videoMobile: s.videoMobile } : {}),
      categoria: s.categoria,
      ...(s.filtro ? { filterSlug: s.filtro } : {}),
      ...(s.ancora ? { anchor: s.ancora } : {}),
    });
  }
  fs.writeFileSync(path.join(root, "src/data/hero.json"), JSON.stringify(slides, null, 2));
  console.log(`hero.json — ${slides.length} slide`);
}

async function generaJournal() {
  const entries = await reader.collections.journal.all({ resolveLinkedFiles: true });
  const posts = [];
  for (const entry of entries) {
    const e = entry.entry;
    const transformed = Markdoc.transform(e.content.node);
    const html = Markdoc.renderers.html(transformed);
    posts.push({
      slug: entry.slug,
      date: e.date,
      title: e.title,
      excerpt: e.excerpt,
      categories: e.categories,
      cover: e.cover ? { src: e.cover, ...dimensioni(e.cover) } : null,
      content: html,
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  fs.writeFileSync(
    path.join(root, "src/data/journal-cms.json"),
    JSON.stringify(posts, null, 2)
  );
  console.log(`journal-cms.json — ${posts.length} articoli dal pannello`);
}

async function main() {
  await generaMedia();
  await generaHero();
  await generaJournal();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
