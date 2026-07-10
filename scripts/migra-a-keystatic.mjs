/**
 * Migrazione una tantum (blueprint §13): porta media.json e le slide hero
 * dentro content/ nel formato delle collections Keystatic.
 * Da rieseguire solo se si ricostruisce content/ da zero.
 */
import fs from "node:fs";
import path from "node:path";
import { stringify } from "yaml";

const root = process.cwd();
const media = JSON.parse(fs.readFileSync(path.join(root, "src/data/media.json"), "utf8"));

// ── Gallerie: un file YAML per gruppo
const dir = path.join(root, "content/gallerie");
fs.mkdirSync(dir, { recursive: true });
const SPECIALI = new Set(["home", "about", "clienti"]);

for (const [key, items] of Object.entries(media)) {
  const slug = SPECIALI.has(key) ? key : key.replace(/^portfolio\//, "");
  const data = {
    gruppo: slug,
    foto: items.map((i) => ({ immagine: i.src, titolo: i.title ?? "" })),
  };
  fs.writeFileSync(path.join(dir, `${slug}.yaml`), stringify(data));
  console.log(`gallerie/${slug}.yaml — ${items.length} foto`);
}

// ── Hero: singleton con le slide attuali (da src/data/home.ts)
const slides = [
  { immagine: "/images/home/DSC7090-copia.jpg", immagineMobile: "/images/home/mobile/DSC7090-copia.jpg", video: "", videoMobile: "", categoria: "moda", filtro: "", ancora: "" },
  { immagine: "/images/home/815834-2048x.jpg-copia-copia-scaled-e1729706764474.jpg", immagineMobile: "/images/home/mobile/815834-2048x.jpg-copia-copia-scaled-e1729706764474.jpg", video: "", videoMobile: "", categoria: "e-commerce", filtro: "", ancora: "" },
  { immagine: "/images/home/Ext-15-enhanced-sito-web.jpg", immagineMobile: "/images/home/mobile/Ext-15-enhanced-sito-web.jpg", video: "", videoMobile: "", categoria: "architettura-real-estate", filtro: "architettura-interni", ancora: "" },
  { immagine: "/images/home/Bocelli1831-2024Bottles-Blackbackground8.jpg", immagineMobile: "/images/home/mobile/Bocelli1831-2024Bottles-Blackbackground8.jpg", video: "", videoMobile: "", categoria: "prodotto", filtro: "", ancora: "" },
  { immagine: "/images/home/DSC4132.jpg", immagineMobile: "/images/home/mobile/DSC4132.jpg", video: "", videoMobile: "", categoria: "food", filtro: "", ancora: "" },
  { immagine: "/images/home/M.C.-Weddings-Castelfalfi-Maurotoncelli11.jpg", immagineMobile: "/images/home/mobile/M.C.-Weddings-Castelfalfi-Maurotoncelli11.jpg", video: "", videoMobile: "", categoria: "matrimonio", filtro: "", ancora: "" },
  { immagine: "/videos/showreel-45s-poster.jpg", immagineMobile: "", video: "/videos/showreel-45s.mp4", videoMobile: "/videos/reel-beach.mp4", categoria: "video", filtro: "", ancora: "#video" },
];
fs.writeFileSync(path.join(root, "content/hero.yaml"), stringify({ slides }));
console.log(`content/hero.yaml — ${slides.length} slide`);
