# maurotoncelli.it — sito 2026

Ricostruzione del sito in Next.js (App Router) secondo `../BLUEPRINT.md`:
stessa estetica, struttura Servizi/Portfolio risolta, performance e GA4.

## Comandi

```bash
npm run dev     # sviluppo su http://localhost:3000
npm run build   # build di produzione (statica/SSG)
```

## Struttura

- **Multilingua**: route `/it /en /de /fr /es`; tutti i testi sono data-driven in
  `src/i18n/messages/<lingua>.ts` (l'italiano è la fonte, le altre lingue sono
  traduzioni da revisionare). Selettore lingua nell'header.
- `src/data/services.ts` — dati strutturali dei 6 macro-servizi + drone (prezzi, gallery); i testi stanno nei messages.
- `src/data/portfolio.ts` — categorie portfolio (forti + nicchie/tag) collegate ai gruppi di immagini.
- `src/data/videos.ts` — i 7 video del portfolio con titoli e clienti reali.
- `src/data/journal.json` — articoli storici importati da WordPress; i nuovi si creano dal pannello.
- `src/data/media.json`, `hero.json`, `journal-cms.json` — **generati** da `scripts/genera-dati.ts` a partire da `content/` (non modificarli a mano).
- `content/` — contenuti gestiti dal pannello `/keystatic` (gallerie, hero, nuovi articoli).
- `public/images/` — immagini ottimizzate (max 2400px, JPEG q80).
- `public/videos/` — video compressi con ffmpeg (audio incluso) + poster.
- `next.config.ts` — redirect 301 dai vecchi URL WordPress (servizi, about, articoli data-based).

## Pannello di gestione (Keystatic)

Su `/keystatic` si gestiscono senza toccare il codice:

- **Gallerie foto** — una voce per gruppo (`home`, `about`, `clienti` + categorie
  portfolio): aggiungere/cancellare foto, riordinare (la prima è la copertina),
  dare un **titolo** a ogni foto (usato come alt/SEO).
- **Hero (home)** — le slide: immagine, categoria, video; il **crop verticale
  9:16 per mobile viene generato in automatico** al build se non indicato.
- **Journal** — nuovi articoli in markdown con immagini.

Ogni salvataggio diventa un **commit su GitHub** → Vercel rideploya da solo
(1-2 minuti). Lo script `npm run genera-dati` (eseguito in automatico prima di
ogni build) trasforma `content/` nei JSON consumati dal sito e genera i crop.

### Setup una tantum della GitHub App (per usare il pannello online)

1. In locale: `npm run dev`, aprire `http://localhost:3000/keystatic` →
   il wizard "Setup GitHub" crea la GitHub App sul repo e scrive le chiavi in `.env`.
2. Copiare su Vercel (Settings → Environment Variables) le variabili generate:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
   `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Redeploy: da quel momento `https://<dominio>/keystatic` funziona da qualsiasi
   dispositivo con il login GitHub.

Per lavorare in locale senza passare da GitHub: `KEYSTATIC_STORAGE=local npm run dev`
(le modifiche scrivono direttamente sui file, poi commit manuale).

## Immagini

Gli originali scaricati dal sito attuale sono in `../assets/site-images/`
(organizzati per pagina, con `manifest.csv`). Per rigenerare le versioni
ottimizzate e `media.json`:

```bash
python3 ../scripts/prepara-media.py
```

## Analytics (GA4)

Impostare la variabile d'ambiente (in locale in `.env.local`, su Vercel nelle
Environment Variables):

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Eventi già tracciati: `contact_form_submit`, `portfolio_filter`, `gallery_open`,
`video_play`, `cta_quote_click`.

Nota: l'ID va copiato da GA4 → Amministrazione → Stream di dati (formato
`G-XXXXXXXXXX`). Il vecchio sito WordPress usa un container GTM (`GTM-WN4F4WF`):
non è l'ID giusto per questa variabile. In GA4 attivare la "misurazione
avanzata" per tracciare i cambi pagina della navigazione client-side.

## Cookie banner (GDPR)

Banner in tutte le lingue con "Accetta tutti / Rifiuta / Gestisci impostazioni"
(`CookieBanner.tsx`). GA4 si carica **solo dopo il consenso** (Consent Mode v2,
ads sempre negati, IP anonimizzato); i cookie tecnici (tema, lingua, proof)
sono sempre attivi. La scelta è salvata in `localStorage` e revocabile dal
link "Preferenze cookie" nel footer.

## Deploy su Vercel

Importare la cartella `site/` come progetto Vercel (framework: Next.js).
I redirect 301 e la sitemap sono già configurati.

## Proof gallery (area clienti)

Come il PixProof del sito WordPress: gallery private protette da password,
raggiungibili da `/<lingua>/proof` (link nel footer; il vecchio `/clients`
reindirizza qui). Il cliente inserisce la password e vede solo la sua gallery,
con foto numerate per comunicare la selezione.

Per aggiungere una gallery:

1. Aggiungere la voce in `src/data/proof.ts` (slug, titolo, gruppo immagini
   in `media.json`).
2. Impostare la password nella variabile d'ambiente `PROOF_GALLERIES`
   (formato `slug:password,slug2:password2`) su Vercel o in `.env.local`.
3. Facoltativo ma consigliato in produzione: impostare anche `PROOF_SECRET`
   (stringa casuale) per firmare i cookie di accesso.

La gallery `demo` ha password di sviluppo `anteprima`. Le pagine proof sono
escluse da robots e sitemap.

## Fase 2 (area riservata completa)

Se in futuro servirà più della proof gallery (download file ad alta
risoluzione, contratti), il blueprint prevede auth + storage con link firmati.
Lo stack Next.js è già pronto per aggiungerla senza cambiare piattaforma.
