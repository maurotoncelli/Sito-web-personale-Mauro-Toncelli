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
- `src/data/journal.json` — articoli importati da WordPress con `../scripts/importa-journal.py`.
- `src/data/media.json` — indice immagini generato da `../scripts/prepara-media.py`.
- `src/data/home.ts` — slide della hero.
- `public/images/` — immagini ottimizzate (max 2400px, JPEG q80).
- `public/videos/` — video compressi con ffmpeg (audio incluso) + poster.
- `next.config.ts` — redirect 301 dai vecchi URL WordPress (servizi, about, articoli data-based).

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
