import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mukta } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IrisLoader } from "@/components/IrisLoader";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { site } from "@/data/site";
import { getMessages, isLocale, locales } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

const mukta = Mukta({
  variable: "--font-mukta",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: m.meta.titleDefault,
      template: `%s — ${site.name}`,
    },
    description: m.meta.description,
    // Le sottopagine sovrascrivono con il proprio path in generateMetadata
    alternates: pageAlternates(locale),
    openGraph: {
      siteName: site.name,
      locale,
      type: "website",
      images: [{ url: "/images/home/DSC7090-copia.jpg", width: 1920, height: 1280, alt: site.name }],
    },
    // Google Search Console: meta tag di verifica via env (nessun redeploy di codice)
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

// L'iris loader è nell'HTML del server (copre la pagina fin dal primo paint,
// niente flash). Questo script — eseguito in modo sincrono prima del paint —
// lo spegne se l'animazione è già stata vista nella sessione o se l'utente
// preferisce ridurre il movimento.
const irisInit = `(function(){try{if(sessionStorage.getItem("iris-seen")||window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-iris","off")}else{sessionStorage.setItem("iris-seen","1")}}catch(e){}})()`;

/** Person + WebSite: entità globali per Google e crawler AI. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: "Photographer & Videomaker",
      url: site.url,
      email: site.email,
      sameAs: Object.values(site.social),
      workLocation: [
        { "@type": "Place", name: "Neuchâtel, Switzerland" },
        { "@type": "Place", name: "Florence / Peccioli, Tuscany, Italy" },
      ],
      knowsLanguage: ["it", "en", "fr"],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#person` },
      inLanguage: locales,
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    // suppressHydrationWarning: data-theme viene impostato dallo script inline
    // prima dell'idratazione, quindi il server non lo conosce (pattern standard)
    <html lang={locale} className={`${mukta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Script inline puri (non next/script): devono eseguire in modo
            sincrono durante il parse, prima del primo paint. `beforeInteractive`
            li accoderebbe al runtime Next, che su Safari arriva dopo il paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script dangerouslySetInnerHTML={{ __html: irisInit }} />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <IrisLoader />
        <Header locale={locale} nav={m.nav} languageLabel={m.common.language} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} nav={m.nav} claim={m.brand.claim} locations={m.brand.locations} droneLink={m.footer.droneLink} proofLink={m.footer.proofLink} cookiePrefsLabel={m.cookies.prefsLink} />
        <CookieBanner t={m.cookies} />
        <Analytics />
      </body>
    </html>
  );
}
