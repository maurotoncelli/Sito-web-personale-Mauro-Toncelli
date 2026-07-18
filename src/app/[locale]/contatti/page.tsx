import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";
import { site } from "@/data/site";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.contact.title, description: m.contact.metaDescription, alternates: pageAlternates(locale, "/contatti") };
}

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = m.contact;
  const serviceOptions = Object.values(m.services.items).map((s) => s.name);

  return (
    <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 md:grid-cols-2 md:px-8">
      <div>
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{c.title}</h1>
        <p className="mt-4 max-w-md text-muted">{c.intro}</p>

        <div className="mt-10 space-y-6 text-sm">
          <div>
            <p className="eyebrow">{c.emailLabel}</p>
            <a href={`mailto:${site.email}`} className="mt-1 inline-block text-lg hover:underline">
              {site.email}
            </a>
          </div>
          <div>
            <p className="eyebrow">{c.whatsappLabel}</p>
            <a
              href={`tel:${site.business.telephone}`}
              className="mt-1 inline-block text-lg hover:underline"
            >
              {site.business.telephone.replace(/^\+39/, "+39 ")}
            </a>
            <a
              href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(c.whatsappPrefill)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase text-white transition-opacity hover:opacity-85"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 8.96 8.96 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.82 9.82 0 0 1-1.51-5.26 9.9 9.9 0 0 1 9.9-9.88 9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7 9.9 9.9 0 0 1-9.9 9.87zm8.42-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L.06 24l6.3-1.65a11.87 11.87 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4z" />
              </svg>
              {c.whatsappCta}
            </a>
          </div>
          <div>
            <p className="eyebrow">{c.whereLabel}</p>
            <p className="mt-1 text-muted">{m.brand.locations}</p>
          </div>
          <div>
            <p className="eyebrow">{c.socialLabel}</p>
            <SocialIcons className="mt-2" />
          </div>
        </div>
      </div>

      <div>
        <ContactForm form={c.form} serviceOptions={serviceOptions} />
      </div>
    </div>
  );
}
