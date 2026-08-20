/**
 * Importa gli articoli WordPress (journal.json) in content/journal/*.mdoc
 * per Keystatic. Mantiene slug, date, categorie, copertine e HTML originale
 * così le traduzioni in journal-i18n/ (stesso slug) restano valide.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const posts = JSON.parse(fs.readFileSync(path.join(root, "src/data/journal.json"), "utf8"));
const outDir = path.join(root, "content/journal");
fs.mkdirSync(outDir, { recursive: true });

function yamlString(value) {
  return YAML.stringify(value, { lineWidth: 0 }).trimEnd();
}

for (const p of posts) {
  const coverRel = p.cover?.src?.replace(/^\/images\/journal\//, "") ?? "";
  const front = {
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    categories: p.categories,
    ...(coverRel ? { cover: coverRel } : {}),
    htmlImportato: p.content,
  };
  const body =
    "Articolo importato dal journal WordPress.\n\n" +
    "Il sito pubblica il campo **HTML importato** (testo italiano originale, gallery e video inclusi).\n" +
    "Le altre lingue restano in `src/data/journal-i18n/` e sono collegate a questo slug: `" +
    p.slug +
    "`.\n";
  const file = `---\n${yamlString(front)}\n---\n\n${body}`;
  fs.writeFileSync(path.join(outDir, `${p.slug}.mdoc`), file);
  console.log("OK", p.slug);
}

console.log(`\n${posts.length} articoli scritti in content/journal/`);
