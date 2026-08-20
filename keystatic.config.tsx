import { config, collection, singleton, fields } from "@keystatic/core";

/**
 * Backend di gestione contenuti (blueprint §13).
 * - In produzione (e nel setup iniziale): storage GitHub — ogni salvataggio dal
 *   pannello /keystatic diventa un commit sul repo, Vercel rideploya.
 * - Con KEYSTATIC_STORAGE=local (sviluppo): scrive direttamente sui file locali.
 * I dati del pannello vivono in content/ e vengono trasformati in
 * src/data/*.json dallo script prebuild (scripts/genera-dati.ts).
 */

const storage =
  process.env.KEYSTATIC_STORAGE === "local"
    ? ({ kind: "local" } as const)
    : ({
        kind: "github",
        repo: { owner: "maurotoncelli", name: "Sito-web-personale-Mauro-Toncelli" },
      } as const);

/** Categorie selezionabili per le slide della hero (etichette i18n sul sito). */
const categorieHero = [
  { label: "Moda", value: "moda" },
  { label: "E-commerce", value: "e-commerce" },
  { label: "Architettura & Interni", value: "architettura-interni" },
  { label: "Architettura & Real Estate (slide unica)", value: "architettura-real-estate" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Prodotto", value: "prodotto" },
  { label: "Food", value: "food" },
  { label: "Punti vendita", value: "negozi" },
  { label: "Corporate", value: "corporate" },
  { label: "Eventi", value: "eventi" },
  { label: "Matrimonio", value: "matrimonio" },
  { label: "Coppia & Engagement", value: "coppia" },
  { label: "Maternità", value: "maternita" },
  { label: "Video", value: "video" },
];

export default config({
  storage,
  ui: {
    brand: { name: "Mauro Toncelli — Sito" },
  },
  collections: {
    journal: collection({
      label: "Journal",
      slugField: "title",
      path: "content/journal/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Titolo" } }),
        date: fields.date({ label: "Data", validation: { isRequired: true } }),
        excerpt: fields.text({
          label: "Estratto",
          multiline: true,
          description: "Anteprima nell'elenco journal e meta description.",
        }),
        categories: fields.array(fields.text({ label: "Categoria" }), {
          label: "Categorie",
          itemLabel: (props) => props.value,
        }),
        cover: fields.image({
          label: "Copertina",
          directory: "public/images/journal",
          publicPath: "/images/journal/",
        }),
        htmlImportato: fields.text({
          label: "HTML importato (WordPress)",
          multiline: true,
          description:
            "Corpo originale importato. Se è compilato, il sito usa questo HTML (così gallery e video restano identici). Le traduzioni EN/DE/FR/ES/ZH/RU/AR restano collegate allo slug. Per riscrivere l'articolo nell'editor Markdoc, svuota questo campo.",
        }),
        content: fields.markdoc({
          label: "Contenuto (editor)",
          options: {
            image: {
              directory: "public/images/journal",
              publicPath: "/images/journal/",
            },
          },
        }),
      },
    }),
    gallerie: collection({
      label: "Gallerie foto",
      slugField: "gruppo",
      path: "content/gallerie/*",
      format: { data: "yaml" },
      schema: {
        gruppo: fields.slug({
          name: {
            label: "Gruppo",
            description:
              "home, about, clienti oppure lo slug della categoria portfolio (moda, e-commerce, …).",
          },
        }),
        foto: fields.array(
          fields.object({
            immagine: fields.image({
              label: "Immagine",
              directory: "public/images/uploads",
              publicPath: "/images/uploads/",
              validation: { isRequired: true },
            }),
            titolo: fields.text({
              label: "Titolo (testo alternativo)",
              description: "Usato come alt per SEO e accessibilità.",
            }),
            didascalia: fields.text({
              label: "Didascalia (lightbox)",
              description:
                "Visibile sotto la foto nel lightbox. Es. #sardegna  @modella  @assistant",
            }),
          }),
          {
            label: "Foto (trascina per riordinare, la prima è la copertina)",
            itemLabel: (props) =>
              props.fields.didascalia.value || props.fields.titolo.value || "foto",
          }
        ),
      },
    }),
  },
  singletons: {
    hero: singleton({
      label: "Hero (home)",
      path: "content/hero",
      format: { data: "yaml" },
      schema: {
        slides: fields.array(
          fields.object({
            immagine: fields.text({
              label: "Immagine (percorso, es. /images/home/foto.jpg)",
              validation: { isRequired: true },
            }),
            immagineMobile: fields.text({
              label: "Crop verticale mobile (vuoto = generato in automatico)",
            }),
            video: fields.text({ label: "Video (percorso, opzionale)" }),
            videoMobile: fields.text({ label: "Video verticale mobile (opzionale)" }),
            categoria: fields.select({
              label: "Categoria",
              options: categorieHero,
              defaultValue: "moda",
            }),
            filtro: fields.text({
              label: "Filtro portfolio (se diverso dalla categoria)",
            }),
            ancora: fields.text({ label: "Ancora interna (es. #video)" }),
          }),
          {
            label: "Slide",
            itemLabel: (props) => props.fields.categoria.value,
          }
        ),
      },
    }),
  },
});
